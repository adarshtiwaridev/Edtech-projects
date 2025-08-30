const express = require("express");
const connectDB = require("./config/database"); // Import DB file
const dotenv = require("dotenv");
const userRoutes = require("./routes/User"); // Import user routes
const profileRoutes = require("./routes/Profile"); // Import profile routes
// const paymentRoutes = require("./routes/Payment"); // Import payment routes
const courseRoutes = require("./routes/Course"); // Import course routes
const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudconnect = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

// Load env
dotenv.config();

// Init express
const app = express();

// Connect Database then start server
(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("Server not started due to DB error:", err?.message || err);
    process.exit(1);
  }
})();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cloudinary setup
cloudconnect();

// Define Routes
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
// app.use("/api/payments", paymentRoutes);
app.use("/api/Courses", courseRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running correctlt " });
});

// Activate the server (moved to after DB connects)
