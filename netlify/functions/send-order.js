// netlify/functions/send-order.js

import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * ──────────────────────────────────────────────────────────────────────────────
 * Konfiguracja
 * ──────────────────────────────────────────────────────────────────────────────
 * ENV (ustaw w Netlify → Site settings → Build & deploy → Environment):
 * - ALLOWED_ORIGIN         np. https://twojadomena.pl  (dla dev: http://localhost:8888)
 * - ORDER_STORAGE_PATH     np. data/orders            (opcjonalne; wzgl. do katalogu funkcji)
 * - RESEND_API_KEY         klucz do Resend (opcjonalne wysyłanie e-maila)
 * - ORDER_EMAIL_FROM       np. orders@twojadomena.pl  (opcjonalne)
 * - ORDER_EMAIL_TO         np. biuro@twojadomena.pl   (opcjonalne)
 *
 * Uwaga: ŻADNYCH sekretów w VITE_*! Frontend nie przesyła tokenów.
 */

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const ORDER_STORAGE_PATH = process.env.ORDER_STORAGE_PATH || "data/orders";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const ORDER_EMAIL_FROM = process.env.ORDER_EMAIL_FROM || "";
const ORDER_EMAIL_TO = process.env.ORDER_EMAIL_TO || "";

/**
 * Prosty rate-limit w pamięci procesu: max 20 żądań / IP / minutę.
 * W Netlify Functions instancje mogą się przegrupowywać, więc to jest best-effort.
 */
const RATE = {
  windowMs: 60 * 1000,
  max: 20,
};
global.__rl = global.__rl || new Map();

function hit(ip) {
  const now = Date.now();
  const arr = (global.__rl.get(ip) || []).filter((t) => now - t < RATE.windowMs);
  arr.push(now);
  global.__rl.set(ip, arr);
  return arr.length <= RATE.max;
}

function buildCorsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeId(id) {
  if (typeof id !== "string" || !id.trim()) {
    return crypto.randomUUID();
  }
  // Wytnij niebezpieczne znaki z ID do nazwy pliku
  return id.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}-${pad(d.getUTCMinutes())}-${pad(d.getUTCSeconds())}Z`;
}

/**
 * Opcjonalny e-mail przez Resend
 */
async function maybeSendEmail({ subject, text, html }) {
  if (!RESEND_API_KEY || !ORDER_EMAIL_FROM || !ORDER_EMAIL_TO) return { sent: false, reason: "email-not-configured" };

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

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/**
 * Handler
 */
export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: buildCorsHeaders(ALLOWED_ORIGIN),
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Origin/Referer gate
  const origin = event.headers.origin || "";
  const referer = event.headers.referer || "";
  const sameOrigin =
    (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) ||
    (ALLOWED_ORIGIN && referer && referer.startsWith(ALLOWED_ORIGIN));

  if (!sameOrigin) {
    return { statusCode: 403, body: "Forbidden: bad origin" };
  }

  // Rate limit
  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    "unknown";

  if (!hit(ip)) {
    return { statusCode: 429, headers: buildCorsHeaders(ALLOWED_ORIGIN), body: "Too Many Requests" };
  }

  // Parse JSON payload
  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers: buildCorsHeaders(ALLOWED_ORIGIN), body: "Invalid JSON" };
  }

  // Oczekiwane pola (dowolne – nie walidujemy twardo, ale możesz dodać Zod/Yup)
  const orderId = safeId(data.orderId || data.invoiceNumber || "");
  const ts = nowStamp();

  // Zapis do pliku: meta + oryginalny payload (+ opcjonalnie ZIP base64)
  try {
    // Katalog docelowy: względny do katalogu funkcji
    const baseDir = path.resolve(process.cwd(), ORDER_STORAGE_PATH);
    ensureDirSync(baseDir);

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

    // Jeśli klient przesłał ZIP jako base64 w polu data.zipBase64
    if (data.zipBase64) {
      const zipBuf = Buffer.from(data.zipBase64, "base64");
      const zipName = `${ts}__${orderId}__bundle.zip`;
      const zipPath = path.join(baseDir, zipName);
      fs.writeFileSync(zipPath, zipBuf);
      record._meta.zipFile = zipName;
    }

    // JSON z pełnym rekordem
    const fname = `${ts}__${orderId || crypto.randomUUID()}.json`;
    const fpath = path.join(baseDir, fname);
    fs.writeFileSync(fpath, JSON.stringify(record, null, 2), "utf8");
    record._meta.file = fname;

    // Opcjonalny e-mail
    let emailInfo = { sent: false };
    try {
      const subject = `New order: ${orderId}`;
      const text = `Order received at ${record._meta.savedAt}\n\n${JSON.stringify(data, null, 2)}`;
      emailInfo = await maybeSendEmail({ subject, text });
    } catch (e) {
      // nie blokuj odpowiedzi jeśli e-mail padnie
      emailInfo = { sent: false, reason: "email-error", error: String(e?.message || e) };
    }

    return {
      statusCode: 200,
      headers: buildCorsHeaders(ALLOWED_ORIGIN),
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
      headers: buildCorsHeaders(ALLOWED_ORIGIN),
      body: JSON.stringify({ ok: false, error: "server-error" }),
    };
  }
};
