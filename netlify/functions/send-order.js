// netlify/functions/send-order.js

import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * ENV (Netlify → Site settings → Build & deploy → Environment):
 * - ALLOWED_ORIGINS       lista po przecinku, np.:
 *     https://kickmy.app,https://www.kickmy.app,http://localhost:5173
 *   (dla zgodności: jeśli nie ustawisz ALLOWED_ORIGINS, użyjemy ALLOWED_ORIGIN)
 *
 * - ORDER_STORAGE_PATH    podkatalog w /tmp (opcjonalnie; domyślnie "orders")
 * - RESEND_API_KEY        (opcjonalnie)
 * - ORDER_EMAIL_FROM      (opcjonalnie)
 * - ORDER_EMAIL_TO        (opcjonalnie)
 *
 * Uwaga: frontend NIE przesyła sekretów.
 */

const RESEND_API_KEY   = process.env.RESEND_API_KEY || "";
const ORDER_EMAIL_FROM = process.env.ORDER_EMAIL_FROM || "";
const ORDER_EMAIL_TO   = process.env.ORDER_EMAIL_TO || "";

/** ───────── Wielu dozwolonych originów ───────── */
function parseAllowedOrigins() {
  const list =
    (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

  // dedupe + normalizacja (bez trailing slash)
  const norm = Array.from(new Set(list.map(stripSlash)));
  return norm;
}

function stripSlash(u) {
  return u.endsWith("/") ? u.slice(0, -1) : u;
}

function originFromUrlLike(u) {
  try {
    const url = new URL(u);
    return stripSlash(url.origin);
  } catch {
    return "";
  }
}

function matchesAllowed(origin, allowedList) {
  if (!origin) return false;
  // dokładne dopasowanie
  if (allowedList.includes(origin)) return true;

  // wsparcie dla wildcardów: *.domena.tld
  // przykład: wpisz w env: *.netlify.app
  for (const a of allowedList) {
    if (a.startsWith("*.")) {
      // a = *.netlify.app  -> hostSuffix = .netlify.app
      const hostSuffix = a.slice(1); // ".netlify.app"
      try {
        const o = new URL(origin);
        if (o.host.endsWith(hostSuffix)) return true;
      } catch {
        // origin mógł nie być pełnym URL, pomijamy
      }
    }
  }
  return false;
}

function pickCorsOrigin(origin, refererOrigin, allowedList, isDev) {
  // dev fallback (np. przy netlify dev) – możesz wyłączyć, jeśli chcesz twardo trzymać whitelistę:
  if (isDev) return origin || refererOrigin || "";

  if (matchesAllowed(origin, allowedList)) return origin;
  if (matchesAllowed(refererOrigin, allowedList)) return refererOrigin;
  return ""; // brak CORS dla nieakceptowanych
}

function buildCorsHeaders(allowOrigin) {
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

/** ───────── Ścieżka zapisu (tylko /tmp jest zapisywalne) ───────── */
function resolveWritableDir() {
  const p = process.env.ORDER_STORAGE_PATH || "orders";
  if (path.isAbsolute(p) && p.startsWith("/tmp")) return p;
  return path.join("/tmp", p);
}
const ORDER_DIR = resolveWritableDir();

/** ───────── Prosty rate-limit (best-effort) ───────── */
const RATE = { windowMs: 60 * 1000, max: 20 };
global.__rl = global.__rl || new Map();

function hit(ip) {
  const now = Date.now();
  const arr = (global.__rl.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  arr.push(now);
  global.__rl.set(ip, arr);
  return arr.length <= RATE.max;
}

/** ───────── Utilities ───────── */
function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeId(id) {
  if (typeof id !== "string" || !id.trim()) return crypto.randomUUID();
  return id.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}-${pad(d.getUTCMinutes())}-${pad(d.getUTCSeconds())}Z`;
}

function escapeHtml(s) {
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/** ───────── Opcjonalny e-mail przez Resend ───────── */
async function maybeSendEmail({ subject, text, html }) {
  if (!RESEND_API_KEY || !ORDER_EMAIL_FROM || !ORDER_EMAIL_TO) {
    return { sent: false, reason: "email-not-configured" };
  }

  const payload = {
    from: ORDER_EMAIL_FROM,
    to: [ORDER_EMAIL_TO],
    subject: subject || "New order",
    text: text || "",
    html: html || `<pre>${text ? escapeHtml(text) : "New order"}</pre>`,
  };

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const body = await r.text().catch(() => "");
    return { sent: false, status: r.status, body };
  }
  return { sent: true };
}

/** ───────── Handler ───────── */
export const handler = async (event) => {
  const allowedList = parseAllowedOrigins();
  const isDev = process.env.NODE_ENV === "development";

  // origins z nagłówków
  const originHdr  = stripSlash(event.headers.origin || "");
  const refererHdr = event.headers.referer || "";
  const refererOrigin = refererHdr ? originFromUrlLike(refererHdr) : "";

  // wybierz, co wpuścić i co wstawić do CORS
  const allowOrigin = pickCorsOrigin(originHdr, refererOrigin, allowedList, isDev);

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: buildCorsHeaders(allowOrigin), body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: buildCorsHeaders(allowOrigin), body: "Method Not Allowed" };
  }

  // Gate: jeśli allowOrigin pusty → 403
  if (!allowOrigin) {
    return { statusCode: 403, headers: buildCorsHeaders(""), body: "Forbidden: bad origin" };
  }

  // Rate limit
  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    "unknown";

  if (!hit(ip)) {
    return { statusCode: 429, headers: buildCorsHeaders(allowOrigin), body: "Too Many Requests" };
  }

  // Body
  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers: buildCorsHeaders(allowOrigin), body: "Invalid JSON" };
  }

  const orderId = safeId(data.orderId || data.invoiceNumber || "");
  const ts = nowStamp();

  // Zapis (JSON + ew. ZIP base64) w /tmp
  try {
    ensureDirSync(ORDER_DIR);

    const record = {
      _meta: {
        savedAt: new Date().toISOString(),
        ip,
        orderId,
        file: null,
        zipFile: null,
      },
      payload: data,
    };

    if (data.zipBase64) {
      const zipBuf = Buffer.from(data.zipBase64, "base64");
      const zipName = `${ts}__${orderId}__bundle.zip`;
      const zipPath = path.join(ORDER_DIR, zipName);
      fs.writeFileSync(zipPath, zipBuf);
      record._meta.zipFile = zipName;
    }

    const fname = `${ts}__${orderId || crypto.randomUUID()}.json`;
    const fpath = path.join(ORDER_DIR, fname);
    fs.writeFileSync(fpath, JSON.stringify(record, null, 2), "utf8");
    record._meta.file = fname;

    // E-mail (opcjonalnie)
    let emailInfo = { sent: false };
    try {
      const subject = `New order: ${orderId}`;
      const text = `Order received at ${record._meta.savedAt}\n\n${JSON.stringify(data, null, 2)}`;
      emailInfo = await maybeSendEmail({ subject, text });
    } catch (e) {
      emailInfo = { sent: false, reason: "email-error", error: String(e?.message || e) };
    }

    return {
      statusCode: 200,
      headers: buildCorsHeaders(allowOrigin),
      body: JSON.stringify({
        ok: true,
        saved: true,
        file: record._meta.file,
        zipFile: record._meta.zipFile,
        email: emailInfo,
      }),
    };
  } catch (e) {
    console.error("send-order error:", e);
    return {
      statusCode: 500,
      headers: buildCorsHeaders(allowOrigin),
      body: JSON.stringify({ ok: false, error: "server-error" }),
    };
  }
};
