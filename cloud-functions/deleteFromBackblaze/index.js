const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Remove https:// from endpoint if present - S3Client adds it automatically
const cleanEndpoint = process.env.B2_ENDPOINT.replace('https://', '').replace('http://', '');

const s3Client = new S3Client({
  endpoint: `https://${cleanEndpoint}`,
  region: process.env.B2_REGION || 'us-west-004',
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

exports.deleteFromBackblaze = async (req, res) => {
  // Configure CORS headers for all responses
  const allowedOrigins = [
    'https://david-irie-photographie-208603494308.europe-west1.run.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.set('Access-Control-Max-Age', '3600');
  res.set('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ error: 'Missing fileUrl' });
    }

    // Extraire le nom du fichier de l'URL
    // Format possible 1: https://bucket-name.s3.us-west-004.backblazeb2.com/galeries/XXX/filename.jpg
    // Format possible 2: https://s3.us-west-004.backblazeb2.com/bucket-name/galeries/XXX/filename.jpg
    const url = new URL(fileUrl);
    let key;
    
    // Si le bucket est dans le hostname (bucket-name.s3.endpoint.com)
    if (url.hostname.startsWith(process.env.B2_BUCKET_NAME)) {
      key = url.pathname.substring(1); // Remove leading /
    } else {
      // Si le bucket est dans le path (/bucket-name/galeries/...)
      const pathParts = url.pathname.substring(1).split('/');
      if (pathParts[0] === process.env.B2_BUCKET_NAME) {
        key = pathParts.slice(1).join('/'); // Remove bucket name from path
      } else {
        key = url.pathname.substring(1); // Fallback
      }
    }
    
    console.log('🗑️ Deleting file from Backblaze B2:');
    console.log('  - URL:', fileUrl);
    console.log('  - Bucket:', process.env.B2_BUCKET_NAME);
    console.log('  - Key:', key);

    const command = new DeleteObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    console.log('✅ File deleted successfully from B2:', key);
    
    return res.status(200).json({ 
      success: true, 
      message: 'File deleted successfully',
      key 
    });

  } catch (error) {
    console.error('❌ Error deleting file from Backblaze:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode
    });
    return res.status(500).json({ 
      error: 'Failed to delete file',
      details: error.message,
      code: error.code
    });
  }
};
