/**
 * One-time seed: create the initial admin account.
 *
 * Run:
 *   node seed.admin.js
 *
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env, otherwise uses defaults.
 * Re-running is safe: if an admin with that email already exists, it is left untouched.
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const Admin = require("./model/admin.model");
const authService = require("./service/auth.service");

const EMAIL = (process.env.ADMIN_EMAIL || "admin@smilaxdental.com").toLowerCase().trim();
const PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const NAME = process.env.ADMIN_NAME || "Admin";

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI is missing in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected");

    const existing = await Admin.findOne({ email: EMAIL });
    if (existing) {
      console.log(`Admin already exists: ${EMAIL} (no changes made)`);
      process.exit(0);
    }

    const hash = await authService.hashPassword(PASSWORD);
    await Admin.create({ name: NAME, email: EMAIL, password: hash });

    console.log("Admin created:");
    console.log(`  email:    ${EMAIL}`);
    console.log(`  password: ${PASSWORD}`);
    console.log("Change the password after first login.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
})();
