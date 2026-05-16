/**
 * One-time seed: register existing files in uploads/gallery/ as Gallery DB records.
 *
 * Run from `dental backend` folder:
 *   node seed.gallery.js
 *
 * Re-running is safe: it skips files that already have a DB record (matched by filename).
 */

const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const Gallery = require("./model/gallery.model");

const UPLOAD_DIR = path.join(__dirname, "uploads", "gallery");
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;

// Category mapping based on filename. Adjust as needed.
const CLINIC = new Set(["clinic-1.webp", "clinic-2.jpg", "hero.png"]);
const TREATMENT = new Set(["treatment-1.jpg", "equipment.jpg"]);
const TEAM = new Set(["team.jpg"]);

function categoryFor(filename) {
  if (CLINIC.has(filename)) return "clinic";
  if (TREATMENT.has(filename)) return "treatment";
  if (TEAM.has(filename)) return "team";
  // Everything else (numbered/before-after/etc.) → beforeafter
  return "beforeafter";
}

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected");

    if (!fs.existsSync(UPLOAD_DIR)) {
      console.error("Upload dir not found:", UPLOAD_DIR);
      process.exit(1);
    }

    const files = fs
      .readdirSync(UPLOAD_DIR)
      .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f));

    let inserted = 0;
    let skipped = 0;

    for (const file of files) {
      const exists = await Gallery.findOne({ filename: file });
      if (exists) {
        skipped++;
        continue;
      }
      await Gallery.create({
        filename: file,
        originalName: file,
        url: `${BASE_URL}/uploads/gallery/${encodeURIComponent(file)}`,
        category: categoryFor(file),
      });
      inserted++;
    }

    console.log(`Done. Inserted: ${inserted}, Skipped (already in DB): ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
})();
