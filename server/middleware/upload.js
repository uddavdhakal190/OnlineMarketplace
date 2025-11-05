const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Memory storage for multer
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (!cloudName || !apiKey || !apiSecret) {
      return reject(new Error('Cloudinary credentials are not configured. Please check your .env file.'));
    }
    
    // Verify credentials format
    if (cloudName.length < 3 || apiKey.length < 10 || apiSecret.length < 10) {
      return reject(new Error('Cloudinary credentials appear to be invalid. Please verify your credentials in the .env file.'));
    }
    
    // Validate file buffer
    if (!file || !file.buffer || file.buffer.length === 0) {
      return reject(new Error('Invalid file: buffer is empty or missing'));
    }
    
    // Check file size (5MB limit)
    if (file.buffer.length > 5 * 1024 * 1024) {
      return reject(new Error('File size exceeds 5MB limit'));
    }
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'mart/products',
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' }
        ],
        timeout: 60000 // 60 second timeout
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload stream error:', error);
          reject(error);
        } else if (!result) {
          reject(new Error('Upload failed: No result returned from Cloudinary'));
        } else {
          resolve(result);
        }
      }
    );
    
    // Handle stream errors
    uploadStream.on('error', (error) => {
      console.error('Upload stream error:', error);
      reject(error);
    });
    
    // Write buffer to stream
    try {
      uploadStream.end(file.buffer);
    } catch (error) {
      console.error('Error writing to upload stream:', error);
      reject(error);
    }
  });
};

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum 5 files allowed.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected field name.' });
    }
  }
  
  if (error.message === 'Only image files are allowed') {
    return res.status(400).json({ message: 'Only image files are allowed.' });
  }
  
  next(error);
};

module.exports = { upload, handleUploadError, uploadToCloudinary };
