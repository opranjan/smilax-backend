const Gallery = require("../model/gallery.model");

exports.createImage = async (data) => {
  return await Gallery.create(data);
};

exports.getImages = async (category) => {
  const filter = category && category !== "all" ? { category } : {};
  return await Gallery.find(filter).sort({ createdAt: -1 });
};

exports.getImageById = async (id) => {
  return await Gallery.findById(id);
};

exports.deleteImage = async (id) => {
  return await Gallery.findByIdAndDelete(id);
};
