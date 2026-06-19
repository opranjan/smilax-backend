const fs = require("fs");
const path = require("path");
const multer = require("multer");

/**
 * Build a multer instance + helpers for a given uploads subfolder.
 * @param {string} subfolder e.g. "stats", "doctors", "testimonials"
 * @param {object} opts { images?: bool, videos?: bool, maxMB?: number }
 */
const createUploader = (subfolder, opts = {}) => {
  const { images = true, videos = false, maxMB = 15 } = opts;
  const uploadDir = path.join(__dirname, "..", "uploads", subfolder);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .slice(0, 40);
      cb(null, `${Date.now()}-${base}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const isImage = /^image\/(jpeg|jpg|png|webp|gif|svg\+xml)$/i.test(
      file.mimetype
    );
    const isVideo = /^video\/(mp4|webm|ogg|quicktime)$/i.test(file.mimetype);
    if ((images && isImage) || (videos && isVideo)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxMB * 1024 * 1024 },
  });

  const fileUrl = (req, filename) =>
    `${req.protocol}://${req.get("host")}/uploads/${subfolder}/${filename}`;

  const removeFile = (filename) => {
    if (!filename) return;
    const fp = path.join(uploadDir, filename);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  };

  return { upload, fileUrl, removeFile, uploadDir };
};

module.exports = { createUploader };
