const Contact = require("../model/contact.model");

exports.createContact = async (data) => {
  return await Contact.create(data);
};

exports.getContacts = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};

exports.listContacts = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments({}),
  ]);
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
};

exports.deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
