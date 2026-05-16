const service = require("../service/dashboard.service");

exports.getStats = async (req, res) => {
  try {
    const data = await service.getStats();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
