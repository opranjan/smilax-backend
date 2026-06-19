const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, default: "" },
    qualifications: { type: String, default: "" },
    bio: { type: String, default: "" },
    filename: { type: String },
    url: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
