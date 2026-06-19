const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // big value e.g. "2000+"
    text: { type: String, default: "" }, // label e.g. "Happy Smiles"
    iconFilename: { type: String },
    iconUrl: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stat", statSchema);
