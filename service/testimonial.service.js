const Testimonial = require("../model/testimonial.model");

exports.createTestimonial = async (data) => Testimonial.create(data);

exports.getTestimonials = async ({ onlyActive } = {}) => {
  const filter = onlyActive ? { active: true } : {};
  return Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
};

exports.getTestimonialById = async (id) => Testimonial.findById(id);

exports.updateTestimonial = async (id, data) =>
  Testimonial.findByIdAndUpdate(id, data, { new: true });

exports.deleteTestimonial = async (id) => Testimonial.findByIdAndDelete(id);

exports.reorderTestimonials = async (ids) => {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length) await Testimonial.bulkWrite(ops);
};
