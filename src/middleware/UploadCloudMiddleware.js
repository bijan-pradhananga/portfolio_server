const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

class UploadCloudMiddleware {

  upload(destination) {
    // Set up Cloudinary storage
    this.storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: destination, // The folder in Cloudinary where images will be stored
        format: async (req, file) => {
          const formats = file.mimetype.split('/');
          return formats[1]; // Keep the original file format (e.g., jpg, png)
        },
        public_id: (req, file) => {
          let fileName = file.originalname.trim().replace(/\.[^/.]+$/, ""); // Remove file extension
          return Date.now() + '-' + Math.round(Math.random() * 1E9) + "-" + fileName;
        },
        transformation: [{ width: 1308, height: 816, crop: "fill" }] // Set resolution to 1308x816
      },
    });

    // Return multer middleware using the Cloudinary storage
    return multer({ storage: this.storage });
  }

  uploadMedia(destination) {
    this.storage = new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        const [, format] = (file.mimetype || '').split('/');

        let fileName = file.originalname.trim().replace(/\.[^/.]+$/, "");
        const public_id =
          Date.now() + '-' + Math.round(Math.random() * 1e9) + "-" + fileName;

        return {
          folder: destination,
          resource_type: 'auto',
          format: format || undefined,
          public_id,
        };
      },
    });

    return multer({ storage: this.storage });
  }


  async deleteImage(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  async deleteAsset(publicId, resourceType = 'image') {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      throw new Error(`Failed to delete asset: ${error.message}`);
    }
  }
}

module.exports = UploadCloudMiddleware;
