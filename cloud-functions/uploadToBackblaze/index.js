const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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

exports.uploadToBackblaze = async (req, res) => {
  // Configure CORS headers for all responses - Allow specific origins
  const allowedOrigins = [
    'https://david-irie-photographie-208603494308.europe-west1.run.app',
    'http://localhost:5173',
    'http://localhost:4173'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.set('Access-Control-Allow-Origin', origin || '*');
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
    const { file, fileName, galleryId, contentType } = req.body;

    if (!file || !fileName || !galleryId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Decode base64 file
    const buffer = Buffer.from(file.split(',')[1], 'base64');

    const key = `galeries/${galleryId}/${Date.now()}-${fileName}`;

    console.log('📤 Upload attempt:', {
      bucket: process.env.B2_BUCKET_NAME,
      key: key,
      endpoint: process.env.B2_ENDPOINT,
      cleanEndpoint: cleanEndpoint,
      fileSize: buffer.length,
      contentType: contentType || 'application/octet-stream'
    });

    const command = new PutObjectCommand({
      Bucket: process.env.B2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
    });

    await s3Client.send(command);

    // Construct public URL - Remove https:// from endpoint if present
    const endpoint = process.env.B2_ENDPOINT.replace('https://', '');
    const publicUrl = `https://${process.env.B2_BUCKET_NAME}.${endpoint}/${key}`;

    console.log('✅ Upload successful! Public URL:', publicUrl);

    res.status(200).json({ url: publicUrl });
  } catch (error) {
    console.error('❌ B2 upload error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode
    });
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
};
