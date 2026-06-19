const fs = require("fs");
const path = require("path");
const multer = require("multer");
const service = require("../service/banner.service");

const uploadDir = path.join(__dirname, "..", "uploads", "banners");
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
  } else if (/^video\/(mp4|webm|ogg|quicktime)$/i.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image or video files are allowed"));
  }
};

exports.upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60 MB (allow videos)
});

const typeFromMime = (mimetype) =>
  /^video\//i.test(mimetype) ? "video" : "image";

const buildUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/banners/${filename}`;

exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    const banner = await service.createBanner({
      type: typeFromMime(req.file.mimetype),
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: buildUrl(req, req.file.filename),
      title: req.body.title || "",
      subtitle: req.body.subtitle || "",
      buttonText: req.body.buttonText || "",
      buttonLink: req.body.buttonLink || "",
    });
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBanners = async (req, res) => {
  try {
    // Public requests get only active banners; admin (with token) gets all.
    const onlyActive = !req.admin;
    const banners = await service.getBanners({ onlyActive });
    const data = banners.map((b) => {
      const obj = b.toObject ? b.toObject() : b;
      if (obj.filename) obj.url = buildUrl(req, obj.filename);
      return obj;
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reorderBanners = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ids must be a non-empty array" });
    }
    await service.reorderBanners(ids);
    res.json({ success: true, message: "Order updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await service.getBannerById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }

    const update = {};

    // Replace the media file if a new one was uploaded.
    if (req.file) {
      const oldPath = path.join(uploadDir, banner.filename);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      update.type = typeFromMime(req.file.mimetype);
      update.filename = req.file.filename;
      update.originalName = req.file.originalname;
      update.url = buildUrl(req, req.file.filename);
    }

    // Editable text/link fields + active toggle.
    ["title", "subtitle", "buttonText", "buttonLink"].forEach((key) => {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    });
    if (req.body.active !== undefined) {
      update.active = req.body.active === "true" || req.body.active === true;
    }

    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }

    const updated = await service.updateBanner(req.params.id, update);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await service.getBannerById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    const filePath = path.join(uploadDir, banner.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await service.deleteBanner(req.params.id);
    res.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
