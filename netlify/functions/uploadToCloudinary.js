// Netlify Function - Upload vers Cloudinary
// Usage: Formulaire de contact - Photos d'inspiration clients

const cloudinary = require('cloudinary').v2

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    }
  }

  try {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })

    const { file, fileName } = JSON.parse(event.body)

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file, {
      folder: 'contact-inspirations',
      public_id: fileName,
      resource_type: 'auto',
      // Auto-delete after 30 days
      invalidate: true
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        url: result.secure_url,
        publicId: result.public_id
      })
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Erreur lors de l\'upload de la photo',
        error: error.message
      })
    }
  }
}
