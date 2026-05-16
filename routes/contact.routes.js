const express = require("express");
const router = express.Router();
const controller = require("../controller/contact.controller");
const { requireAdmin } = require("../middleware/auth.middleware");

// Public: contact form submission
router.post("/", controller.createContact);

// Admin only
router.get("/", requireAdmin, controller.getContacts);
router.delete("/:id", requireAdmin, controller.deleteContact);

module.exports = router;
