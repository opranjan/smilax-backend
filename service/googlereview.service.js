const axios = require("axios");

const getGoogleReviewsService = async () => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          place_id: process.env.PLACE_ID,
          fields: "name,rating,reviews,user_ratings_total",
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    return response.data.result;

  } catch (error) {
    console.log("Service Error:", error.message);

    throw new Error("Failed to fetch Google reviews");
  }
};

module.exports = {
  getGoogleReviewsService,
};