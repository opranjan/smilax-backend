const service = require("../service/doctor.service");
const { createUploader } = require("../util/upload");

const { upload, fileUrl, removeFile } = createUploader("doctors", {
  images: true,
  maxMB: 15,
});

exports.upload = upload;

const TEXT_FIELDS = ["name", "specialty", "qualifications", "bio"];

exports.getDoctors = async (req, res) => {
  try {
    const onlyActive = !req.admin;
    const doctors = await service.getDoctors({ onlyActive });
    const data = doctors.map((d) => {
      const obj = d.toObject ? d.toObject() : d;
      if (obj.filename) obj.url = fileUrl(req, obj.filename);
      return obj;
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDoctor = async (req, res) => {
  try {
    if (!req.body.name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    const payload = {
      name: req.body.name,
      specialty: req.body.specialty || "",
      qualifications: req.body.qualifications || "",
      bio: req.body.bio || "",
    };
    if (req.file) {
      payload.filename = req.file.filename;
      payload.url = fileUrl(req, req.file.filename);
    }
    const doctor = await service.createDoctor(payload);
    res.status(201).json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await service.getDoctorById(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const update = {};
    TEXT_FIELDS.forEach((k) => {
      if (req.body[k] !== undefined) update[k] = req.body[k];
    });
    if (req.body.active !== undefined) {
      update.active = req.body.active === "true" || req.body.active === true;
    }
    if (req.file) {
      removeFile(doctor.filename);
      update.filename = req.file.filename;
      update.url = fileUrl(req, req.file.filename);
    }
    if (Object.keys(update).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }
    const updated = await service.updateDoctor(req.params.id, update);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.reorderDoctors = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "ids must be a non-empty array" });
    }
    await service.reorderDoctors(ids);
    res.json({ success: true, message: "Order updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await service.getDoctorById(req.params.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    removeFile(doctor.filename);
    await service.deleteDoctor(req.params.id);
    res.json({ success: true, message: "Doctor deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
