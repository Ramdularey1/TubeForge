import { google } from "googleapis";
import { oauth2Client } from "../config/googleOauth.js";
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