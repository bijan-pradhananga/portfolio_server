const Gallery = require('../models/Gallery');
const UploadMiddleware = require('../middleware/UploadCloudMiddleware');

const uploadInstance = new UploadMiddleware();

class GalleryController {
  async index(req, res) {
    try {
      const query = {};
      if (req.query.category) {
        query.category = req.query.category;
      }

      const items = await Gallery.find(query).sort({ createdAt: 1 });
      res.status(200).json({ gallery: items });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async store(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'media file is required' });
      }

      const category = req.body.category;
      const url = req.file.path;
      const publicId = req.file.filename; // multer-storage-cloudinary sets this to the Cloudinary public_id (includes folder)
      const resourceType = req.file.resource_type || (req.file.mimetype || '').split('/')[0] || 'image';

      await Gallery.create({
        category,
        url,
        publicId,
        resourceType: resourceType === 'video' ? 'video' : 'image',
      });

      res.status(201).json({ message: 'Gallery item created successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async show(req, res) {
    try {
      const item = await Gallery.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }
      res.status(200).json({ gallery: item });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async destroy(req, res) {
    try {
      const item = await Gallery.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: 'Gallery item not found' });
      }

      if (item.publicId) {
        await uploadInstance.deleteAsset(item.publicId, item.resourceType);
      }

      res.status(200).json({ message: 'Gallery item deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = GalleryController;
