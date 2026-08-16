import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../constants/endpoints";

export function useSocket(userId, role, onStreakUpdate, onNotification) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Remove endpoint protocol prefix to get base URL
    const socketServerUrl = API_URL.replace(/\/api\/v1|\/api/g, "");

    const socket = io(socketServerUrl, {
      query: { userId, role },
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("⚡ Real-time Socket connected:", socket.id);
    });

    if (onStreakUpdate) {
      socket.on("streak_updated", (data) => {
        onStreakUpdate(data);
      });
    }

    if (onNotification) {
      socket.on("notification", (notif) => {
        onNotification(notif);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [userId, role]);

  return socketRef.current;
}

export default useSocket;
