const express = require("express");
const router = express.Router();
const controller = require("../controller/doctor.controller");
const { requireAdmin, optionalAdmin } = require("../middleware/auth.middleware");

router.get("/", optionalAdmin, controller.getDoctors);

router.post("/", requireAdmin, controller.upload.single("photo"), controller.createDoctor);
router.put("/reorder", requireAdmin, controller.reorderDoctors);
router.put("/:id", requireAdmin, controller.upload.single("photo"), controller.updateDoctor);
router.delete("/:id", requireAdmin, controller.deleteDoctor);

module.exports = router;
