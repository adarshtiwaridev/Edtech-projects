// database.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URL (from .env file)
const MONGO_URI = process.env.MONGO_URI;

// Function to connect MongoDB
const connectDB = async () => {
  try {
    if (!MONGO_URI || typeof MONGO_URI !== "string" || MONGO_URI.trim().length === 0) {
      console.error("❌ MONGO_URI is missing. Add MONGO_URI to your .env file.");
      throw new Error("Missing MONGO_URI env var");
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
