import axios from "axios";

const API = axios.create({
  baseURL: "https://tubeforge-lhg4.onrender.com",
  withCredentials: true,
});

export default API;


export const getChannelAnalytics = async () => {
  const res = await axios.get(
    "https://tubeforge-lhg4.onrender.com/youtube/channel-analytics",
    { withCredentials: true }
  );

  return res.data;
};