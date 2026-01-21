import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEdit2, FiUpload, FiX, FiCheck } from 'react-icons/fi'
import { useAdmin } from '../contexts/AdminContext'
import { supabase } from '../config/supabase'
import imageCompression from 'browser-image-compression'
import { v4 as uuid } from 'uuid'
import './EditableImage.css'

const CLOUD_FUNCTION_URL = 'https://europe-west1-david-irie-photographie.cloudfunctions.net/uploadToBackblaze'

function EditableImage({ photoKey, src, alt, className, style, onClick, onUploadSuccess }) {
  const { isEditMode } = useAdmin()
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image')
      return
    }

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const uploadToB2 = async (file, fileName) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }
    
    const compressedFile = await imageCompression(file, options)
    const formData = new FormData()
    formData.append('file', compressedFile, fileName)
    formData.append('folderPath', 'site-photos')

    const response = await fetch(CLOUD_FUNCTION_URL, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Upload failed')
    }

    return await response.json()
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError('')

    try {
      const ext = selectedFile.name.split('.').pop()
      const fileName = `${photoKey}_${uuid()}.${ext}`
      
      const { url } = await uploadToB2(selectedFile, fileName)

      // If parent provided a handler, call it instead of updating `site_photos` here
      if (typeof onUploadSuccess === 'function') {
        await onUploadSuccess(url)
      } else {
        // Mettre à jour la base de données (site_photos table) by default
        const { error: updateError } = await supabase
          .from('site_photos')
          .update({ 
            url: url,
            updated_at: new Date().toISOString()
          })
          .eq('photo_key', photoKey)

        if (updateError) throw updateError

        // Recharger la page pour afficher la nouvelle image
        window.location.reload()
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="editable-image-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
        <img 
          src={src} 
          alt={alt} 
          className={className} 
          style={style}
          onClick={onClick}
        />
        
        {isEditMode && (
          <motion.div
            className="editable-image-overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="editable-image-edit-btn"
              onClick={(e) => {
                e.stopPropagation()
                setShowModal(true)
              }}
            >
              <FiEdit2 size={20} />
              <span>Modifier</span>
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="editable-image-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !uploading && setShowModal(false)}
          >
            <motion.div
              className="editable-image-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="editable-image-modal-header">
                <h3><FiUpload size={20} /> Remplacer la photo</h3>
                <button
                  className="editable-image-modal-close"
                  onClick={() => !uploading && setShowModal(false)}
                  disabled={uploading}
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="editable-image-modal-body">
                <div className="editable-image-preview">
                  <p className="editable-image-label">Photo actuelle :</p>
                  <img src={src} alt="Actuelle" />
                </div>

                {preview && (
                  <div className="editable-image-preview">
                    <p className="editable-image-label">Nouvelle photo :</p>
                    <img src={preview} alt="Nouvelle" />
                  </div>
                )}

                <div className="editable-image-upload-section">
                  <label className="editable-image-upload-label">
                    <FiUpload size={18} />
                    <span>Choisir une nouvelle photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {error && (
                  <div className="editable-image-error">
                    {error}
                  </div>
                )}
              </div>

              <div className="editable-image-modal-footer">
                <button
                  className="editable-image-btn editable-image-btn-cancel"
                  onClick={() => setShowModal(false)}
                  disabled={uploading}
                >
                  Annuler
                </button>
                <button
                  className="editable-image-btn editable-image-btn-primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner"></span>
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <FiCheck size={18} />
                      Remplacer
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default EditableImage
