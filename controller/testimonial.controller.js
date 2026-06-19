const service = require("../service/testimonial.service");
const { createUploader } = require("../util/upload");

const { upload, fileUrl, removeFile } = createUploader("testimonials", {
  images: true,
  maxMB: 15,
});

exports.upload = upload;

exports.getTestimonials = async (req, res) => {
  try {
    const onlyActive = !req.admin;
    const items = await service.getTestimonials({ onlyActive });
    const data = items.map((t) => {
      const obj = t.toObject ? t.toObject() : t;
      if (obj.filename) obj.url = fileUrl(req, obj.filename);
      return obj;
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTestimonial = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }
    const item = await service.createTestimonial({
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: fileUrl(req, req.file.filename),
      name: req.body.name || "",
      text: req.body.text || "",
      rating: req.body.rating ? Number(req.body.rating) : 5,
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    const item = await service.getTestimonialById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }
    const update = {};
    ["name", "text"].forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });
    if (req.body.rating !== undefined) update.rating = Number(req.body.rating);
    if (req.body.active !== undefined) {
      update.active = req.body.active === "true" || req.body.active === true;
    }
    if (req.file) {
      removeFile(item.filename);
      update.filename = req.file.filename;
      update.originalName = req.file.originalname;
      update.url = fileUrl(req, req.file.filename);
    }
    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }
    const updated = await service.updateTestimonial(req.params.id, update);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reorderTestimonials = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ids must be a non-empty array" });
    }
    await service.reorderTestimonials(ids);
    res.json({ success: true, message: "Order updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    const item = await service.getTestimonialById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }
    removeFile(item.filename);
    await service.deleteTestimonial(req.params.id);
    res.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
