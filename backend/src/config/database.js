const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.error("❌ MONGO_URI is missing from environment variables.");
      process.exit(1);
    }

    mongoose.set("strictQuery", true);

    const options = {
      serverSelectionTimeoutMS: 5000,
    };

    console.log("⏳ Attempting to connect to MongoDB...");
    await mongoose.connect(MONGO_URI, options);

    const { host, name } = mongoose.connection;
    console.log(`✅ MongoDB connected successfully!`);
    console.log(`📡 Host: ${host}`);
    console.log(`📂 Database: ${name}`);

  } catch (error) {
    console.error("❌ MongoDB connection failed!");
    console.error(`Reason: ${error.message}`);
    
    if (error.message.includes("ECONNREFUSED")) {
      console.error("💡 TIP: This is a DNS issue. Verify your IP is whitelisted in Atlas (0.0.0.0/0).");
    }
    
    process.exit(1); 
  }
};

module.exports = connectDB;
