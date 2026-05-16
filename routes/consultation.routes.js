const express = require("express");
const router = express.Router();
const controller = require("../controller/consultation.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

// Public: consultation form submission
router.post("/", controller.createConsultation);

// Admin only
router.get("/", requireAdmin, controller.getConsultations);
router.delete("/:id", requireAdmin, controller.deleteConsultation);

module.exports = router;
