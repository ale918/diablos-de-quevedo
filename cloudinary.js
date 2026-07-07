const cloudinary = require('cloudinary').v2;

// Configura Cloudinary usando variables de entorno (las pones en Railway,
// nunca hardcodeadas en el código). Ver README para cómo obtenerlas.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

function isConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Sube un buffer (archivo en memoria, viene de multer) a Cloudinary.
// resourceType: "image" o "video"
function uploadBuffer(buffer, { folder = 'diablos-de-quevedo', resourceType = 'image' } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

module.exports = { uploadBuffer, isConfigured };
