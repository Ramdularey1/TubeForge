import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

export default API;


export const getChannelAnalytics = async () => {
  const res = await axios.get(
    "http://localhost:8000/youtube/channel-analytics",
    { withCredentials: true }
  );

  return res.data;
};