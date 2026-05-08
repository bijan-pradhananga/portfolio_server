# Gallery API (Cloudinary uploads)

This backend adds a **Gallery** collection that stores **images + videos** on Cloudinary and saves metadata in MongoDB.

## Categories (enum)
Allowed values for `category`:
- `video`
- `coding`
- `travel`
- `others`

## Base URL
All endpoints below are mounted under:
- `/gallery`

## Data shape (MongoDB)
Each gallery item stored in DB has:
- `url` (String) — Cloudinary URL
- `publicId` (String) — Cloudinary public id (used for deletion)
- `resourceType` (enum: `image|video`) — used when deleting from Cloudinary
- `category` (enum: `video|coding|travel|others`)
- `createdAt`, `updatedAt`

## Endpoints

### 1) List gallery items
**GET** `/gallery`

Optional filter:
- **GET** `/gallery?category=coding`

Response:
```json
{
  "gallery": [
    {
      "_id": "...",
      "url": "...",
      "publicId": "portfolio/gallery/...",
      "resourceType": "image",
      "category": "coding",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### 2) Create (upload) gallery item
**POST** `/gallery`

- `Content-Type`: `multipart/form-data`
- File field name: `media`
- Body fields:
  - `category`: one of `video|coding|travel|others`

Example (Axios):
```js
import axios from "axios";

export async function uploadGalleryItem({ baseUrl, file, category }) {
  const form = new FormData();
  form.append("media", file); // image/* OR video/*
  form.append("category", category);

  const res = await axios.post(`${baseUrl}/gallery`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}
```

Success response:
```json
{ "message": "Gallery item created successfully" }
```

Error cases:
- `400` if no file is uploaded (`media` missing)
- `500` for server errors

### 3) Get a single item
**GET** `/gallery/:id`

Response:
```json
{ "gallery": { "_id": "...", "url": "...", "category": "travel", "resourceType": "video" } }
```

### 4) Delete a gallery item
**DELETE** `/gallery/:id`

Behavior:
- Deletes the MongoDB record
- Deletes the asset from Cloudinary using `publicId` and `resourceType`

Response:
```json
{ "message": "Gallery item deleted successfully" }
```

## Backend implementation notes (for reference)
- Upload middleware used: `UploadCloudMiddleware.uploadMedia('portfolio/gallery')`
  - Uses `resource_type: 'auto'` so Cloudinary accepts both images and videos.
  - Applies image resizing only to images (not videos).
- Controller: `GalleryController`
  - `index`, `store`, `show`, `destroy`

## Source files
- `src/models/Gallery.js`
- `src/controllers/GalleryController.js`
- `src/routes/galleryRoute.js`
- `src/routes/web.js`
- `src/middleware/UploadCloudMiddleware.js`
