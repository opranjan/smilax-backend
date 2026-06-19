const express = require("express");
const router = express.Router();
const controller = require("../controller/stat.controller");
const { requireAdmin, optionalAdmin } = require("../middleware/auth.middleware");

router.get("/", optionalAdmin, controller.getStats);

router.post("/", requireAdmin, controller.upload.single("icon"), controller.createStat);
router.put("/reorder", requireAdmin, controller.reorderStats);
router.put("/:id", requireAdmin, controller.upload.single("icon"), controller.updateStat);
router.delete("/:id", requireAdmin, controller.deleteStat);

module.exports = router;
