const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const googleReviewRoutes = require("./routes/googlereview.routes");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/appointments", require("./routes/appointment.routes"));
app.use("/api/consultations", require("./routes/consultation.routes"));
app.use("/api/contacts", require("./routes/contact.routes"));
app.use("/api/gallery", require("./routes/gallery.routes"));
app.use("/api/blogs", require("./routes/blog.routes"));
app.use("/api/dashboard", require("./routes/dashboard.routes"));
app.use("/api/googleReviews", googleReviewRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
