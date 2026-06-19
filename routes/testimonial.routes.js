const express = require("express");
const router = express.Router();
const controller = require("../controller/testimonial.controller");
const { requireAdmin, optionalAdmin } = require("../middleware/auth.middleware");

router.get("/", optionalAdmin, controller.getTestimonials);

router.post("/", requireAdmin, controller.upload.single("image"), controller.createTestimonial);
router.put("/reorder", requireAdmin, controller.reorderTestimonials);
router.put("/:id", requireAdmin, controller.upload.single("image"), controller.updateTestimonial);
router.delete("/:id", requireAdmin, controller.deleteTestimonial);

module.exports = router;
