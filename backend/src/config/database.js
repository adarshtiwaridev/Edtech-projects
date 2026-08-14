const mongoose = require("mongoose");
const dns = require("dns");

// Set public DNS servers ONLY on Windows local networks if DNS resolution issues occur
if (process.platform === "win32" && !process.env.RENDER && process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (err) {
    console.warn("⚠️ Custom DNS setup skipped:", err.message);
  }
}

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL;

  if (!MONGO_URI || !MONGO_URI.trim()) {
    console.error("❌ ERROR: MONGO_URI (or MONGODB_URL) is missing from environment variables.");
    console.error("💡 TIP: Make sure MONGO_URI is set in your .env file or Render Environment Variables.");
    process.exit(1);
  }

  try {
    mongoose.set("strictQuery", true);

    const options = {
      serverSelectionTimeoutMS: 5000,
    };

    console.log("⏳ Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI.trim(), options);

    const { host, name } = mongoose.connection;
    console.log(`✅ MongoDB connected successfully!`);
    console.log(`📡 Host: ${host}`);
    console.log(`📂 Database: ${name}`);

  } catch (error) {
    console.error("❌ MongoDB connection failed!");
    console.error(`Reason: ${error.message}`);
    
    if (error.name === "MongoServerError" && error.code === 18) {
      console.error("💡 BAD AUTH TIP: Authentication failed. Verify your database username and password.");
      console.error("   If your password contains special characters like '@', '#', or '$', you MUST URL-encode them (e.g. '@' -> '%40', '#' -> '%23').");
    } else if (error.message.includes("ECONNREFUSED") || error.message.includes("ENOTFOUND")) {
      console.error("💡 NETWORK TIP: Verify your connection string and ensure IP 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.");
    }
    
    process.exit(1); 
  }
};

module.exports = connectDB;
