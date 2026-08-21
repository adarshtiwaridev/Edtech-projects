const dotenv = require("dotenv");
dotenv.config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/database");
const { initSocket } = require("./sockets/socket");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    const allowedOrigins = app.get("allowedOrigins") || [];
    initSocket(server, allowedOrigins);

    const mongoose = require("mongoose");

    const gracefulShutdown = (signal) => {
      console.log(`\n⚠️ Received ${signal}. Starting graceful shutdown...`);
      server.close(async () => {
        console.log("🔒 HTTP server closed.");
        try {
          await mongoose.connection.close(false);
          console.log("📂 MongoDB connection closed cleanly.");
          process.exit(0);
        } catch (err) {
          console.error("❌ Error closing MongoDB connection:", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

    server.listen(PORT, () => {
      console.log(`🚀 Kodemates EdTech Server running on port ${PORT} with Socket.IO enabled`);
    });
  } catch (error) {
    console.error("❌ Failed to connect DB:", error);
    process.exit(1);
  }
};

startServer();
