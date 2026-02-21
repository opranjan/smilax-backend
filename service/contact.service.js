const Contact = require("../model/contact.model");

exports.createContact = async (data) => {
  return await Contact.create(data);
};