const express = require("express");
const router = express.Router();
const controller = require("../controller/consultation.controller");

router.post("/", controller.createConsultation);

module.exports = router;