const express = require("express");

const router = express.Router();

const {
  getGoogleReviews,
} = require("../controller/googlereview.controller");

router.get("/google-reviews", getGoogleReviews);

module.exports = router;