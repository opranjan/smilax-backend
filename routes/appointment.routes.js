const express = require("express");
const router = express.Router();
const controller = require("../controller/appointment.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

// Public: frontend appointment form submission
router.post("/", controller.createAppointment);

// Admin only
router.get("/", requireAdmin, controller.getAppointments);
router.patch("/:id/status", requireAdmin, controller.updateStatus);
router.delete("/:id", requireAdmin, controller.deleteAppointment);

module.exports = router;
