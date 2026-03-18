// import { google } from "googleapis";
// import fs from "fs";
// import { oauth2Client } from "../config/googleOauth.js";
// import { User } from "../models/user.model.js";

// export const uploadVideo = async (req, res) => {
//   try {
//     console.log("YouTube Upload API HIT ✅");

//     // ✅ Check multer file
//     if (!req.file) {
//       return res.status(400).json({
//         message: "No video file uploaded",
//       });
//     }

//     // ✅ TEMP: get user (later from JWT middleware)
//     const user = await User.findOne();

//     if (!user) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }

//     // ✅ IMPORTANT: use ONLY refresh token
//     oauth2Client.setCredentials({
//       refresh_token: user.refreshToken,
//     });

//     // ✅ Auto-save new access token when refreshed
//     oauth2Client.on("tokens", async (tokens) => {
//       if (tokens.access_token) {
//         user.accessToken = tokens.access_token;
//         await user.save();
//         console.log("Access token refreshed ✅");
//       }
//     });

//     const youtube = google.youtube({
//       version: "v3",
//       auth: oauth2Client,
//     });

//     // ✅ Upload video
//     const response = await youtube.videos.insert({
//       part: "snippet,status",
//       requestBody: {
//         snippet: {
//           title: "TubeForge Test Upload 🚀",
//           description: "Uploaded using TubeForge API",
//           tags: ["tubeforge", "api"],
//           categoryId: "22",
//         },
//         status: {
//           privacyStatus: "private",
//         },
//       },
//       media: {
//         body: fs.createReadStream(req.file.path),
//       },
//     });

//     // ✅ Delete uploaded file safely
//     fs.unlink(req.file.path, (err) => {
//       if (err) console.log("File delete error:", err);
//       else console.log("Local file deleted ✅");
//     });

//     return res.json({
//       message: "Video uploaded successfully 🚀",
//       videoId: response.data.id,
//     });

//   } catch (error) {
//     console.error("UPLOAD ERROR:", error);

//     // delete file if upload fails
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }

//     return res.status(500).json({
//       message: "Upload failed",
//       error: error.message,
//     });
//   }
// };



import { google } from "googleapis";
import fs from "fs";
import sharp from "sharp";
import { oauth2Client } from "../config/googleOauth.js";
import { User } from "../models/user.model.js";

export const uploadVideo = async (req, res) => {
  let videoPath = null;
  let thumbnailPath = null;
  let compressedThumbnailPath = null;

  try {
    console.log("🚀 Resumable Upload Started");

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({
        message: "Video file required",
      });
    }

    videoPath = videoFile.path;
    thumbnailPath = thumbnailFile?.path;

    // ======================
    // ✅ USER FROM JWT
    // ======================
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ======================
    // ✅ GOOGLE AUTH
    // ======================
    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    });

    oauth2Client.removeAllListeners("tokens");

    oauth2Client.on("tokens", async (tokens) => {
      if (tokens.access_token) {
        user.accessToken = tokens.access_token;
        await user.save();
        console.log("✅ Access token refreshed");
      }
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // ======================
    // ✅ DYNAMIC BODY DATA
    // ======================
    const {
      title = "TubeForge Upload 🚀",
      description = "Uploaded via TubeForge",
      privacyStatus = "private",
      tags,
      categoryId = "22",
    } = req.body;

    const tagArray = tags ? tags.split(",") : ["tubeforge"];

    // ======================
    // ✅ RESUMABLE UPLOAD
    // ======================
    const fileSize = fs.statSync(videoPath).size;

    const response = await youtube.videos.insert(
      {
        part: "snippet,status",
        requestBody: {
          snippet: {
            title,
            description,
            tags: tagArray,
            categoryId,
          },
          status: {
            privacyStatus,
          },
        },
        media: {
          body: fs.createReadStream(videoPath),
        },
      },
      {
        // ⭐ THIS ENABLES RESUMABLE + PROGRESS
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          console.log(
            `📤 Upload Progress: ${Math.round(progress)}%`
          );
        },
      }
    );

    const videoId = response.data.id;
    console.log("✅ Video Uploaded:", videoId);

    // ======================
    // ✅ THUMBNAIL
    // ======================
    if (thumbnailPath) {
      compressedThumbnailPath = `uploads/compressed-${Date.now()}.jpg`;

      await sharp(thumbnailPath)
        .resize(1280, 720, { fit: "inside" })
        .jpeg({ quality: 80 })
        .toFile(compressedThumbnailPath);

      await youtube.thumbnails.set({
        videoId,
        media: {
          body: fs.createReadStream(compressedThumbnailPath),
        },
      });

      console.log("✅ Thumbnail Uploaded");
    }

    // ======================
    // ✅ CLEANUP
    // ======================
    [videoPath, thumbnailPath, compressedThumbnailPath].forEach(
      (file) => {
        if (file && fs.existsSync(file)) fs.unlinkSync(file);
      }
    );

    return res.json({
      message: "Resumable upload completed 🚀",
      videoId,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    [videoPath, thumbnailPath, compressedThumbnailPath].forEach(
      (file) => {
        if (file && fs.existsSync(file)) fs.unlinkSync(file);
      }
    );

    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};



// ======================
// ✅ YOUTUBE DASHBOARD
// ======================
export const getDashboard = async (req, res) => {
  try {
    console.log("YouTube Dashboard API HIT ✅");

    // logged-in user from JWT middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ======================
    // GOOGLE AUTH
    // ======================
    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // ======================
    // ✅ CHANNEL INFO
    // ======================
    const channelResponse = await youtube.channels.list({
      part: "snippet,statistics,contentDetails",
      mine: true,
    });

    const channel = channelResponse.data.items[0];

    // ======================
    // ✅ GET UPLOAD PLAYLIST
    // ======================
    const uploadsPlaylistId =
      channel.contentDetails.relatedPlaylists.uploads;

    // ======================
    // ✅ GET VIDEOS LIST
    // ======================
    const videosResponse = await youtube.playlistItems.list({
      part: "snippet,contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: 10,
    });

    const videos = videosResponse.data.items;

    // ======================
    // RESPONSE
    // ======================
    return res.json({
      message: "Dashboard data fetched ✅",
      channel: {
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscribers: channel.statistics.subscriberCount,
        views: channel.statistics.viewCount,
        totalVideos: channel.statistics.videoCount,
        thumbnail: channel.snippet.thumbnails.default.url,
      },
      videos,
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
};

// ================= GET CHANNEL VIDEOS =================
export const getChannelVideos = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    oauth2Client.setCredentials({
      refresh_token: user.refreshToken,
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // get uploads playlist
    const channel = await youtube.channels.list({
      part: "contentDetails",
      mine: true,
    });

    const uploadsPlaylistId =
      channel.data.items[0].contentDetails
        .relatedPlaylists.uploads;

    // fetch videos
    const videos = await youtube.playlistItems.list({
      part: "snippet,contentDetails",
      playlistId: uploadsPlaylistId,
      maxResults: 10,
    });

    res.json({
      message: "Channel videos fetched ✅",
      videos: videos.data.items,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch videos",
      error: error.message,
    });
  }
};