const service = require("../service/stat.service");
const { createUploader } = require("../util/upload");

const { upload, fileUrl, removeFile } = createUploader("stats", {
  images: true,
  maxMB: 5,
});

exports.upload = upload;

exports.getStats = async (req, res) => {
  try {
    const onlyActive = !req.admin;
    const stats = await service.getStats({ onlyActive });
    const data = stats.map((s) => {
      const obj = s.toObject ? s.toObject() : s;
      if (obj.iconFilename) obj.iconUrl = fileUrl(req, obj.iconFilename);
      return obj;
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createStat = async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      text: req.body.text || "",
    };
    if (!payload.title) {
      return res
        .status(400)
        .json({ success: false, message: "Title (value) is required" });
    }
    if (req.file) {
      payload.iconFilename = req.file.filename;
      payload.iconUrl = fileUrl(req, req.file.filename);
    }
    const stat = await service.createStat(payload);
    res.status(201).json({ success: true, data: stat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStat = async (req, res) => {
  try {
    const stat = await service.getStatById(req.params.id);
    if (!stat) {
      return res
        .status(404)
        .json({ success: false, message: "Stat not found" });
    }
    const update = {};
    ["title", "text"].forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });
    if (req.body.active !== undefined) {
      update.active = req.body.active === "true" || req.body.active === true;
    }
    if (req.file) {
      removeFile(stat.iconFilename);
      update.iconFilename = req.file.filename;
      update.iconUrl = fileUrl(req, req.file.filename);
    }
    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }
    const updated = await service.updateStat(req.params.id, update);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reorderStats = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ids must be a non-empty array" });
    }
    await service.reorderStats(ids);
    res.json({ success: true, message: "Order updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStat = async (req, res) => {
  try {
    const stat = await service.getStatById(req.params.id);
    if (!stat) {
      return res
        .status(404)
        .json({ success: false, message: "Stat not found" });
    }
    removeFile(stat.iconFilename);
    await service.deleteStat(req.params.id);
    res.json({ success: true, message: "Stat deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
