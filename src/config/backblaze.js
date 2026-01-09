/**
 * Backblaze B2 Configuration
 * 
 * Configuration for photo storage using Backblaze B2
 * Photos are served via public URLs
 */

export const B2_CONFIG = {
  // Bucket information
  bucketName: 'david-irie-photo',
  bucketId: '4a3a9d57295faa0096bb091e',
  
  // Public URL for accessing files
  // Format: https://f005.backblazeb2.com/file/david-irie-photo/filename.jpg
  baseUrl: 'https://f005.backblazeb2.com/file/david-irie-photo',
  
  // S3-compatible endpoint (for future API usage)
  endpoint: 'https://s3.us-east-005.backblazeb2.com',
  region: 'us-east-005',
  
  // Photo categories/folders
  folders: {
    portfolio: 'portfolio',
    gallery: 'gallery',
    events: 'events',
    portraits: 'portraits',
    landscapes: 'landscapes',
    thumbnails: 'thumbnails'
  }
};

/**
 * Get photo URL from Backblaze B2
 * @param {string} filename - The photo filename
 * @param {string} folder - Optional folder/category
 * @returns {string} Full URL to the photo
 */
export function getPhotoUrl(filename, folder = '') {
  const path = folder ? `${folder}/${filename}` : filename;
  return `${B2_CONFIG.baseUrl}/${path}`;
}

/**
 * Get thumbnail URL
 * @param {string} filename - The photo filename
 * @returns {string} Full URL to the thumbnail
 */
export function getThumbnailUrl(filename) {
  return getPhotoUrl(filename, B2_CONFIG.folders.thumbnails);
}

/**
 * Extract filename from B2 URL
 * @param {string} url - The B2 URL
 * @returns {string} The filename
 */
export function getFilenameFromUrl(url) {
  return url.split('/').pop();
}

export default B2_CONFIG;
