const express = require("express");
const path = require("path");
const connectDB = require("./config/database");
const dotenv = require("dotenv");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudconnect = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

// Load env variables
dotenv.config();

// Init app
const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cloudinary
cloudconnect();

/* ===================== API ROUTES ===================== */
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/courses", courseRoutes);

/* ===================== FRONTEND (VITE BUILD) ===================== */
const rootDir = path.resolve(__dirname, ".."); // points to Edutech/

// Serve static frontend
app.use(express.static(path.join(rootDir, "dist")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(rootDir, "dist", "index.html"));
});

/* ===================== START SERVER ===================== */
(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server not started due to DB error:", err);
    process.exit(1);
  }
})();
