const express = require("express");
const router = express.Router();
const controller = require("../controller/gallery.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

// Public: frontend reads gallery
router.get("/", controller.getImages);

// Admin only
router.post(
  "/",
  requireAdmin,
  controller.upload.single("image"),
  controller.uploadImage
);
router.put("/reorder", requireAdmin, controller.reorderImages);
router.put(
  "/:id",
  requireAdmin,
  controller.upload.single("image"),
  controller.replaceImage
);
router.delete("/:id", requireAdmin, controller.deleteImage);

module.exports = router;
