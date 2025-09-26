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

    // TODO: send the payload to your CRM, email service, or persistent storage.
    console.log('Received order:', {
      brand: cfg?.brand?.title,
      sections: Array.isArray(cfg?.sections) ? cfg.sections.length : 0,
      invoice,
      notes,
      zipSize: zipBuffer.length
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
