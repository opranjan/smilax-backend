const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String },
    url: { type: String, required: true },
    category: {
      type: String,
      enum: ["clinic", "treatment", "beforeafter", "team"],
      default: "clinic",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
