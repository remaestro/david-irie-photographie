import React, { useState } from 'react';
import { getPhotoUrl } from '../config/backblaze';
import '../App.css';

/**
 * Test page for Backblaze B2 integration
 * Displays the test photo uploaded to Backblaze B2
 */
function B2Test() {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Test photo URL
  const testPhotoUrl = getPhotoUrl('test.jpg');
  
  // Example photos with different folders
  const examplePhotos = [
    {
      id: 1,
      title: 'Test Photo',
      url: testPhotoUrl,
      folder: 'root'
    },
    ...uploadedPhotos
  ];

  /**
   * Handle file upload to Backblaze B2
   */
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    setUploading(true);
    setUploadStatus(`⏳ Upload de ${files.length} photo(s) en cours...`);

    try {
      const uploadPromises = files.map(async (file) => {
        // Convert file to base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Call Cloud Function to upload to B2
        const response = await fetch('https://europe-west1-david-irie-photographie-208603494308.cloudfunctions.net/uploadToBackblaze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: base64,
            fileName: file.name,
            galleryId: 'test-uploads',
            contentType: file.type,
          }),
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        return {
          id: Date.now() + Math.random(),
          title: file.name,
          url: data.url,
          folder: 'test-uploads',
          isLocal: false
        };
      });

      const newPhotos = await Promise.all(uploadPromises);
      setUploadedPhotos(prev => [...prev, ...newPhotos]);
      setUploadStatus(`✅ ${files.length} photo(s) uploadée(s) avec succès vers Backblaze B2!`);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(`❌ Erreur lors de l'upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="b2-test-page">
      <div className="container">
        <header className="test-header">
          <h1>🧪 Backblaze B2 Test</h1>
          <p className="subtitle">Testing photo storage integration</p>
        </header>

        <section className="test-info">
          <div className="info-box">
            <h2>📦 Bucket Information</h2>
            <ul>
              <li><strong>Bucket:</strong> david-irie-photo</li>
              <li><strong>Region:</strong> us-east-005</li>
              <li><strong>Base URL:</strong> https://f005.backblazeb2.com/file/david-irie-photo/</li>
            </ul>
          </div>

          <div className="info-box">
            <h2>✅ Status</h2>
            <p className="status-success">
              Backblaze B2 is configured and ready!
            </p>
          </div>
        </section>

        <section className="upload-section">
          <div className="upload-box">
            <h2>📤 Upload Photos vers Backblaze B2</h2>
            <p>Sélectionnez des photos à uploader directement vers Backblaze B2</p>
            
            <div className="upload-controls">
              <label htmlFor="photo-upload" className="upload-button">
                {uploading ? '⏳ Chargement...' : '📸 Choisir des photos'}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
              
              <a 
                href="https://secure.backblaze.com/b2_buckets.htm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="backblaze-link"
              >
                🔗 Ouvrir Backblaze Dashboard
              </a>
            </div>

            {uploadStatus && (
              <div className={`upload-status ${uploadStatus.includes('✅') ? 'success' : 'info'}`}>
                {uploadStatus}
              </div>
            )}
          </div>
        </section>

        <section className="test-photos">
          <h2>📸 Test Photos</h2>
          <div className="photo-grid">
            {examplePhotos.map(photo => (
              <div key={photo.id} className="photo-card">
                <div className="photo-wrapper">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    onLoad={() => console.log(`✅ Photo loaded: ${photo.title}`)}
                    onError={() => console.error(`❌ Failed to load: ${photo.title}`)}
                  />
                </div>
                <div className="photo-info">
                  <h3>{photo.title}</h3>
                  <p className="folder-tag">
                    {photo.folder}
                  </p>
                  <details>
                    <summary>Show URL</summary>
                    <code className="photo-url">{photo.url}</code>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="usage-guide">
          <h2>💡 How to Add More Photos</h2>
          <ol>
            <li>
              <strong>Upload to Backblaze:</strong>
              <br />
              Go to <a href="https://secure.backblaze.com/b2_buckets.htm" target="_blank" rel="noopener noreferrer">
                Backblaze Dashboard
              </a> and upload photos to the <code>david-irie-photo</code> bucket
            </li>
            <li>
              <strong>Organize in folders (recommended):</strong>
              <br />
              Create folders like <code>portfolio/</code>, <code>gallery/</code>, <code>portraits/</code>
            </li>
            <li>
              <strong>Use in code:</strong>
              <pre>{`import { getPhotoUrl } from '@/config/backblaze';

// Photo at root
const url = getPhotoUrl('photo.jpg');

// Photo in folder
const url = getPhotoUrl('photo.jpg', 'portfolio');`}</pre>
            </li>
          </ol>
        </section>

        <section className="next-steps">
          <h2>🚀 Next Steps</h2>
          <div className="steps-grid">
            <div className="step-card">
              <h3>1️⃣ Upload Portfolio Photos</h3>
              <p>Upload your photography portfolio to Backblaze B2</p>
            </div>
            <div className="step-card">
              <h3>2️⃣ Configure Supabase</h3>
              <p>Set up database to manage photo metadata dynamically</p>
            </div>
            <div className="step-card">
              <h3>3️⃣ Setup Cloudflare CDN</h3>
              <p>Enable unlimited free bandwidth with Cloudflare CDN</p>
            </div>
            <div className="step-card">
              <h3>4️⃣ Create Gallery Component</h3>
              <p>Build a beautiful photo gallery for the main site</p>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        .b2-test-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .test-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .test-header h1 {
          font-size: 3rem;
          margin: 0;
          color: #333;
        }

        .subtitle {
          color: #666;
          font-size: 1.2rem;
          margin-top: 0.5rem;
        }

        .test-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .info-box {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }

        .info-box h2 {
          margin-top: 0;
          color: #333;
          font-size: 1.3rem;
        }

        .info-box ul {
          list-style: none;
          padding: 0;
        }

        .info-box li {
          padding: 0.5rem 0;
          color: #555;
        }

        .status-success {
          background: #d4edda;
          color: #155724;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #c3e6cb;
          font-weight: 500;
        }

        .test-photos {
          margin: 3rem 0;
        }

        .test-photos h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }

        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .photo-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .photo-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .photo-wrapper {
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .photo-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-info {
          padding: 1.5rem;
        }

        .photo-info h3 {
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .folder-tag {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }

        details {
          margin-top: 1rem;
        }

        summary {
          cursor: pointer;
          color: #667eea;
          font-weight: 500;
          user-select: none;
        }

        summary:hover {
          color: #764ba2;
        }

        .photo-url {
          display: block;
          background: #f8f9fa;
          padding: 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          word-break: break-all;
          margin-top: 0.5rem;
          color: #555;
        }

        .usage-guide {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          margin: 3rem 0;
        }

        .usage-guide h2 {
          color: #333;
          margin-top: 0;
        }

        .usage-guide ol {
          line-height: 1.8;
        }

        .usage-guide li {
          margin: 1.5rem 0;
          color: #555;
        }

        .usage-guide pre {
          background: #282c34;
          color: #abb2bf;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin-top: 0.5rem;
        }

        .usage-guide code {
          background: #e9ecef;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          color: #e83e8c;
          font-size: 0.9em;
        }

        .usage-guide pre code {
          background: transparent;
          padding: 0;
          color: #abb2bf;
        }

        .usage-guide a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }

        .usage-guide a:hover {
          text-decoration: underline;
        }

        .next-steps {
          margin-top: 3rem;
        }

        .next-steps h2 {
          color: #333;
          margin-bottom: 1.5rem;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .step-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          transition: transform 0.3s;
        }

        .step-card:hover {
          transform: scale(1.05);
        }

        .step-card h3 {
          margin-top: 0;
          font-size: 1.2rem;
        }

        .step-card p {
          margin-bottom: 0;
          opacity: 0.9;
        }

        .upload-section {
          margin: 3rem 0;
        }

        .upload-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }

        .upload-box h2 {
          margin-top: 0;
          color: white;
        }

        .upload-box p {
          opacity: 0.9;
          margin-bottom: 1.5rem;
        }

        .upload-controls {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .upload-button {
          background: white;
          color: #667eea;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: inline-block;
        }

        .upload-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .upload-button:active {
          transform: translateY(0);
        }

        .backblaze-link {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 1rem 2rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
          display: inline-block;
        }

        .backblaze-link:hover {
          background: rgba(255,255,255,0.3);
        }

        .upload-status {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 8px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
        }

        .upload-status.success {
          background: rgba(76, 175, 80, 0.3);
        }

        .upload-status.info {
          background: rgba(255, 193, 7, 0.3);
        }

        .local-note {
          font-size: 0.85rem;
          color: #ff9800;
          margin-top: 0.5rem;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .container {
            padding: 2rem 1.5rem;
          }

          .test-header h1 {
            font-size: 2rem;
          }

          .photo-grid,
          .test-info,
          .steps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default B2Test;
