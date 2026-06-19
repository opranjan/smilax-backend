const express = require("express");
const router = express.Router();
const controller = require("../controller/banner.controller");
const { requireAdmin } = require("../middleware/auth.middleware");
const authService = require("../service/auth.service");

// Sets req.admin when a valid token is present, but never blocks the request.
const optionalAdmin = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (token) {
      const decoded = authService.verifyToken(token);
      req.admin = { id: decoded.id, email: decoded.email };
    }
  } catch (e) {
    // ignore invalid token — treated as public request
  }
  next();
};

// Public reads active banners; admin reads all (active + inactive)
router.get("/", optionalAdmin, controller.getBanners);

// Admin only
router.post(
  "/",
  requireAdmin,
  controller.upload.single("media"),
  controller.createBanner
);
router.put("/reorder", requireAdmin, controller.reorderBanners);
router.put(
  "/:id",
  requireAdmin,
  controller.upload.single("media"),
  controller.updateBanner
);
router.delete("/:id", requireAdmin, controller.deleteBanner);

module.exports = router;
