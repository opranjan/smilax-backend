const express = require("express");
const router = express.Router();
const controller = require("../controller/auth.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

router.post("/login", controller.login);
router.get("/me", requireAdmin, controller.me);

module.exports = router;
