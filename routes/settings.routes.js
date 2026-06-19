const express = require("express");
const router = express.Router();
const controller = require("../controller/settings.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

router.get("/", controller.getSettings);
router.put("/", requireAdmin, controller.updateSettings);

module.exports = router;
