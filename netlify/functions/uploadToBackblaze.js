// Netlify Function - Upload vers Backblaze B2
// Usage: Galeries privées - Photos/Vidéos finales pour clients

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' })
    }
  }

  try {
    // Configure S3 client for Backblaze B2
    const s3Client = new S3Client({
      endpoint: `https://${process.env.B2_ENDPOINT}`,
      region: process.env.B2_REGION,
      credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_APPLICATION_KEY
      }
    })

    const { file, fileName, galleryId, fileType } = JSON.parse(event.body)

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(file.split(',')[1], 'base64')

    // Upload to B2
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.B2_BUCKET_NAME,
        Key: `galeries/${galleryId}/${fileName}`,
        Body: fileBuffer,
        ContentType: fileType,
        // Make file accessible via URL
        ACL: 'public-read'
      }
    })

    await upload.done()

    // Construct public URL
    const publicUrl = `https://f004.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/galeries/${galleryId}/${fileName}`

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        url: publicUrl,
        fileName: fileName,
        galleryId: galleryId
      })
    }
  } catch (error) {
    console.error('Backblaze B2 upload error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'Erreur lors de l\'upload vers Backblaze',
        error: error.message
      })
    }
  }
}
