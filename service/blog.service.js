const Blog = require("../model/blog.model");

exports.createBlog = async (data) => Blog.create(data);

exports.getBlogs = async (filter = {}) =>
  Blog.find(filter).sort({ createdAt: -1 });

exports.getBlogById = async (id) => Blog.findById(id);

exports.getBlogBySlug = async (slug) => Blog.findOne({ slug });

exports.updateBlog = async (id, data) =>
  Blog.findByIdAndUpdate(id, data, { new: true });

exports.deleteBlog = async (id) => Blog.findByIdAndDelete(id);

exports.slugExists = async (slug, excludeId) => {
  const query = { slug };
  if (excludeId) query._id = { $ne: excludeId };
  return Blog.exists(query);
};
