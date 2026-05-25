const {
  getGoogleReviewsService,
} = require("../service/googlereview.service");

const getGoogleReviews = async (req, res) => {
  try {
    const reviews = await getGoogleReviewsService();

    res.status(200).json({
      success: true,
      data: reviews,
    });

  } catch (error) {
    console.log("Controller Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getGoogleReviews,
};