const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String },
    url: { type: String, required: true },
    name: { type: String, default: "" },
    text: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
