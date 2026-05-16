const Appointment = require("../model/appointment.model");
const Consultation = require("../model/consultation.model");
const Contact = require("../model/contact.model");
const Gallery = require("../model/gallery.model");
const Blog = require("../model/blog.model");

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const ymd = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const groupByDay = (docs, days) => {
  const map = Object.fromEntries(days.map((d) => [ymd(d), 0]));
  for (const doc of docs) {
    const key = ymd(new Date(doc.createdAt));
    if (key in map) map[key]++;
  }
  return days.map((d) => map[ymd(d)] || 0);
};

exports.getStats = async () => {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  const weekAgo = addDays(today, -6); // last 7 days inclusive
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekAgo, i));

  const [
    totalAppointments,
    totalConsultations,
    totalContacts,
    totalGallery,
    totalBlogs,

    todayAppointments,
    todayConsultations,
    todayContacts,

    appointmentStatusAgg,
    blogStatusAgg,
    galleryCategoryAgg,

    recentAppointments,
    recentConsultations,
    recentContacts,
    recentBlogs,

    weekAppointments,
    weekConsultations,
    weekContacts,
  ] = await Promise.all([
    Appointment.countDocuments({}),
    Consultation.countDocuments({}),
    Contact.countDocuments({}),
    Gallery.countDocuments({}),
    Blog.countDocuments({}),

    Appointment.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    Consultation.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
    Contact.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),

    Appointment.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Blog.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Gallery.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),

    Appointment.find().sort({ createdAt: -1 }).limit(5).lean(),
    Consultation.find().sort({ createdAt: -1 }).limit(5).lean(),
    Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
    Blog.find().sort({ createdAt: -1 }).limit(5).lean(),

    Appointment.find({ createdAt: { $gte: weekAgo } })
      .select("createdAt")
      .lean(),
    Consultation.find({ createdAt: { $gte: weekAgo } })
      .select("createdAt")
      .lean(),
    Contact.find({ createdAt: { $gte: weekAgo } })
      .select("createdAt")
      .lean(),
  ]);

  const statusMap = (rows) =>
    rows.reduce((acc, r) => {
      acc[r._id || "Unknown"] = r.count;
      return acc;
    }, {});

  const apptStatus = statusMap(appointmentStatusAgg);
  const blogStatus = statusMap(blogStatusAgg);
  const galleryByCategory = statusMap(galleryCategoryAgg);

  return {
    totals: {
      appointments: totalAppointments,
      consultations: totalConsultations,
      contacts: totalContacts,
      gallery: totalGallery,
      blogs: totalBlogs,
    },
    today: {
      appointments: todayAppointments,
      consultations: todayConsultations,
      contacts: todayContacts,
    },
    appointmentStatus: {
      Pending: apptStatus.Pending || 0,
      Confirmed: apptStatus.Confirmed || 0,
      Completed: apptStatus.Completed || 0,
      Cancelled: apptStatus.Cancelled || 0,
    },
    blogStatus: {
      draft: blogStatus.draft || 0,
      published: blogStatus.published || 0,
    },
    galleryByCategory: {
      clinic: galleryByCategory.clinic || 0,
      treatment: galleryByCategory.treatment || 0,
      beforeafter: galleryByCategory.beforeafter || 0,
      team: galleryByCategory.team || 0,
    },
    timeline: {
      labels: days.map(ymd),
      appointments: groupByDay(weekAppointments, days),
      consultations: groupByDay(weekConsultations, days),
      contacts: groupByDay(weekContacts, days),
    },
    recent: {
      appointments: recentAppointments,
      consultations: recentConsultations,
      contacts: recentContacts,
      blogs: recentBlogs,
    },
  };
};
