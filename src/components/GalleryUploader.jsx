import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { v4 as uuid } from 'uuid'
import { 
  FiUpload, 
  FiX, 
  FiFolder, 
  FiFolderPlus, 
  FiCheck, 
  FiImage,
  FiClock 
} from 'react-icons/fi'
import './GalleryUploader.css'

function GalleryUploader({ galleryId, galleryName, existingPhotos = [], onUploadComplete, onClose }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)

  // Extraire les catégories existantes des photos + garder les nouvelles créées
  const existingCategoriesFromPhotos = [...new Set(existingPhotos.map(p => p.category).filter(Boolean))]
  const [allCategories, setAllCategories] = useState(existingCategoriesFromPhotos)

  const uploadToB2 = async (file, fileName) => {
    // Compression
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    })

    // Convert to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(compressed)
    })

    // Upload via Cloud Function
    const response = await fetch(
      'https://europe-west1-david-irie-photographie.cloudfunctions.net/uploadToBackblaze',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64,
          fileName: fileName,
          galleryId: galleryId,
          contentType: file.type
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${errorText}`)
    }

    const data = await response.json()
    return data.url
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setShowNewCategoryInput(false)
    setNewCategory('')
  }

  const handleCreateNewCategory = () => {
    if (newCategory.trim()) {
      const categoryName = newCategory.trim()
      setSelectedCategory(categoryName)
      // Ajouter la nouvelle catégorie à la liste
      if (!allCategories.includes(categoryName)) {
        setAllCategories([...allCategories, categoryName])
      }
      setShowNewCategoryInput(false)
      setNewCategory('')
    }
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    // Vérifier si une catégorie est sélectionnée
    if (!selectedCategory && allCategories.length > 0) {
      setError('Veuillez sélectionner une catégorie avant d\'uploader des photos')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')
    setProgress({ current: 0, total: acceptedFiles.length })

    // Create previews
    const newPreviews = acceptedFiles.map(file => ({
      id: uuid(),
      preview: URL.createObjectURL(file),
      name: file.name
    }))
    setPreviews(newPreviews)

    // Upload files
    let uploaded = 0
    const uploadedPhotos = []

    for (const file of acceptedFiles) {
      try {
        const timestamp = Date.now()
        const fileName = `${timestamp}-${file.name}`
        const url = await uploadToB2(file, fileName)
        
        uploadedPhotos.push({
          id: uuid(),
          url,
          fileName: file.name,
          category: selectedCategory || 'Sans catégorie',
          uploadedAt: new Date().toISOString()
        })

        uploaded++
        setProgress({ current: uploaded, total: acceptedFiles.length })
      } catch (err) {
        console.error('Upload error:', err)
        setError(`Erreur lors de l'upload de ${file.name}: ${err.message}`)
      }
    }

    setUploading(false)
    setPreviews([])

    if (uploadedPhotos.length > 0) {
      setSuccess(`✅ ${uploadedPhotos.length}/${acceptedFiles.length} photo${uploadedPhotos.length > 1 ? 's' : ''} uploadée${uploadedPhotos.length > 1 ? 's' : ''} avec succès !`)
      onUploadComplete(uploadedPhotos)
    }
  }, [galleryId, selectedCategory, allCategories.length, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: true,
    disabled: uploading
  })

  return (
    <div className="gallery-uploader-modal">
      <div className="uploader-overlay" onClick={onClose}></div>
      <div className="uploader-content">
        <div className="uploader-header">
          <h2><FiUpload size={24} /> Ajouter des photos</h2>
          <p className="uploader-gallery-name">{galleryName}</p>
          <button className="uploader-close" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Category Selection */}
        <div className="category-section">
          <label className="category-label"><FiFolder size={18} /> Catégorie des photos</label>
          
          <div className="category-buttons">
            {allCategories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
                disabled={uploading}
              >
                {cat}
              </button>
            ))}
            
            {!showNewCategoryInput ? (
              <button
                type="button"
                className="category-btn new-category-btn"
                onClick={() => setShowNewCategoryInput(true)}
                disabled={uploading}
              >
                <FiFolderPlus size={16} /> Nouvelle catégorie
              </button>
            ) : (
              <div className="new-category-input-group">
                <input
                  type="text"
                  placeholder="Ex: Entrée de la mariée"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateNewCategory()}
                  autoFocus
                  disabled={uploading}
                />
                <button
                  type="button"
                  className="create-category-btn"
                  onClick={handleCreateNewCategory}
                  disabled={uploading || !newCategory.trim()}
                >
                  <FiCheck size={18} />
                </button>
                <button
                  type="button"
                  className="cancel-category-btn"
                  onClick={() => {
                    setShowNewCategoryInput(false)
                    setNewCategory('')
                  }}
                  disabled={uploading}
                >
                  <FiX size={18} />
                </button>
              </div>
            )}
          </div>

          {selectedCategory && (
            <p className="selected-category-info">
              <FiFolder size={16} /> Catégorie sélectionnée : <strong>{selectedCategory}</strong>
            </p>
          )}
        </div>

        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-icon"><FiClock size={48} /></div>
              <p className="progress-text">Upload en cours...</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
              <p className="progress-count">{progress.current} / {progress.total} photos</p>
            </div>
          ) : isDragActive ? (
            <>
              <div className="dropzone-icon"><FiUpload size={64} /></div>
              <p className="dropzone-text">Déposez les photos ici...</p>
            </>
          ) : (
            <>
              <div className="dropzone-icon"><FiImage size={64} /></div>
              <p className="dropzone-text">
                Glissez vos photos ici ou cliquez pour sélectionner
              </p>
              <p className="dropzone-hint">
                JPG, PNG ou WebP • Les images seront compressées automatiquement
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="upload-message error-message">
            ❌ {error}
          </div>
        )}

        {success && (
          <div className="upload-message success-message">
            {success}
          </div>
        )}

        {previews.length > 0 && !uploading && (
          <div className="upload-previews">
            <h3>Photos sélectionnées ({previews.length})</h3>
            <div className="preview-grid">
              {previews.map(preview => (
                <div key={preview.id} className="preview-item">
                  <img src={preview.preview} alt={preview.name} />
                  <p>{preview.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {existingPhotos.length > 0 && (
          <div className="existing-photos-section">
            <h3><FiImage size={20} /> Photos dans cette galerie ({existingPhotos.length})</h3>
            
            {/* Grouper les photos par catégorie */}
            {existingCategoriesFromPhotos.length > 0 ? (
              existingCategoriesFromPhotos.map(category => {
                const photosInCategory = existingPhotos.filter(p => p.category === category)
                return (
                  <div key={category} className="category-group">
                    <h4 className="category-group-title"><FiFolder size={18} /> {category} ({photosInCategory.length})</h4>
                    <div className="existing-photos-grid">
                      {photosInCategory.map((photo, index) => (
                        <div key={photo.id || index} className="existing-photo-item">
                          <img src={photo.url || photo} alt={`Photo ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="existing-photos-grid">
                {existingPhotos.map((photo, index) => (
                  <div key={photo.id || index} className="existing-photo-item">
                    <img src={photo.url || photo} alt={`Photo ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}

            {/* Photos sans catégorie */}
            {existingPhotos.filter(p => !p.category).length > 0 && (
              <div className="category-group">
                <h4 className="category-group-title"><FiFolder size={18} /> Sans catégorie ({existingPhotos.filter(p => !p.category).length})</h4>
                <div className="existing-photos-grid">
                  {existingPhotos.filter(p => !p.category).map((photo, index) => (
                    <div key={photo.id || index} className="existing-photo-item">
                      <img src={photo.url || photo} alt={`Photo ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GalleryUploader
