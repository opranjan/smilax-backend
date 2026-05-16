const express = require("express");
const router = express.Router();
const controller = require("../controller/dashboard.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

router.get("/stats", requireAdmin, controller.getStats);

module.exports = router;
