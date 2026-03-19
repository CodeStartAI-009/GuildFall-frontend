import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5080",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("guildfall_token");

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const guestLogin = (guestId) => {
  const referralCode = sessionStorage.getItem("referralCode");

  return API.post(
    "/auth/guest",
    referralCode ? { referralCode } : {},
    {
      headers: guestId ? { "x-guest-id": guestId } : {},
    }
  );
};

export const emailSignup = (data, guestId) =>
  API.post("/auth/email", data, {
    headers: guestId ? { "x-guest-id": guestId } : {},
  });

export const getMe = () => API.get("/auth/me");

export default API;