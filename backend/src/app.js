const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const cloudconnect = require("./config/cloudinary");
const { errorHandler } = require("./middleware/errorHandler");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const adminRoutes = require("./routes/Admin");

const app = express();

// Security middlewares
app.use(helmet());
app.use(mongoSanitize());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",

  // Production Frontend
  "https://kodemates-frontend.vercel.app",

  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);


app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        process.env.NODE_ENV !== "production" ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// File upload configuration
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Connect Cloudinary
cloudconnect();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "success", message: "✅ JP EdTech Backend API is running" });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
