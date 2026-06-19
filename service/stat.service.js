const Stat = require("../model/stat.model");

exports.createStat = async (data) => Stat.create(data);

exports.getStats = async ({ onlyActive } = {}) => {
  const filter = onlyActive ? { active: true } : {};
  return Stat.find(filter).sort({ order: 1, createdAt: -1 });
};

exports.getStatById = async (id) => Stat.findById(id);

exports.updateStat = async (id, data) =>
  Stat.findByIdAndUpdate(id, data, { new: true });

exports.deleteStat = async (id) => Stat.findByIdAndDelete(id);

exports.reorderStats = async (ids) => {
  const ops = ids.map((id, index) => ({
    updateOne: { filter: { _id: id }, update: { $set: { order: index } } },
  }));
  if (ops.length) await Stat.bulkWrite(ops);
};
