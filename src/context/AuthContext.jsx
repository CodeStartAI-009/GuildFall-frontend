import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSocket } from "../socket/socket";
import { guestLogin, getMe } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const socket = getSocket();

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const authSentRef = useRef(false);

  /* =================================================
     LOAD OR CREATE USER
  ================================================= */
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("guildfall_token");
      const guestId = localStorage.getItem("guildfall_guest_id");

      // 🔐 Existing token → validate
      if (token && token !== "undefined") {
        try {
          const res = await getMe();
          setUser(res.data.user);
          return;
        } catch {
          localStorage.removeItem("guildfall_token");
          localStorage.removeItem("guildfall_guest_id");
        }
      }

      // 👤 No valid token → create / reuse guest
      try {
        const res = await guestLogin(guestId);
        const { user, token: newToken } = res.data;

        setUser(user);

        localStorage.setItem("guildfall_token", newToken);
        localStorage.setItem("guildfall_guest_id", user._id);
      } catch (err) {
        console.error("Guest login failed:", err);
      }
    };

    init();
  }, []);

  /* =================================================
     SOCKET AUTH
  ================================================= */
  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    if (authSentRef.current) return;
    authSentRef.current = true;

    socket.emit("AUTH", { userId: user._id });

    socket.once("AUTH_SUCCESS", () => {
      setAuthReady(true);
    });

    socket.on("disconnect", () => {
      authSentRef.current = false;
      setAuthReady(false);
    });

    return () => {
      socket.off("AUTH_SUCCESS");
      socket.off("disconnect");
    };
  }, [user?._id, socket]);

  return (
    <AuthContext.Provider value={{ user, setUser, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};