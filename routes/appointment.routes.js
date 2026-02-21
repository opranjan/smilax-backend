const express = require("express");
const router = express.Router();
const controller = require("../controller/appointment.controller");

router.post("/", controller.createAppointment);
router.get("/", controller.getAppointments);

module.exports = router;