const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../model/admin.model");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

exports.hashPassword = (plain) => bcrypt.hash(plain, 10);

exports.comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

exports.signToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

exports.verifyToken = (token) => jwt.verify(token, JWT_SECRET);

exports.findByEmail = (email) =>
  Admin.findOne({ email: String(email).toLowerCase().trim() });

exports.findById = (id) => Admin.findById(id);

exports.login = async (email, password) => {
  const admin = await exports.findByEmail(email);
  if (!admin) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const ok = await exports.comparePassword(password, admin.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }
  const token = exports.signToken({ id: admin._id, email: admin.email });
  return {
    token,
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};
