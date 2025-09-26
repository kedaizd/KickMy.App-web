const nodemailer = require('nodemailer');
const { get } = require('lodash'); // Może być potrzebne do parsowania multipart/form-data

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Dane wrażliwe, jak hasło, trzymaj w zmiennych środowiskowych Netlify!
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Przykład, możesz użyć innej usługi
    auth: {
      user: 'kontofejsik@gmail.com',
      pass: process.env.EMAIL_PASSWORD, // Hasło z zmiennej środowiskowej
    },
  });

  try {
    // Logika parsowania danych z FormData (bardziej zaawansowana)
    const parsedBody = JSON.parse(event.body);
    const { cfg, zip, invoiceName, invoiceNip, invoiceAddress, deliveryEmail } = parsedBody;

    // Utworzenie treści e-maila
    const mailOptions = {
      from: 'kontofejsik@gmail.com',
      to: 'kontofejsik@gmail.com', // Lub na adres klienta (deliveryEmail)
      subject: `Nowe zamówienie od ${invoiceName}`,
      html: `
        <h1>Nowe Zamówienie</h1>
        <p><strong>Nazwa klienta:</strong> ${invoiceName}</p>
        <p><strong>NIP:</strong> ${invoiceNip}</p>
        <p><strong>Adres:</strong> ${invoiceAddress}</p>
        <p><strong>Email do dostarczenia faktury:</strong> ${deliveryEmail}</p>
        <p>Plik JSON z konfiguracją: ${JSON.stringify(cfg, null, 2)}</p>
      `,
      attachments: [
        {
          filename: 'zamowienie.zip',
          content: Buffer.from(zip.data), // Ważne: dane zip muszą być w buforze
          contentType: 'application/zip',
        },
      ],
    };

    // Wysłanie e-maila
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Zamówienie wysłane pomyślnie!' }),
    };
  } catch (error) {
    console.error('Błąd wysyłania maila:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Błąd serwera' }),
    };
  }
};