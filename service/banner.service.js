const Banner = require("../model/banner.model");

exports.createBanner = async (data) => {
  return await Banner.create(data);
};

exports.getBanners = async ({ onlyActive } = {}) => {
  const filter = onlyActive ? { active: true } : {};
  return await Banner.find(filter).sort({ order: 1, createdAt: -1 });
};

exports.getBannerById = async (id) => {
  return await Banner.findById(id);
};

exports.updateBanner = async (id, data) => {
  return await Banner.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteBanner = async (id) => {
  return await Banner.findByIdAndDelete(id);
};

exports.reorderBanners = async (ids) => {
  const ops = ids.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }));
  if (ops.length) await Banner.bulkWrite(ops);
};
