const express = require('express');
const GalleryController = require('../controllers/GalleryController');
const UploadMiddleware = require('../middleware/UploadCloudMiddleware');

const galleryRouter = express.Router();
const gInstance = new GalleryController();

const uploadInstance = new UploadMiddleware();
const upload = uploadInstance.uploadMedia('portfolio/gallery');

galleryRouter.get('/', gInstance.index);
galleryRouter.post('/', upload.single('media'), gInstance.store);
galleryRouter.get('/:id', gInstance.show);
galleryRouter.delete('/:id', gInstance.destroy);

module.exports = galleryRouter;
