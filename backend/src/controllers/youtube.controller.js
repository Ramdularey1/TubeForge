import { google } from "googleapis";
import fs from "fs";
import { oauth2Client } from "../config/googleOauth.js";
import { User } from "../models/user.model.js";

export const uploadVideo = async (req, res) => {
  try {
    console.log("YouTube Upload API HIT ✅");

    // ✅ Check multer file
    if (!req.file) {
      return res.status(400).json({
        message: "No video file uploaded",
      });
    }

    // ✅ TEMP: get user (later from JWT middleware)
    const user = await User.findOne();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ IMPORTANT: use ONLY refresh token
    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    });

    // ✅ Auto-save new access token when refreshed
    oauth2Client.on("tokens", async (tokens) => {
      if (tokens.access_token) {
        user.accessToken = tokens.access_token;
        await user.save();
        console.log("Access token refreshed ✅");
      }
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // ✅ Upload video
    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: {
        snippet: {
          title: "TubeForge Test Upload 🚀",
          description: "Uploaded using TubeForge API",
          tags: ["tubeforge", "api"],
          categoryId: "22",
        },
        status: {
          privacyStatus: "private",
        },
      },
      media: {
        body: fs.createReadStream(req.file.path),
      },
    });

    // ✅ Delete uploaded file safely
    fs.unlink(req.file.path, (err) => {
      if (err) console.log("File delete error:", err);
      else console.log("Local file deleted ✅");
    });

    return res.json({
      message: "Video uploaded successfully 🚀",
      videoId: response.data.id,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    // delete file if upload fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};