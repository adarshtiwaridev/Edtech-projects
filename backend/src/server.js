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

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} with Socket.IO enabled`);
    });
  } catch (error) {
    console.error("❌ Failed to connect DB:", error);
    process.exit(1);
  }
};

startServer();

