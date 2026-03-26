import API from "./axios";

export const getDashboard = async () => {
  const res = await API.get("/youtube/dashboard");
  return res.data;
};


export const getVideoAnalytics = async (videoId) => {
  const res = await API.get(
    `/youtube/analytics/${videoId}`
  );
  return res.data;
};