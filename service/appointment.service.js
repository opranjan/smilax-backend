const Appointment = require("../model/appointment.model");

exports.createAppointment = async (data) => {
  return await Appointment.create(data);
};

exports.getAppointments = async () => {
  return await Appointment.find().sort({ createdAt: -1 });
};

exports.listAppointments = async ({ page = 1, limit = 10, status } = {}) => {
  const filter = {};
  if (status && status !== "all") filter.status = status;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Appointment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Appointment.countDocuments(filter),
  ]);
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

exports.updateAppointmentStatus = async (id, status) => {
  return await Appointment.findByIdAndUpdate(id, { status }, { new: true });
};

exports.deleteAppointment = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};
