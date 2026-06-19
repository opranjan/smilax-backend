const Doctor = require("../model/doctor.model");

exports.createDoctor = async (data) => Doctor.create(data);

exports.getDoctors = async ({ onlyActive } = {}) => {
  const filter = onlyActive ? { active: true } : {};
  return Doctor.find(filter).sort({ order: 1, createdAt: -1 });
};

exports.getDoctorById = async (id) => Doctor.findById(id);

exports.updateDoctor = async (id, data) =>
  Doctor.findByIdAndUpdate(id, data, { new: true });

exports.deleteDoctor = async (id) => Doctor.findByIdAndDelete(id);

exports.reorderDoctors = async (ids) => {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length) await Doctor.bulkWrite(ops);
};
