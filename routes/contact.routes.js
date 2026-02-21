const express = require("express");
const router = express.Router();
const controller = require("../controller/contact.controller");

router.post("/", controller.createContact);

module.exports = router;