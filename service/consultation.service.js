const Consultation = require("../model/consultation.model");

exports.createConsultation = async (data) => {
  return await Consultation.create(data);
};

exports.getConsultations = async () => {
  return await Consultation.find().sort({ createdAt: -1 });
};

exports.listConsultations = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Consultation.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Consultation.countDocuments({}),
  ]);
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

exports.deleteConsultation = async (id) => {
  return await Consultation.findByIdAndDelete(id);
};
