const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const os = require("os");

const cloudconnect = require("./config/cloudinary");
const { errorHandler } = require("./middleware/errorHandler");
const { auth } = require("./middleware/Auth");
const authorizeQuizManagement = require("./middleware/authorizeQuizManagement");
const { createQuiz, uploadAndExtractPdfQuiz } = require("./controllers/QuizController");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payment");
const adminRoutes = require("./routes/Admin");
const studentRoutes = require("./routes/Student");
const studentEnhancedRoutes = require("./routes/StudentEnhanced");
const quizRoutes = require("./routes/QuizRoutes");

const app = express();

// Disable ETags to ensure fresh API responses instead of 304 Not Modified
app.set("etag", false);

// Prevent browser/client caching for REST API endpoints
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

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
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
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
    tempFileDir: os.tmpdir(),
  })
);

// Connect Cloudinary
cloudconnect();

// Direct Route Aliases for Quiz Creation & Extraction to prevent 404
app.post("/api/v1/quiz/createQuiz", auth, authorizeQuizManagement, createQuiz);
app.post("/api/v1/quiz/create", auth, authorizeQuizManagement, createQuiz);
app.post("/api/quiz/createQuiz", auth, authorizeQuizManagement, createQuiz);
app.post("/api/quiz/create", auth, authorizeQuizManagement, createQuiz);
app.post("/v1/quiz/createQuiz", auth, authorizeQuizManagement, createQuiz);
app.post("/v1/quiz/create", auth, authorizeQuizManagement, createQuiz);

app.post("/api/v1/quiz/pdf-extract", auth, authorizeQuizManagement, uploadAndExtractPdfQuiz);
app.post("/api/quiz/pdf-extract", auth, authorizeQuizManagement, uploadAndExtractPdfQuiz);

// API Router Modules
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/enhanced", studentEnhancedRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/v1/quiz", quizRoutes);
app.use("/quiz", quizRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "success", message: "✅ JP EdTech Backend API is running" });
});

// 404 Fallback for unhandled API routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
