import { google } from "googleapis";
import {oauth2Client} from "../server.js"
import { User } from "../models/user.model.js";

// ================= VIDEO ANALYTICS =================
export const getVideoAnalytics = async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({
        message: "Video ID required",
      });
    }

    // ✅ logged in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Google OAuth
    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    });

    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: oauth2Client,
    });

    // ===============================
    // VIDEO ANALYTICS QUERY
    // ===============================
    const analyticsResponse =
      await youtubeAnalytics.reports.query({
        ids: "channel==MINE",
        startDate: "2026-01-01",
        endDate: new Date().toISOString().split("T")[0],
        metrics:
          "views,estimatedMinutesWatched,averageViewDuration,likes,comments,subscribersGained",
        filters: `video==${videoId}`,
      });

    // ✅ Convert YouTube table → object
    const headers =
      analyticsResponse.data.columnHeaders.map(h => h.name);

    const values =
      analyticsResponse.data.rows?.[0] || [];

    const formattedAnalytics = {};

    headers.forEach((key, index) => {
      formattedAnalytics[key] = values[index] || 0;
    });

    // ✅ Clean API response
    return res.json({
      message: "Video analytics fetched ✅",
      videoId,
      analytics: formattedAnalytics,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch video analytics",
      error: error.message,
    }); 
  }
};

export const getChannelAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    });

    const youtubeAnalytics = google.youtubeAnalytics({
      version: "v2",
      auth: oauth2Client,
    });

    const today = new Date().toISOString().split("T")[0];

    // 🔥 TOTAL ANALYTICS
    const totalRes = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate: "2026-01-01",
      endDate: today,
      metrics:
        "views,estimatedMinutesWatched,averageViewDuration,likes,comments,subscribersGained",
    });

    const headers = totalRes.data.columnHeaders.map(h => h.name);
    const values = totalRes.data.rows?.[0] || [];

    const analytics = {};
    headers.forEach((key, index) => {
      analytics[key] = values[index] || 0;
    });

    // 🔥 TIMELINE DATA (FOR CHART)
    const timelineRes = await youtubeAnalytics.reports.query({
      ids: "channel==MINE",
      startDate: "2026-01-01",
      endDate: today,
      metrics: "views,subscribersGained",
      dimensions: "day",
    });

    const rows = timelineRes.data.rows || [];

    const timeline = rows.map((row) => ({
      date: row[0],
      views: row[1],
      subs: row[2],
    }));

    return res.json({
      message: "Channel analytics fetched ✅",
      analytics,
      timeline,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};