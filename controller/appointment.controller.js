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
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10)
    );
    const status = req.query.status;
    const result = await service.listAppointments({ page, limit, status });
    res.json({
      success: true,
      data: result.items,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const updated = await service.updateAppointmentStatus(
      req.params.id,
      req.body.status
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const result = await service.deleteAppointment(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
