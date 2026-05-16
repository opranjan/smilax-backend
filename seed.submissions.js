/**
 * Seed sample consultation and contact submissions.
 *
 * Run from `dental backend` folder:
 *   node seed.submissions.js
 *
 * Always inserts the sample data (running twice will duplicate).
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const Consultation = require("./model/consultation.model");
const Contact = require("./model/contact.model");

const consultations = [
  {
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    message:
      "Hi, I'm looking for a consultation for teeth whitening. What is the cost and how long does the procedure take?",
  },
  {
    name: "Priya Patel",
    phone: "9123456780",
    email: "priya.patel@example.com",
    message:
      "I have crooked teeth and want to know about braces / Invisalign options. Could you please call me to discuss?",
  },
  {
    name: "Amit Verma",
    phone: "9000111222",
    email: "amit.verma@example.com",
    message:
      "My 7-year-old daughter has a cavity. Looking for a pediatric dentist near our area.",
  },
  {
    name: "Sneha Iyer",
    phone: "9988776655",
    email: "sneha.iyer@example.com",
    message:
      "Need a consultation for RCT (root canal). I've been having severe tooth pain for a week.",
  },
  {
    name: "Vikram Singh",
    phone: "9001234567",
    email: "",
    message:
      "Interested in dental implants. Please share an appointment slot this weekend.",
  },
  {
    name: "Anjali Mehta",
    phone: "9876512345",
    email: "anjali.m@example.com",
    message:
      "Looking for cosmetic dentistry / veneers. Want to discuss before booking an appointment.",
  },
];

const contacts = [
  {
    name: "Karan Joshi",
    email: "karan.joshi@example.com",
    subject: "Appointment timing confusion",
    message:
      "Hi team, I booked an appointment for tomorrow at 11 AM but didn't get a confirmation SMS. Could you please confirm?",
  },
  {
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    subject: "Feedback after visit",
    message:
      "Thank you Dr. and the whole team — the cleaning experience was very smooth and professional. Highly recommended!",
  },
  {
    name: "Suresh Kumar",
    email: "suresh.k@example.com",
    subject: "Insurance inquiry",
    message:
      "Do you accept cashless dental insurance? Which providers are tied up with your clinic?",
  },
  {
    name: "Divya Nair",
    email: "divya.nair@example.com",
    subject: "Clinic location and parking",
    message:
      "Is there parking available at your clinic? Also, what is the easiest way to reach by public transport?",
  },
  {
    name: "Rohit Khanna",
    email: "rohit.khanna@example.com",
    subject: "Pricing for full mouth cleaning",
    message:
      "Could you share the pricing for full mouth scaling and polishing? Also, do you offer any family packages?",
  },
  {
    name: "Megha Bansal",
    email: "megha.bansal@example.com",
    subject: "Partnership inquiry",
    message:
      "We are a corporate wellness company looking to tie up for employee dental check-up camps. Please share contact details.",
  },
];

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI missing in .env");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected");

    const c1 = await Consultation.insertMany(consultations);
    const c2 = await Contact.insertMany(contacts);

    console.log(`Inserted ${c1.length} consultations, ${c2.length} contacts.`);
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
})();
