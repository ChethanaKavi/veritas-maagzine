# Cloudinary Upload Setup Guide

This guide explains how to set up Cloudinary for image and video uploads in the Veritas Magazine platform.

## 1. Backend Setup

### Install Dependencies

```bash
cd backend
npm install cloudinary multer streamifier
```

### Configure Environment Variables

Create or update `backend/.env` with your Cloudinary credentials:

**Option A: Using CLOUDINARY_URL (Recommended)**
```
CLOUDINARY_URL=cloudinary://YOUR_API_KEY:YOUR_API_SECRET@YOUR_CLOUD_NAME
```

**Option B: Using Individual Environment Variables**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Complete .env Example:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/veritas?schema=public"
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_URL=cloudinary://YOUR_API_KEY:YOUR_API_SECRET@YOUR_CLOUD_NAME
PORT=4000
```

### Get Your Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Find your **Cloud Name**, **API Key**, and **API Secret**
4. ⚠️ **DO NOT commit credentials to Git!** Add `.env` to `.gitignore`

### Restart Backend Server

```bash
cd backend
npm run dev
# or whichever command you use to start the server
```

## 2. Frontend Usage

### Adding Articles with Images

1. Go to Admin → Articles → Add New Article
2. In the "Cover Image" section, click **Browse from Device**
3. Select one or more image files
4. Watch the **progress bar** for each file
5. Wait until upload completes (progress bar reaches 100%)
6. Click **Use** on the uploaded thumbnail to set it as the article cover
7. Fill in other article fields and click **Publish Article**
   - ⚠️ The **Publish** button is **disabled** while uploads are in progress
   - Wait for all uploads to finish before submitting

### Adding Magazines with Images

1. Go to Admin → Magazines → Add New Magazine
2. Click **Browse from Device** in the "Cover Image" section
3. Select image(s)
4. Wait for uploads to complete
5. Click **Use** to set the cover
6. Fill in magazine details and click **Create Magazine**

### Upload Features

✅ **File Validation**
- Accepts images (JPEG, PNG, GIF, etc.) and videos
- Max file size: 5 MB per file
- Automatic image optimization (max width 1600px)

✅ **Upload Progress**
- Real-time progress bar for each file
- File-by-file status display
- "Uploading..." state on submit button

✅ **Error Handling**
- Detailed error messages if upload fails
- Network errors are caught and displayed
- Failed uploads don't block other uploads

❌ **Cannot Submit While Uploading**
- Submit button is disabled during uploads
- Shows "Uploading..." text
- Prevents saving articles with incomplete uploads

## 3. How It Works

### Backend Flow

1. Client sends file via `POST /api/uploads`
2. Backend validates file (type, size)
3. Streams file buffer to Cloudinary API
4. Cloudinary stores file and returns:
   - `url` - CDN URL
   - `secure_url` - HTTPS CDN URL *(used by default)*
   - `public_id` - Unique identifier for deletion
   - `resource_type` - "image" or "video"
5. Backend returns response to client
6. Client receives `secure_url` and uses it for article/magazine

### Frontend Flow

1. User selects file(s) via input
2. XHR (XMLHttpRequest) sends file to `/api/uploads`
3. Progress event updates UI in real-time
4. On success, thumbnail appears with "Use" / "Remove" buttons
5. Clicking "Use" sets the Cloudinary URL as the cover image
6. Submitting form saves article/magazine with Cloudinary URL to database

## 4. Supported File Types

- **Images**: jpeg, jpg, png, gif, webp, bmp, tiff
- **Videos**: mp4, webm, mov, avi, flv, wmv
- **Other**: pdf (stored on Cloudinary)
- **Max Size**: 5 MB

## 5. Bulk Upload Support

The backend also supports uploading up to 10 files at once via `POST /api/uploads/bulk`, but the UI currently handles them sequentially for better UX and progress feedback.

## 6. Troubleshooting

### "Upload failed" Error

**Symptom:** Upload button clicked, progress bar appears, then error shown.

**Solution:**
- Check browser console (F12 → Console tab) for detailed error
- Check backend logs where server is running
- Ensure `.env` has correct Cloudinary credentials
- Restart backend server after updating `.env`
- Verify file size is under 5 MB
- Verify file type is supported (image or video)

### Cloudinary URL Not Saving to DB

**Symptom:** Upload succeeds, but article saved without image URL.

**Solution:**
- Check that you clicked **Use** on the thumbnail after upload completes
- Verify article submit button was NOT disabled before clicking
- Wait for progress bar to reach 100% before submitting
- Check browser DevTools Network tab to see if request has correct `coverImgUrl`

### Button Disabled and Says "Uploading..."

**Symptom:** Button stays disabled even though upload finished.

**Solution:**
- This is normal if uploads are still in progress
- Wait for all progress bars to disappear
- If stuck, refresh the page and retry
- Check backend logs for any errors

## 7. Image Transformations

Images uploaded are automatically resized to a max width of 1600px for optimization. Cloudinary supports additional transformations like:

- Crop
- Resize
- Compress
- Filters
- Watermarks

These can be configured in the backend `uploads.ts` route if needed.

## 8. Database Schema

The `Article` and `Magazine` models store the Cloudinary URL in:
- `Article.coverImgUrl` (string)
- `Magazine.coverImage` (string)

These are regular text URLs, so you can change them anytime without database migrations.

## 9. Production Checklist

- [ ] Cloudinary account created with paid plan (free plan for testing)
- [ ] `CLOUDINARY_URL` added to production environment variables
- [ ] `.env` file added to `.gitignore` (DO NOT commit secrets)
- [ ] Backend dependencies installed: `npm install cloudinary multer streamifier`
- [ ] Backend server restarted with new env vars
- [ ] Test upload with Admin → Articles → Add New Article
- [ ] Verify image appears in article detail page and list

---

**Questions?** Check server console logs and browser DevTools for detailed error messages.
