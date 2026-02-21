const Appointment = require("../model/appointment.model");

exports.createAppointment = async (data) => {
  return await Appointment.create(data);
};

exports.getAppointments = async () => {
  return await Appointment.find().sort({ createdAt: -1 });
};