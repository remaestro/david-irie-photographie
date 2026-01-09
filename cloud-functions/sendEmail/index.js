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
      subject: `✨ Nouveau message de ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Georgia', serif; background-color: #fafafa; padding: 0; margin: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e0e0e0; }
            .header { background: #1a1a1a; color: #ffffff; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: 0.15em; text-transform: uppercase; }
            .content { padding: 40px 30px; }
            .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #8a8a8a; margin: 20px 0 8px 0; font-weight: 400; }
            .value { font-size: 16px; color: #1a1a1a; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 1px solid #f0f0f0; }
            .message-box { background: #fafafa; padding: 25px; margin: 20px 0; border-left: 3px solid #1a1a1a; }
            .footer { background: #fafafa; padding: 30px; text-align: center; font-size: 12px; color: #8a8a8a; border-top: 1px solid #e0e0e0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DAVID IRIE</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; letter-spacing: 0.1em; font-weight: 300;">PHOTOGRAPHIE</p>
            </div>
            <div class="content">
              <p style="font-size: 18px; color: #1a1a1a; margin-bottom: 30px;">Nouveau message depuis votre site web</p>
              
              <div class="label">Nom complet</div>
              <div class="value">${name}</div>
              
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${email}" style="color: #1a1a1a; text-decoration: none;">${email}</a></div>
              
              ${phone ? `
                <div class="label">Téléphone</div>
                <div class="value"><a href="tel:${phone}" style="color: #1a1a1a; text-decoration: none;">${phone}</a></div>
              ` : ''}
              
              ${service ? `
                <div class="label">Service demandé</div>
                <div class="value">${service}</div>
              ` : ''}
              
              ${budget ? `
                <div class="label">Budget estimé</div>
                <div class="value">${budget}</div>
              ` : ''}
              
              <div class="label">Message</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="footer">
              <p style="margin: 0;">© ${new Date().getFullYear()} David Irie Photographie</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Auto-reply to client
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: '✨ Merci pour votre message - David Irie Photographie',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Georgia', serif; background-color: #fafafa; padding: 0; margin: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); }
            .header { background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%); color: #ffffff; padding: 50px 30px; text-align: center; }
            .header h1 { margin: 0 0 15px 0; font-size: 32px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; }
            .header p { margin: 0; font-size: 14px; letter-spacing: 0.15em; font-weight: 300; opacity: 0.9; }
            .hero-image { width: 100%; height: 350px; overflow: hidden; }
            .hero-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
            .content { padding: 50px 40px; line-height: 1.8; }
            .greeting { font-size: 24px; color: #1a1a1a; margin: 0 0 25px 0; font-weight: 300; letter-spacing: 0.05em; }
            .text { font-size: 16px; color: #4a4a4a; margin: 20px 0; line-height: 1.9; }
            .highlight { background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%); padding: 30px; margin: 30px 0; border-left: 4px solid #1a1a1a; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03); }
            .highlight p { margin: 0; font-size: 15px; color: #2a2a2a; line-height: 1.8; }
            .signature { margin: 40px 0 0 0; }
            .signature-name { font-size: 18px; color: #1a1a1a; margin: 0; font-weight: 400; letter-spacing: 0.08em; }
            .signature-title { font-size: 13px; color: #8a8a8a; margin: 8px 0 0 0; letter-spacing: 0.12em; text-transform: uppercase; }
            .divider { height: 1px; background: linear-gradient(to right, transparent, #e0e0e0, transparent); margin: 35px 0; }
            .your-message { background: #f8f8f8; padding: 25px; margin: 30px 0 0 0; border-radius: 4px; border: 1px solid #efefef; }
            .your-message-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #8a8a8a; margin: 0 0 15px 0; }
            .your-message-content { font-size: 14px; color: #6a6a6a; line-height: 1.7; margin: 0; }
            .footer { background: #fafafa; padding: 35px 30px; text-align: center; border-top: 1px solid #e0e0e0; }
            .footer-text { font-size: 12px; color: #8a8a8a; margin: 0 0 15px 0; line-height: 1.6; }
            .social-links { margin: 20px 0 0 0; }
            .social-links a { display: inline-block; margin: 0 10px; color: #4a4a4a; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; transition: color 0.3s; }
            .quote { font-size: 18px; font-style: italic; color: #2a2a2a; text-align: center; padding: 30px; margin: 30px 0; background: #fafafa; border-top: 1px solid #e8e8e8; border-bottom: 1px solid #e8e8e8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DAVID IRIE</h1>
              <p>PHOTOGRAPHIE D'EXCEPTION</p>
            </div>
            
            <div class="hero-image">
              <img src="https://david-irie-photographie-208603494308.europe-west1.run.app/images/bouquet-roses-1.jpg" alt="David Irie Photographie" />
            </div>
            
            <div class="content">
              <p class="greeting">Bonjour ${name},</p>
              
              <p class="text">
                Je vous remercie sincèrement de m'avoir contacté et de la confiance que vous me témoignez pour votre projet photographique.
              </p>
              
              <div class="highlight">
                <p>✨ <strong>Votre message a bien été reçu</strong> et je m'engage à vous répondre dans les plus brefs délais, généralement sous 24 heures.</p>
              </div>
              
              <p class="text">
                Chaque projet est unique et mérite une attention particulière. Je prendrai le temps d'étudier votre demande avec soin afin de vous proposer une prestation sur-mesure qui correspondra parfaitement à vos attentes.
              </p>
              
              <div class="quote">
                "La photographie est l'art de capturer l'émotion et de créer des souvenirs intemporels."
              </div>
              
              <p class="text">
                En attendant notre échange, n'hésitez pas à découvrir mes dernières réalisations sur mon site ou mes réseaux sociaux.
              </p>
              
              <div class="divider"></div>
              
              <div class="signature">
                <p class="signature-name">David Irie</p>
                <p class="signature-title">Photographe Professionnel</p>
              </div>
              
              <div class="your-message">
                <p class="your-message-title">Récapitulatif de votre message</p>
                <p class="your-message-content">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p class="footer-text">
                © ${new Date().getFullYear()} David Irie Photographie<br>
                Paris & Île-de-France
              </p>
              <div class="social-links">
                <a href="https://instagram.com">Instagram</a> • 
                <a href="https://facebook.com">Facebook</a> • 
                <a href="https://pinterest.com">Pinterest</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
