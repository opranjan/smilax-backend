const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", consultationSchema);