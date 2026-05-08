const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ['image', 'video'],
    },
    category: {
      type: String,
      required: true,
      enum: ['video', 'coding', 'travel', 'others'],
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
module.exports = Gallery;
