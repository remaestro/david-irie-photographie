const nodemailer = require('nodemailer');

exports.sendEmail = async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, service, budget } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    // Email to site owner
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `Nouveau message de ${name} - David Irie Photographie`,
      html: `
        <h2>Nouveau message depuis le site web</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Téléphone:</strong> ${phone}</p>` : ''}
        ${service ? `<p><strong>Service:</strong> ${service}</p>` : ''}
        ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Auto-reply to client
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Merci pour votre message - David Irie Photographie',
      html: `
        <h2>Bonjour ${name},</h2>
        <p>Merci de m'avoir contacté. J'ai bien reçu votre message et je vous répondrai dans les plus brefs délais.</p>
        <p>À très bientôt,</p>
        <p><strong>David Irie</strong><br>
        Photographe Professionnel</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Votre message:</p>
        <p style="color: #666; font-size: 12px;">${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
