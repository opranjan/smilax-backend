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

// Sets req.admin when a valid token is present, but never blocks the request.
const optionalAdmin = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      const decoded = service.verifyToken(token);
      req.admin = { id: decoded.id, email: decoded.email };
    }
  } catch (e) {
    // ignore invalid token — treat as public request
  }
  next();
};

module.exports = { requireAdmin, optionalAdmin };
