const service = require("../service/appointment.service");

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await service.createAppointment(req.body);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await service.getAppointments();
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};