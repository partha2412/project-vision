const cloudinary = require('cloudinary').v2;

// ✅ Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads an array of image buffers to Cloudinary and returns their URLs.
 * @param {Array} files - Array of image files (from multer req.files)
 * @param {String} folder - Cloudinary folder name
 * @returns {Promise<Array>} Array of image URLs
 */
exports.uploadImagesToCloudinary = async (files, folder = 'products') => {
  try {
    if (!files || files.length === 0) {
      throw new Error('No images provided for upload');
    }

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed: ' + error.message);
  }
};
