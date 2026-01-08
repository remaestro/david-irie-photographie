// Netlify Function - Nettoyage automatique des galeries de plus d'1 an
// À exécuter manuellement ou via Netlify Scheduled Functions

const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3')

exports.handler = async (event) => {
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

    // Liste tous les fichiers dans le bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.B2_BUCKET_NAME,
      Prefix: 'galeries/'
    })

    const listResponse = await s3Client.send(listCommand)
    
    if (!listResponse.Contents) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Aucun fichier à nettoyer',
          deleted: 0
        })
      }
    }

    // Filtrer les fichiers de plus d'1 an
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const filesToDelete = listResponse.Contents.filter(file => {
      return file.LastModified < oneYearAgo
    })

    if (filesToDelete.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Aucun fichier de plus d\'1 an trouvé',
          deleted: 0
        })
      }
    }

    // Supprimer les fichiers
    const deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Delete: {
        Objects: filesToDelete.map(file => ({ Key: file.Key }))
      }
    })

    const deleteResponse = await s3Client.send(deleteCommand)

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${filesToDelete.length} fichiers supprimés avec succès`,
        deleted: filesToDelete.length,
        files: deleteResponse.Deleted.map(f => f.Key)
      })
    }
  } catch (error) {
    console.error('Cleanup error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erreur lors du nettoyage',
        error: error.message
      })
    }
  }
}
