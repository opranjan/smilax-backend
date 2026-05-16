const fs = require("fs");
const path = require("path");
const multer = require("multer");
const service = require("../service/blog.service");

const uploadDir = path.join(__dirname, "..", "uploads", "blog");
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

const slugify = (str) =>
  String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const parseTags = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim()).filter(Boolean);
  return String(raw)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

const buildCoverUrl = (req, filename) =>
  `${req.protocol}://${req.get("host")}/uploads/blog/${filename}`;

const removeCover = (filename) => {
  if (!filename) return;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (_) {}
  }
};

const ensureUniqueSlug = async (base, excludeId) => {
  let slug = base || `post-${Date.now()}`;
  let suffix = 1;
  while (await service.slugExists(slug, excludeId)) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
};

exports.createBlog = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      if (req.file) removeCover(req.file.filename);
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    const baseSlug = req.body.slug
      ? slugify(req.body.slug)
      : slugify(title);
    const slug = await ensureUniqueSlug(baseSlug);

    const data = {
      title: title.trim(),
      slug,
      excerpt: req.body.excerpt || "",
      content: req.body.content || "",
      author: req.body.author || "Admin",
      category: req.body.category || "",
      tags: parseTags(req.body.tags),
      status: req.body.status === "published" ? "published" : "draft",
    };

    if (req.file) {
      data.coverFilename = req.file.filename;
      data.coverImage = buildCoverUrl(req, req.file.filename);
    }

    const blog = await service.createBlog(data);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    if (req.file) removeCover(req.file.filename);
    res.status(500).json({ success: false, message: error.message });
  }
};

const withCoverUrl = (req, doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj.coverFilename) {
    obj.coverImage = `${req.protocol}://${req.get("host")}/uploads/blog/${obj.coverFilename}`;
  }
  return obj;
};

exports.getBlogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    const blogs = await service.getBlogs(filter);
    const data = blogs.map((b) => withCoverUrl(req, b));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await service.getBlogById(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, data: withCoverUrl(req, blog) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const existing = await service.getBlogById(req.params.id);
    if (!existing) {
      if (req.file) removeCover(req.file.filename);
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }

    const data = {};
    if (req.body.title !== undefined) data.title = req.body.title.trim();
    if (req.body.excerpt !== undefined) data.excerpt = req.body.excerpt;
    if (req.body.content !== undefined) data.content = req.body.content;
    if (req.body.author !== undefined) data.author = req.body.author;
    if (req.body.category !== undefined) data.category = req.body.category;
    if (req.body.tags !== undefined) data.tags = parseTags(req.body.tags);
    if (req.body.status !== undefined) {
      data.status = req.body.status === "published" ? "published" : "draft";
    }

    if (req.body.slug !== undefined) {
      const baseSlug = slugify(req.body.slug) || existing.slug;
      data.slug = await ensureUniqueSlug(baseSlug, existing._id);
    } else if (data.title && data.title !== existing.title && !req.body.slug) {
      data.slug = await ensureUniqueSlug(slugify(data.title), existing._id);
    }

    if (req.file) {
      removeCover(existing.coverFilename);
      data.coverFilename = req.file.filename;
      data.coverImage = buildCoverUrl(req, req.file.filename);
    }

    const blog = await service.updateBlog(req.params.id, data);
    res.json({ success: true, data: blog });
  } catch (error) {
    if (req.file) removeCover(req.file.filename);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await service.getBlogById(req.params.id);
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    removeCover(blog.coverFilename);
    await service.deleteBlog(req.params.id);
    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
