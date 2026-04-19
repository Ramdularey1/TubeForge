
import { google } from "googleapis";
import fs from "fs";
import sharp from "sharp";
import {oauth2Client} from "../server.js"
import { User } from "../models/user.model.js";
import { Thumbnail } from "../models/Thumbnail.model.js";
import { Video } from "../models/Video.model.js";
import ffmpeg from "fluent-ffmpeg";
import { v4 as uuidv4 } from "uuid";
import ffprobePath from "ffprobe-static";
import ffmpegPath from "ffmpeg-static";
import path from "path";





// ======================
// ✅ YOUTUBE DASHBOARD
// ======================




export const uploadVideo = async (req, res) => {
  let videoPath = null;
  let thumbnailPath = null;
  let compressedThumbnailPath = null;

  try {
    console.log("🚀 Upload Started");

    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    // ======================
    // ✅ HANDLE VIDEO (FILE OR DB)
    // ======================
    if (videoFile) {
      videoPath = videoFile.path;
    } else if (req.body.videoPath) {
      videoPath = path.join(process.cwd(), req.body.videoPath);
    } else {
      return res.status(400).json({
        message: "Video file or videoPath required",
      });
    }

    // ======================
    // ✅ HANDLE THUMBNAIL
    // ======================
    if (thumbnailFile) {
      thumbnailPath = thumbnailFile.path;
    } else if (req.body.thumbnailPath) {
      thumbnailPath = path.join(process.cwd(), req.body.thumbnailPath);
    }

    // ======================
    // ✅ USER
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

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const {
      title = "TubeForge Upload 🚀",
      description = "Uploaded via TubeForge",
      privacyStatus = "public", // 🔥 set public for testing
      tags,
      categoryId = "22",
    } = req.body;

    const tagArray = tags ? tags.split(",") : ["tubeforge"];

    // ======================
    // ✅ UPLOAD TO YOUTUBE
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
          body: fs.createReadStream(videoPath), // 🔥 works for both cases
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          console.log(`📤 Upload: ${Math.round(progress)}%`);
        },
      }
    );

    const videoId = response.data.id;
    console.log("✅ Video Uploaded:", videoId);

    // ======================
    // ✅ THUMBNAIL UPLOAD
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
    // ✅ CLEANUP ONLY TEMP FILES
    // ======================
    if (videoFile) {
      if (videoPath && fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }

    if (thumbnailFile) {
      if (thumbnailPath && fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);
    }

    if (compressedThumbnailPath && fs.existsSync(compressedThumbnailPath)) {
      fs.unlinkSync(compressedThumbnailPath);
    }

    return res.json({
      message: "Upload completed 🚀",
      videoId,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};



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

export const saveThumbnail = async (req, res) => {
  try {

    const { title, imageUrl } = req.body;

    // ❌ no generateThumbnail here

    const savedThumbnail = await Thumbnail.create({
      user: req.user._id,
      title,
      imageUrl, // already "/uploads/abc.png"
    });

    res.json({
      message: "Thumbnail Saved ✅",
      thumbnailId: savedThumbnail._id,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Save failed",
    });

  }
};

export const getThumbnail = async (req, res) => {
  try {

      const thumbnails =
        await Thumbnail.find({
          user: req.user._id,
        }).sort({ createdAt: -1 });

      res.json(thumbnails);

    } catch (error) {

      res.status(500).json({
        message: "Failed to fetch thumbnails",
      });

    }
}

// export const saveVideo = async (req, res) => {
//   try {

//     console.log("🔥 SAVE VIDEO HIT");

//     // ✅ Check file exists
//     if (!req.file) {
//       return res.status(400).json({
//         message: "No video file uploaded",
//       });
//     }

//     const { title, description, thumbnailPath } = req.body;

//     // ✅ Save video path
//     const videoPath = `/uploads/${req.file.filename}`;

//     // ✅ Thumbnail (from frontend)
//     const finalThumbnail = thumbnailPath || "";

//     // 🔥 SAVE IN DB
//     const video = await Video.create({
//       user: req.user._id,
//       title,
//       description,
//       videoUrl: videoPath,
//       thumbnailUrl: finalThumbnail,
//     });

//     res.json({
//       message: "Video saved successfully ✅",
//       video,
//     });

//   } catch (error) {

//     console.log("❌ ERROR:", error);

//     res.status(500).json({
//       message: "Upload failed",
//     });
//   }
// };

export const saveVideo = async (req, res) => {
  try {
    console.log("🔥 SAVE VIDEO HIT");

    const { title, description, thumbnailPath, videoPath } = req.body;

    let finalVideoPath = "";

    // ======================
    // ✅ CASE 1: FILE UPLOAD
    // ======================
    if (req.file) {
      finalVideoPath = `/uploads/${req.file.filename}`;
    }

    // ======================
    // ✅ CASE 2: EDITED VIDEO
    // ======================
    else if (videoPath) {
      finalVideoPath = videoPath; // already in uploads
    }

    else {
      return res.status(400).json({
        message: "No video provided",
      });
    }

    // ======================
    // ✅ THUMBNAIL
    // ======================
    const finalThumbnail = thumbnailPath || "";

    // ======================
    // 🔥 SAVE IN DB
    // ======================
    const video = await Video.create({
      user: req.user._id,
      title,
      description,
      videoUrl: finalVideoPath,
      thumbnailUrl: finalThumbnail,
    });

    res.json({
      message: "Video saved successfully ✅",
      video,
    });

  } catch (error) {
    console.log("❌ ERROR:", error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};



export const getVideo = async (req, res) => {
  try {

      const videos = await Video.find({
        user: req.user._id,
      }).sort({ createdAt: -1 });

      res.json(videos);

    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch videos",
      });
    }
}

// export const deleteThumbnail = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const thumbnail = await Thumbnail.findById(id);

//     if (!thumbnail) {
//       return res.status(404).json({
//         message: "Thumbnail not found",
//       });
//     }

//     // ✅ delete file from uploads
//     const filePath = thumbnail.imageUrl;

//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     await Thumbnail.findByIdAndDelete(id);

//     res.json({
//       message: "Thumbnail deleted ✅",
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Delete failed",
//     });
//   }
// };



export const deleteThumbnail = async (req, res) => {
  try {
    const { id } = req.params;

    const thumbnail = await Thumbnail.findById(id);

    if (!thumbnail) {
      return res.status(404).json({
        message: "Thumbnail not found",
      });
    }

    // ✅ Convert relative path → absolute path
    const filePath = path.join(
      process.cwd(),
      thumbnail.imageUrl
    );

    // ✅ Delete file from uploads
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("🗑 Thumbnail deleted:", filePath);
      } else {
        console.log("⚠️ File not found:", filePath);
      }
    } catch (err) {
      console.log("File delete error:", err.message);
    }

    // ✅ Delete from DB
    await Thumbnail.findByIdAndDelete(id);

    res.json({
      message: "Thumbnail deleted successfully ✅",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Delete failed",
    });
  }
};


export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({
        message: "Video not found",
      });
    }

    // ✅ delete video file
    const videoPath = path.join(process.cwd(), video.videoUrl);

    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // ✅ delete thumbnail file (optional)
    if (video.thumbnailUrl) {
      const thumbPath = path.join(process.cwd(), video.thumbnailUrl);

      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
      }
    }

    await Video.findByIdAndDelete(id);

    res.json({
      message: "Video deleted ✅",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Delete failed",
    });
  }
};


ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);
// export const editVideo = async (req, res) => {
//   let tempInputPath = null;

//   try {
//     let { start, end } = req.body;

//     start = Number(start);
//     end = Number(end);

//     if (isNaN(start) || isNaN(end) || end <= start) {
//       return res.status(400).json({
//         message: "Invalid trim range",
//       });
//     }

//     if (!req.user) {
//       return res.status(401).json({
//         message: "Unauthorized",
//       });
//     }

//     let inputPath;

//     // ✅ uploaded file
//     if (req.file) {
//       inputPath = req.file.path;
//       tempInputPath = req.file.path;
//     }

//     // ✅ DB video
//     else if (req.body.videoPath) {
//       inputPath = path.join(
//         process.cwd(),
//         req.body.videoPath.replace(/^\/+/, "")
//       );
//     }

//     else {
//       return res.status(400).json({
//         message: "Video required",
//       });
//     }

//     const uploadDir = path.join(process.cwd(), "uploads");

//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }

//     const outputFileName = `${uuidv4()}.mp4`;
//     const outputPath = path.join(uploadDir, outputFileName);

//     const duration = end - start;

//     ffmpeg(inputPath)
//       .setStartTime(start)
//       .setDuration(duration)
//       .output(outputPath)
//       .on("end", () => {
//         console.log("✅ Video trimmed");

//         // 🔥 ONLY RETURN PATH
//         res.json({
//           message: "Trim success",
//           videoPath: `/uploads/${outputFileName}`,
//         });

//         // cleanup temp upload
//         if (tempInputPath && fs.existsSync(tempInputPath)) {
//           fs.unlinkSync(tempInputPath);
//         }
//       })
//       .on("error", (err) => {
//         console.log("FFmpeg ERROR:", err);

//         res.status(500).json({
//           message: "Edit failed",
//           error: err.message,
//         });
//       })
//       .run();

//   } catch (error) {
//     console.log(error);

//     if (tempInputPath && fs.existsSync(tempInputPath)) {
//       fs.unlinkSync(tempInputPath);
//     }

//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// };

export const editVideo = async (req, res) => {
  let tempInputPath = null;

  try {
    let { start, end } = req.body;

    start = Number(start);
    end = Number(end);

    // ✅ validation
    if (isNaN(start) || isNaN(end) || end <= start) {
      return res.status(400).json({
        message: "Invalid trim range",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    let inputPath;

    // ✅ uploaded file
    if (req.file) {
      inputPath = req.file.path;
      tempInputPath = req.file.path;
    }

    // ✅ DB video path
    else if (req.body.videoPath) {
      inputPath = path.join(
        process.cwd(),
        req.body.videoPath.replace(/^\/+/, "")
      );
    }

    else {
      return res.status(400).json({
        message: "Video required",
      });
    }

    // ✅ CHECK FILE EXISTS (VERY IMPORTANT)
    if (!fs.existsSync(inputPath)) {
      return res.status(400).json({
        message: "Input video not found",
        path: inputPath,
      });
    }

    const uploadDir = path.join(process.cwd(), "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const outputFileName = `${uuidv4()}.mp4`;
    const outputPath = path.join(uploadDir, outputFileName);

    const duration = end - start;

    // ✅ FFmpeg processing
    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(duration)
      .output(outputPath)
      .on("start", (cmd) => {
        console.log("FFmpeg started:", cmd);
      })
      .on("end", () => {
        console.log("✅ Video trimmed");

        // cleanup temp file
        if (tempInputPath && fs.existsSync(tempInputPath)) {
          fs.unlinkSync(tempInputPath);
        }

        return res.json({
          message: "Trim success",
          videoPath: `/uploads/${outputFileName}`,
        });
      })
      .on("error", (err) => {
        console.error("❌ FFmpeg ERROR FULL:", err);

        if (tempInputPath && fs.existsSync(tempInputPath)) {
          fs.unlinkSync(tempInputPath);
        }

        return res.status(500).json({
          message: "Edit failed",
          error: err.message,
        });
      })
      .run();

  } catch (error) {
    console.error("❌ SERVER ERROR:", error);

    if (tempInputPath && fs.existsSync(tempInputPath)) {
      fs.unlinkSync(tempInputPath);
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};


export const changeSpeed = async (req, res) => {
  try {
    const { speed, videoPath } = req.body;

    let inputPath;

    // ======================
    // ✅ CASE 1: FILE
    // ======================
    if (req.file) {
      inputPath = req.file.path;
    }

    // ======================
    // ✅ CASE 2: EXISTING VIDEO
    // ======================
    else if (videoPath) {
      inputPath = path.join(
        process.cwd(),
        videoPath.replace(/^\/+/, "")
      );
    }

    else {
      return res.status(400).json({
        message: "Video required",
      });
    }

    const outputFileName = `${uuidv4()}.mp4`;
    const outputPath = path.join("uploads", outputFileName);

    ffmpeg(inputPath)
      .videoFilters(`setpts=${1 / speed}*PTS`)
      .audioFilters(`atempo=${speed}`)
      .output(outputPath)
      .on("end", () => {
        res.json({
          message: "Speed updated ✅",
          videoPath: `/uploads/${outputFileName}`,
        });
      })
      .on("error", (err) => {
        console.log(err);
        res.status(500).json({
          message: "Speed change failed",
        });
      })
      .run();

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};


export const mergeVideos = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length < 2) {
      return res.status(400).json({
        message: "At least 2 videos required",
      });
    }

    const outputFileName = `${uuidv4()}.mp4`;
    const outputPath = path.join("uploads", outputFileName);

    const command = ffmpeg();

    files.forEach(file => {
      command.input(file.path);
    });

    command
      .on("end", () => {
        res.json({
          message: "Merged ✅",
          videoPath: `/uploads/${outputFileName}`,
        });
      })
      .on("error", (err) => {
        console.log(err);
        res.status(500).json({ message: "Merge failed" });
      })
      .mergeToFile(outputPath);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};




