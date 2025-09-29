// netlify/functions/download.js
import { getStore as getBlobsStore } from '@netlify/blobs'
import fs from 'fs'
import path from 'path'

const TOKEN = process.env.ORDER_WEBHOOK_TOKEN
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*'

function blobsAuth() {
  let siteID = process.env.NETLIFY_SITE_ID
  let token  = process.env.NETLIFY_API_TOKEN || process.env.NETLIFY_AUTH_TOKEN
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
  try {
    const auth = blobsAuth()
    if (auth.siteID && auth.token) {
      return getBlobsStore('orders', auth)
    }
  } catch (_) { /* fallback */ }
  const baseDir = path.join(process.cwd(), '.local-blobs', 'orders')
  fs.mkdirSync(baseDir, { recursive: true })
  return {
    async get(key, { type } = {}) {
      const file = path.join(baseDir, key)
      if (!fs.existsSync(file)) return null
      if (type === 'arrayBuffer') return fs.readFileSync(file)
      return fs.readFileSync(file, 'utf8')
    }
  }
}

export async function handler(event) {
  try {
    const qs = event.queryStringParameters || {}
    const { key, token } = qs
    if (!key) return plain(400, 'Missing "key"')
    if (token !== TOKEN) return plain(403, 'Forbidden')
    if (!/^((site|order)-[A-Za-z0-9_-]+)\.(zip|json)$/.test(key)) return plain(400, 'Invalid key format')

    const store = getOrdersStore()
    const isZip = key.endsWith('.zip')
    const entry = await store.get(key, { type: isZip ? 'arrayBuffer' : 'text' })
    if (entry === null) return plain(404, 'Not found')

    const headers = {
      'content-type': isZip ? 'application/zip' : 'application/json; charset=utf-8',
      'content-disposition': `attachment; filename="${key}"`,
      'cache-control': 'private, max-age=300',
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN
    }

    if (isZip) {
      const buf = Buffer.isBuffer(entry) ? entry : Buffer.from(entry)
      return { statusCode: 200, headers, body: buf.toString('base64'), isBase64Encoded: true }
    }
    return { statusCode: 200, headers, body: entry }
  } catch (e) {
    console.error('DOWNLOAD ERROR', e)
    return plain(500, 'Server error')
  }
}

function plain(status, body) {
  return { statusCode: status, headers: { 'content-type': 'text/plain' }, body }
}
