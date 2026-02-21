const service = require("../service/consultation.service");

exports.createConsultation = async (req, res) => {
  try {
    const data = await service.createConsultation(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};