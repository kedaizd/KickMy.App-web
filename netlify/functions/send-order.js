// netlify/functions/send-order.js
import { Resend } from 'resend'
import { getStore as getBlobsStore } from '@netlify/blobs'
import fs from 'fs'
import path from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'
const TOKEN = process.env.ORDER_WEBHOOK_TOKEN

// === Blobs helper z fallbackiem na filesystem ===
function blobsAuth() {
  let siteID = process.env.NETLIFY_SITE_ID
  let token  = process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_AUTH_TOKEN
  // fallback: weź siteId z .netlify/state.json
  if (!siteID) {
    try {
      const p = path.join(process.cwd(), '.netlify', 'state.json')
      const j = JSON.parse(fs.readFileSync(p, 'utf8'))
      if (j?.siteId) siteID = j.siteId
    } catch { /* ignore */ }
  }
  return { siteID, token }
}

function getOrdersStore() {
  // Spróbuj prawdziwych Blobs
  try {
    const auth = blobsAuth()
    if (auth.siteID && auth.token) {
      return getBlobsStore('orders', auth)
    }
  } catch (_) { /* przejdź do fallbacku */ }

  // Fallback: lokalny filesystem, zgodny w API z tym czego używamy
  const baseDir = path.join(process.cwd(), '.local-blobs', 'orders')
  fs.mkdirSync(baseDir, { recursive: true })
  return {
    async set(key, value) {
      const file = path.join(baseDir, key)
      const buf = Buffer.isBuffer(value) ? value : Buffer.from(value)
      fs.writeFileSync(file, buf)
    },
    async setJSON(key, obj) {
      const file = path.join(baseDir, key)
      fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8')
    }
  }
}
// =================================================

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { ...cors(), 'content-type': 'application/json; charset=utf-8' }, body: '' }
  }
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' })

  const auth = event.headers.authorization || ''
  if (!auth.startsWith('Bearer ') || auth.slice(7) !== TOKEN) return json(401, { error: 'Unauthorized' })

  let payload
  try { payload = JSON.parse(event.body || '{}') } catch { return json(400, { error: 'Invalid JSON' }) }

  const { orderId, contact = {}, invoice = {}, config, zipBase64 } = payload
  if (!orderId || !config || !zipBase64) return json(400, { error: 'Missing orderId/config/zipBase64' })

  // 1) zapis plików (Blobs lub lokalnie)
  const store = getOrdersStore()
  const zipKey  = `site-${orderId}.zip`
  const jsonKey = `order-${orderId}.json`

  const zipBuf = Buffer.from(zipBase64, 'base64')
  await store.set(zipKey, zipBuf)
  await store.setJSON(jsonKey, { orderId, config })

  // 2) linki do pobrania
  const base   = process.env.PUBLIC_BASE_URL || 'http://localhost:8888'
  const tokenQ = `token=${encodeURIComponent(TOKEN)}`
  const zipUrl  = `${base}/.netlify/functions/download?key=${encodeURIComponent(zipKey)}&${tokenQ}`
  const jsonUrl = `${base}/.netlify/functions/download?key=${encodeURIComponent(jsonKey)}&${tokenQ}`

  // 3) e-mail (bez załączników)
  const toList = parseRecipients(process.env.ORDER_EMAIL_TO)
  if (!toList.length) return json(400, { error: 'ORDER_EMAIL_TO is empty or invalid' })
  const to   = toList.length === 1 ? toList[0] : toList
  const from = process.env.ORDER_EMAIL_FROM || 'onboarding@resend.dev'
  const html = renderHtml(orderId, contact, invoice, zipUrl, jsonUrl)

  try {
    const result = await resend.emails.send({ from, to, subject: `Nowe zamówienie #${orderId}`, html })
    if (result?.error) {
      const status = Number(result.error.statusCode) || 502
      return json(status, { error: `Resend: ${result.error.name} – ${result.error.message}` })
    }
    return json(200, { ok: true, id: result?.data?.id || null, zipUrl, jsonUrl })
  } catch (err) {
    const msg = err?.response?.data || err?.message || String(err)
    console.error('MAIL ERROR', msg)
    return json(500, { error: 'Email send failed' })
  }
}

function parseRecipients(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value).split(/[,;]+/).map(s => s.trim()).filter(Boolean)
}
function cors() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'authorization,content-type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS'
  }
}
function json(status, body) {
  return {
    statusCode: status,
    headers: { ...cors(), 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body)
  }
}
function renderHtml(orderId, contact, invoice, zipUrl, jsonUrl) {
  const row = (o) =>
    Object.entries(o || {})
      .map(([k, v]) => `<tr><td style="padding:2px 8px">${escapeHtml(k)}</td><td style="padding:2px 8px"><b>${escapeHtml(v)}</b></td></tr>`)
      .join('')
  return `
  <div style="font-family:system-ui,Segoe UI,Arial">
    <h2>Nowe zamówienie #${escapeHtml(orderId)}</h2>
    <h3>Dane kontaktowe</h3>
    <table>${row(contact)}</table>
    <h3>Dane do faktury</h3>
    <table>${row(invoice)}</table>
    <p><b>Pobierz pliki:</b></p>
    <ul>
      <li><a href="${zipUrl}" target="_blank" rel="noopener">site-${escapeHtml(orderId)}.zip</a></li>
      <li><a href="${jsonUrl}" target="_blank" rel="noopener">order-${escapeHtml(orderId)}.json</a></li>
    </ul>
    <p style="color:#64748b;font-size:13px">Linki są zabezpieczone tokenem i wygodne do pobrania.</p>
  </div>`
}
function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}
