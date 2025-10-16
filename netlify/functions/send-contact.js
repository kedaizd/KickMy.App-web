const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CONTACT_EMAIL_FROM = process.env.CONTACT_EMAIL_FROM || process.env.ORDER_EMAIL_FROM || '';
const CONTACT_EMAIL_TO = process.env.CONTACT_EMAIL_TO || 'kontofejsik@gmail.com';
const ALLOWED_DEV_ORIGIN = 'http://localhost:8888';

function parseAllowedOrigins() {
  const list = (process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return Array.from(new Set(list.map(stripSlash)));
}

function stripSlash(url) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

function originFromUrlLike(value) {
  try {
    return stripSlash(new URL(value).origin);
  } catch (_) {
    return '';
  }
}

function matchesAllowed(origin, allowed) {
  if (!origin) return false;
  if (allowed.includes(origin)) return true;
  for (const entry of allowed) {
    if (!entry.startsWith('*.')) continue;
    const suffix = entry.slice(1);
    try {
      if (new URL(origin).host.endsWith(suffix)) return true;
    } catch (_) {
      // ignore invalid origins
    }
  }
  return false;
}

function pickCorsOrigin(origin, refererOrigin, allowed, isDev) {
  if (isDev && (origin || refererOrigin)) {
    return origin || refererOrigin || ALLOWED_DEV_ORIGIN;
  }
  if (matchesAllowed(origin, allowed)) return origin;
  if (matchesAllowed(refererOrigin, allowed)) return refererOrigin;
  return '';
}

function buildCorsHeaders(origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
}

async function maybeSendEmail({ subject, text }) {
  if (!RESEND_API_KEY || !CONTACT_EMAIL_FROM || !CONTACT_EMAIL_TO) {
    return { sent: false, reason: 'email-not-configured' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: CONTACT_EMAIL_FROM,
      to: [CONTACT_EMAIL_TO],
      subject,
      text
    })
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    return { sent: false, status: response.status, body };
  }

  return { sent: true };
}

export const handler = async (event) => {
  const allowed = parseAllowedOrigins();
  const origin = stripSlash(event.headers?.origin || '');
  const refererOrigin = originFromUrlLike(event.headers?.referer || '');
  const isDev = process.env.NODE_ENV !== 'production';
  const allowOrigin = pickCorsOrigin(origin, refererOrigin, allowed, isDev);
  const corsHeaders = buildCorsHeaders(allowOrigin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (_) {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  const name = String(payload.name || '').trim();
  const email = String(payload.email || '').trim();
  const message = String(payload.message || '').trim();

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: 'missing-fields' })
    };
  }

  const subject = 'Nowa wiadomosc z konfiguratora KickMy.App';
  const text = `Nadawca: ${name}\nEmail: ${email}\n\nTresc:\n${message}`;

  const emailInfo = await maybeSendEmail({ subject, text });
  if (!emailInfo.sent) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: 'email-failed', details: emailInfo })
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ ok: true })
  };
};
