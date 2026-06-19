const Settings = require("../model/settings.model");

const EDITABLE = [
  "clinicName",
  "tagline",
  "phone",
  "whatsapp",
  "email",
  "address",
  "hours",
  "instagram",
  "facebook",
  "youtube",
  "mapEmbed",
];

exports.getSettings = async () => {
  let settings = await Settings.findOne({ key: "site" });
  if (!settings) settings = await Settings.create({ key: "site" });
  return settings;
};

exports.updateSettings = async (data) => {
  const update = {};
  EDITABLE.forEach((key) => {
    if (data[key] !== undefined) update[key] = data[key];
  });
  return await Settings.findOneAndUpdate({ key: "site" }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
};
