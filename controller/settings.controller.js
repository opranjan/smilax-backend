const service = require("../service/settings.service");

exports.getSettings = async (req, res) => {
  try {
    const settings = await service.getSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await service.updateSettings(req.body || {});
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
