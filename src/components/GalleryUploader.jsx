import { useCallback, useState, useEffect } from 'react'
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
  FiClock,
  FiTrash2
} from 'react-icons/fi'
import './GalleryUploader.css'
import { getGalleryCategories, addCategory, deleteCategory, deletePhoto } from '../config/supabase'

function GalleryUploader({ galleryId, galleryName, existingPhotos = [], onUploadComplete, onClose, onPhotoDeleted, onCategoryChanged }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Charger les catégories depuis la base de données
  useEffect(() => {
    loadCategories()
  }, [galleryId])

  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const data = await getGalleryCategories(galleryId)
      setCategories(data || [])
    } catch (err) {
      console.error('Error loading categories:', err)
    } finally {
      setLoadingCategories(false)
    }
  }

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
    setSelectedCategory(category.name)
    setShowNewCategoryInput(false)
    setNewCategory('')
  }

  const handleCreateNewCategory = async () => {
    if (newCategory.trim()) {
      const categoryName = newCategory.trim()
      try {
        await addCategory(galleryId, categoryName)
        await loadCategories()
        setSelectedCategory(categoryName)
        setShowNewCategoryInput(false)
        setNewCategory('')
        setSuccess(`✅ Catégorie "${categoryName}" créée`)
        setTimeout(() => setSuccess(''), 2000)
        if (onCategoryChanged) onCategoryChanged()
      } catch (err) {
        console.error('Error creating category:', err)
        setError(`Erreur lors de la création de la catégorie: ${err.message}`)
      }
    }
  }

  const handleDeleteCategory = async (category) => {
    const photosInCategory = existingPhotos.filter(p => p.category === category.name).length
    
    if (photosInCategory > 0) {
      alert(`Impossible de supprimer "${category.name}": ${photosInCategory} photo(s) sont dans cette catégorie. Supprimez d'abord les photos.`)
      return
    }
    
    if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
      try {
        await deleteCategory(category.id)
        await loadCategories()
        if (selectedCategory === category.name) {
          setSelectedCategory('')
        }
        setSuccess(`✅ Catégorie supprimée`)
        setTimeout(() => setSuccess(''), 2000)
        if (onCategoryChanged) onCategoryChanged()
      } catch (err) {
        console.error('Error deleting category:', err)
        setError(`Erreur: ${err.message}`)
      }
    }
  }

  const handleDeletePhoto = async (photo) => {
    if (!confirm(`Supprimer cette photo ?`)) return

    try {
      // Supprimer de Backblaze B2
      await fetch('https://europe-west1-david-irie-photographie.cloudfunctions.net/deleteFromBackblaze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileUrl: photo.url })
      })

      // Supprimer de Supabase
      await deletePhoto(photo.id)
      
      setSuccess(`✅ Photo supprimée`)
      setTimeout(() => setSuccess(''), 2000)
      
      if (onPhotoDeleted) onPhotoDeleted()
    } catch (err) {
      console.error('Error deleting photo:', err)
      setError(`Erreur lors de la suppression: ${err.message}`)
    }
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    // Vérifier si une catégorie est sélectionnée
    if (!selectedCategory && categories.length > 0) {
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
  }, [galleryId, selectedCategory, categories.length, onUploadComplete])

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
          <label className="category-label"><FiFolder size={18} /> Catégories</label>
          
          {loadingCategories ? (
            <p>Chargement des catégories...</p>
          ) : (
            <div className="category-buttons">
              {categories.map(cat => (
                <div key={cat.id} className="category-btn-wrapper">
                  <button
                    type="button"
                    className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat)}
                    disabled={uploading}
                  >
                    {cat.name}
                  </button>
                  <button
                    type="button"
                    className="category-delete-btn"
                    onClick={() => handleDeleteCategory(cat)}
                    disabled={uploading}
                    title="Supprimer la catégorie"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
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
            
            {/* Afficher les photos par catégorie */}
            {categories.map(category => {
              const photosInCategory = existingPhotos.filter(p => p.category === category.name)
              return (
                <div key={category.id} className="category-group">
                  <h4 className="category-group-title">
                    <FiFolder size={18} /> {category.name} ({photosInCategory.length})
                  </h4>
                  {photosInCategory.length > 0 ? (
                    <div className="existing-photos-grid">
                      {photosInCategory.map((photo) => (
                        <div key={photo.id} className="existing-photo-item">
                          <img src={photo.url} alt={photo.filename} />
                          <button
                            className="delete-photo-btn"
                            onClick={() => handleDeletePhoto(photo)}
                            title="Supprimer cette photo"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-category">Aucune photo dans cette catégorie</p>
                  )}
                </div>
              )
            })}

            {/* Photos sans catégorie */}
            {existingPhotos.filter(p => !p.category).length > 0 && (
              <div className="category-group">
                <h4 className="category-group-title"><FiFolder size={18} /> Sans catégorie ({existingPhotos.filter(p => !p.category).length})</h4>
                <div className="existing-photos-grid">
                  {existingPhotos.filter(p => !p.category).map((photo) => (
                    <div key={photo.id} className="existing-photo-item">
                      <img src={photo.url} alt={photo.filename} />
                      <button
                        className="delete-photo-btn"
                        onClick={() => handleDeletePhoto(photo)}
                        title="Supprimer cette photo"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
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
