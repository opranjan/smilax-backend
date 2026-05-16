const express = require("express");
const router = express.Router();
const controller = require("../controller/blog.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

// Public: read blogs (frontend integration later)
router.get("/", controller.getBlogs);
router.get("/:id", controller.getBlog);

// Admin only
router.post(
  "/",
  requireAdmin,
  controller.upload.single("coverImage"),
  controller.createBlog
);
router.patch(
  "/:id",
  requireAdmin,
  controller.upload.single("coverImage"),
  controller.updateBlog
);
router.delete("/:id", requireAdmin, controller.deleteBlog);

module.exports = router;
