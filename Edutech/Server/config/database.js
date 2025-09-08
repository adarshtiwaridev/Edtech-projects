// database.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URL (from .env file) with sensible local fallback
const MONGO_URI =
  (process.env.MONGO_URI && process.env.MONGO_URI.trim()) ||
  "mongodb://127.0.0.1:27017/edutech";

// Function to connect MongoDB
const connectDB = async () => {
  try {
    if (!MONGO_URI || typeof MONGO_URI !== "string" || MONGO_URI.trim().length === 0) {
      console.error("❌ Mongo connection string is invalid.");
      throw new Error("Invalid Mongo connection string");
    }

    // Optional: quiet mongoose strictQuery deprecation warnings
    mongoose.set("strictQuery", true);

    await mongoose.connect(MONGO_URI);

    const { host, port, name } = mongoose.connection;
    console.log(`✅ MongoDB connected successfully → ${host}:${port}/${name}`);

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB runtime connection error:", err?.message || err);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected. Retrying might be necessary.");
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
