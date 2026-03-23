import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = Router();

// Use memory storage so files are kept in memory and streamed to Cloudinary
// Add limits and file filter to validate size/type
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Allowed MIME types (expanded to include variants like JFIF)
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/tiff',
  'image/jfif',           // JPEG File Interchange Format
  'image/pjpeg',          // Progressive JPEG
  'image/x-jfif',         // Alternative JFIF MIME type
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',      // .mov files
  'video/x-msvideo',      // .avi files
  'video/x-flv',          // .flv files
  'video/x-ms-wmv',       // .wmv files
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    // Check MIME type
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else if (/^(image|video)\//i.test(file.mimetype)) {
      // Fallback: accept any image/* or video/* type
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}. Only image and video files are supported.`));
    }
  },
});

// Ensure cloudinary picks up configuration from CLOUDINARY_URL or env vars
// Configure Cloudinary: prefer full CLOUDINARY_URL, otherwise use individual vars
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ cloudinary_url: process.env.CLOUDINARY_URL });
  console.log('✓ Cloudinary configured via CLOUDINARY_URL');
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✓ Cloudinary configured via individual env vars');
} else {
  console.warn('⚠️  WARNING: Cloudinary credentials not found! Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET in .env');
  console.warn('📝 Uploads will fail until Cloudinary is configured. See CLOUDINARY_SETUP.md for instructions.');
}

// Single file upload with validation and optional basic transformation for images
router.post('/uploads', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  try {
    const streamifier = require('streamifier');
    const isImage = req.file.mimetype.startsWith('image/');
    const opts: any = { resource_type: isImage ? 'image' : 'video' };
    // Optional: allow client to pass a folder name
    if (req.body.folder) opts.folder = req.body.folder;

    // For images, apply a max width to limit size
    if (isImage) opts.transformation = [{ width: 1600, crop: 'limit' }];

    const uploadStream = cloudinary.uploader.upload_stream(opts, (error: any, result: any) => {
      if (error) {
        console.error('Cloudinary upload error for', req.file?.originalname, ':', error);
        const message = error.message?.includes('Timeout') 
          ? 'Upload timeout. File may be too large or network is slow. Try a smaller file.'
          : error.message || 'Upload to Cloudinary failed';
        return res.status(500).json({ error: message });
      }
      return res.json({
        url: result.url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
      });
    });

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err: any) {
    console.error('Upload handler error:', err);
    const message = err?.message || 'An unexpected error occurred during upload';
    res.status(500).json({ error: message || 'Upload failed' });
  }
});

// Bulk upload endpoint: accepts multiple files under 'files' field (max 10)
router.post('/uploads/bulk', upload.array('files', 10), async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) return res.status(400).json({ error: 'No files provided' });

  try {
    const streamifier = require('streamifier');
    const results: any[] = [];

    // Helper to upload a buffer and return a promise
    const uploadBuffer = (buffer: Buffer, mimetype: string, folder?: string) => {
      return new Promise((resolve, reject) => {
        const isImage = mimetype.startsWith('image/');
        const opts: any = { resource_type: isImage ? 'image' : 'video' };
        if (folder) opts.folder = folder;
        if (isImage) opts.transformation = [{ width: 1600, crop: 'limit' }];
        const uploadStream = cloudinary.uploader.upload_stream(opts, (error: any, result: any) => {
          if (error) return reject(error);
          resolve({ url: result.url, secure_url: result.secure_url, public_id: result.public_id, resource_type: result.resource_type });
        });
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    };

    for (const f of files) {
      // eslint-disable-next-line no-await-in-loop
      const r = await uploadBuffer(f.buffer, f.mimetype, req.body.folder);
      results.push(r);
    }

    res.json({ results });
  } catch (err: any) {
    console.error('Bulk upload error:', err);
    const message = err?.message || 'Bulk upload failed';
    res.status(500).json({ error: message || 'An error occurred during bulk upload' });
  }
});

// Error handler middleware for multer and upload errors
router.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: `File too large. Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Max 10 files allowed.' });
    }
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  
  if (err) {
    console.error('Upload route error:', err);
    return res.status(400).json({ error: err.message || 'An error occurred during upload' });
  }
  
  next();
});

export default router;
