const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
    filename: { type: String, required: true },
    originalName: { type: String },
    url: { type: String, required: true },
    // Optional overlay content shown on top of the banner
    title: { type: String },
    subtitle: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
