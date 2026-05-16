const service = require("../service/auth.service");

const requireAdmin = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }
    const decoded = service.verifyToken(token);
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { requireAdmin };
