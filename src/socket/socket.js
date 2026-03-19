import { io } from "socket.io-client";

/* =========================
   SOCKET URL CONFIG (VITE SAFE)
========================= */

// Vite uses import.meta.env
const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5080"
    : "https://artarena-backend.onrender.com");

if (!SOCKET_URL) {
  console.error("❌ VITE_SOCKET_URL is not defined.");
}

/* =========================
   SINGLETON SOCKET
========================= */

let socket = null;

/**
 * ✅ Singleton Socket.IO Client
 * - Lazy initialized
 * - Shared across entire app
 * - StrictMode safe
 */
export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"], // Important for Render
      autoConnect: false,
      withCredentials: true,

      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    /* =========================
       DEBUG LOGS
    ========================== */
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });
  }

  return socket;
}