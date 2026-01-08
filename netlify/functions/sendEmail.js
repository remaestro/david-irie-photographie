const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    };
  }

  // Parse request body
  const data = JSON.parse(event.body);
  const { name, email, phone, subject, date, message } = data;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields' })
    };
  }

  // Create transporter with Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  // Email to David (site owner)
  const mailToOwner = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `Nouveau contact: ${subject}`,
    html: `
      <h2>Nouveau message depuis davidiriephotographie.com</h2>
      <p><strong>Nom:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Téléphone:</strong> ${phone || 'Non fourni'}</p>
      <p><strong>Type de prestation:</strong> ${subject}</p>
      <p><strong>Date souhaitée:</strong> ${date || 'Non spécifiée'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">
        Reçu le ${new Date().toLocaleString('fr-FR')}
      </p>
    `
  };

  // Auto-reply to client
  const mailToClient = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Merci pour votre message - David Irie Photographie',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a1a;">Bonjour ${name},</h2>
        <p>Merci de m'avoir contacté !</p>
        <p>J'ai bien reçu votre message concernant <strong>${subject}</strong> et je reviendrai vers vous dans les plus brefs délais.</p>
        <p>À très bientôt,</p>
        <p style="margin-top: 30px;">
          <strong>David Irie</strong><br>
          Photographe Professionnel<br>
          <a href="mailto:${process.env.GMAIL_USER}">${process.env.GMAIL_USER}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Votre message:<br>
          "${message}"
        </p>
      </div>
    `
  };

  try {
    // Send both emails
    await transporter.sendMail(mailToOwner);
    await transporter.sendMail(mailToClient);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email envoyé avec succès!',
        success: true
      })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error.message 
      })
    };
  }
};
