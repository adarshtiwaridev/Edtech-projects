const express = require("express");
const connectDB = require("./config/database");
const dotenv = require("dotenv");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const adminRoutes = require("./routes/Admin");



const cookieParser = require("cookie-parser");
const cors = require("cors");
const cloudconnect = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const { errorHandler } = require("./middleware/errorHandler");

/* ===================== LOAD ENV ===================== */
dotenv.config();

/* ===================== INIT APP ===================== */
const app = express();

/* ===================== MIDDLEWARE ===================== */
// Security middlewares
app.use(helmet());
app.use(mongoSanitize());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===================== CORS (IMPORTANT) ===================== */
app.use(
  cors({
    origin: [
      "http://localhost:5173",              // local Vite
      "http://localhost:5000",              // local dev
      //  "https://edtech-projects.vercel.app"  // Vercel frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* ===================== FILE UPLOAD ===================== */
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

/* ===================== CLOUDINARY ===================== */
cloudconnect();

/* ===================== API ROUTES ===================== */
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);


/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render");
});

/* ===================== GLOBAL ERROR HANDLER ===================== */
app.use(errorHandler);

/* ===================== START SERVER ===================== */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect DB:", error);
    process.exit(1);
  }
};

startServer();
