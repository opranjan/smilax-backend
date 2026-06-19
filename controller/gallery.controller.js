const fs = require("fs");
const path = require("path");
const multer = require("multer");
const service = require("../service/gallery.service");

const uploadDir = path.join(__dirname, "..", "uploads", "gallery");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
  if (/^image\/(jpeg|jpg|png|webp|gif)$/i.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/uploads/gallery/${req.file.filename}`;
    const image = await service.createImage({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url,
      category: req.body.category || "clinic",
    });
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const images = await service.getImages(req.query.category);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const data = images.map((img) => {
      const obj = img.toObject ? img.toObject() : img;
      if (obj.filename) {
        obj.url = `${baseUrl}/uploads/gallery/${obj.filename}`;
      }
      return obj;
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reorderImages = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ids must be a non-empty array" });
    }
    await service.reorderImages(ids);
    res.json({ success: true, message: "Order updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.replaceImage = async (req, res) => {
  try {
    const image = await service.getImageById(req.params.id);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const update = {};

    // If a new file was uploaded, swap it in and remove the old one.
    if (req.file) {
      const oldPath = path.join(uploadDir, image.filename);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      update.filename = req.file.filename;
      update.originalName = req.file.originalname;
      update.url = `${baseUrl}/uploads/gallery/${req.file.filename}`;
    }

    if (req.body.category) {
      update.category = req.body.category;
    }

    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }

    const updated = await service.updateImage(req.params.id, update);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await service.getImageById(req.params.id);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }
    const filePath = path.join(uploadDir, image.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await service.deleteImage(req.params.id);
    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
