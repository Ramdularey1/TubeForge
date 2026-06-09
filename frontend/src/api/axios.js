import axios from "axios";

const API = axios.create({
  baseURL: "https://tubeforge-lhg4.onrender.com",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  if (localStorage.getItem("tubeforge_guest") === "true") {
    config.headers["X-Guest-Mode"] = "true";

    const guestEmail = localStorage.getItem("tubeforge_guest_email");
    if (guestEmail) {
      config.headers["X-Guest-Email"] = guestEmail;
    }
  }

  return config;
});

export default API;


export const getChannelAnalytics = async () => {
  const res = await API.get("/youtube/channel-analytics");

  return res.data;
};
