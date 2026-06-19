const mongoose = require("mongoose");

// Single-document collection holding global site/contact settings.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },
    clinicName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    hours: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    mapEmbed: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
