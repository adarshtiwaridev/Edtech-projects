const { Server } = require("socket.io");

let io = null;
const userSocketMap = new Map(); // userId -> Set of socket IDs

function initSocket(server, allowedOrigins) {
  io = new Server(server, {
    cors: {
      origin: function (origin, callback) {
        if (
          !origin ||
          process.env.NODE_ENV !== "production" ||
          allowedOrigins.includes(origin) ||
          /\.vercel\.app$/.test(origin)
        ) {
          return callback(null, true);
        }
        return callback(null, true);
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query?.userId;
    const role = socket.handshake.query?.role || "Student";

    if (userId) {
      socket.join(`user_${userId}`);
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, new Set());
      }
      userSocketMap.get(userId).add(socket.id);
    }

    if (role === "Admin") {
      socket.join("role_admin");
    } else if (role === "Student") {
      socket.join("role_student");
    }

    socket.on("disconnect", () => {
      if (userId && userSocketMap.has(userId)) {
        const userSockets = userSocketMap.get(userId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userSocketMap.delete(userId);
        }
      }
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    return null;
  }
  return io;
}

function emitToUser(userId, event, data) {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
}

function emitToRoom(room, event, data) {
  if (io) {
    io.to(room).emit(event, data);
  }
}

function broadcastEvent(event, data) {
  if (io) {
    io.emit(event, data);
  }
}

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToRoom,
  broadcastEvent,
};
