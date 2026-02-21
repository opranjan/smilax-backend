const service = require("../service/contact.service");

exports.createContact = async (req, res) => {
  try {
    const data = await service.createContact(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};