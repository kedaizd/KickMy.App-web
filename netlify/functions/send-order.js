import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const STORAGE_DIR = process.env.ORDER_STORAGE_PATH || path.join(process.env.TEMP || '/tmp', 'kickmy-orders');

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Empty request body' }) };
    }

    const data = JSON.parse(event.body);
    const { cfg, zip, invoice, notes } = data;

    if (!cfg || !zip) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing configuration or archive data' }) };
    }

    const zipBuffer = Buffer.from(zip, 'base64');

    const orderId = invoice?.number ? String(invoice.number) : crypto.randomUUID();
    const sanitizedOrderId = orderId.replace(/[^\w-]+/g, '_') || crypto.randomUUID();
    const filePath = path.join(STORAGE_DIR, `${Date.now()}-${sanitizedOrderId}.json`);
    const storedPayload = {
      receivedAt: new Date().toISOString(),
      cfg,
      invoice,
      notes,
      zip
    };

    await fs.mkdir(STORAGE_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(storedPayload));

    console.log('Received order:', {
      brand: cfg?.brand?.title,
      sections: Array.isArray(cfg?.sections) ? cfg.sections.length : 0,
      invoice,
      notes,
      zipSize: zipBuffer.length,
      storedAt: filePath
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Order accepted' })
    };
  } catch (error) {
    console.error('send-order failure', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal error', details: error.message })
    };
  }
};
