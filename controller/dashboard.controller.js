const service = require("../service/dashboard.service");

const rewriteUrls = (req, data) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  if (Array.isArray(data?.recent?.blogs)) {
    data.recent.blogs = data.recent.blogs.map((b) => {
      if (b && b.coverFilename) {
        b.coverImage = `${baseUrl}/uploads/blog/${b.coverFilename}`;
      }
      return b;
    });
  }
  return data;
};

exports.getStats = async (req, res) => {
  try {
    const data = await service.getStats();
    res.json({ success: true, data: rewriteUrls(req, data) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
