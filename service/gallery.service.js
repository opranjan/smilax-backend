const Gallery = require("../model/gallery.model");

exports.createImage = async (data) => {
  return await Gallery.create(data);
};

exports.getImages = async (category) => {
  const filter = category && category !== "all" ? { category } : {};
  return await Gallery.find(filter).sort({ order: 1, createdAt: -1 });
};

exports.reorderImages = async (ids) => {
  const ops = ids.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { order: index } },
    },
  }));
  if (ops.length) await Gallery.bulkWrite(ops);
};

exports.getImageById = async (id) => {
  return await Gallery.findById(id);
};

exports.updateImage = async (id, data) => {
  return await Gallery.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteImage = async (id) => {
  return await Gallery.findByIdAndDelete(id);
};
