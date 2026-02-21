const Consultation = require("../model/consultation.model");

exports.createConsultation = async (data) => {
  return await Consultation.create(data);
};