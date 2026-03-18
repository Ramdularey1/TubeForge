// import express from "express";
// // import { uploadVideo } from "../controllers/youtube.controller.js";
// import { uploadVideo } from "../controllers/youtube.controller.js";
// import { upload } from "../middlewares/upload.middleware.js";

// const router = express.Router();

// // "video" must match Postman key
// router.post("/video", upload.single("video"), uploadVideo);

// export default router;


import express from "express";
import { uploadVideo, getDashboard } from "../controllers/youtube.controller.js";
import { getVideoAnalytics } from "../controllers/youtube.analytics.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelVideos } from "../controllers/youtube.controller.js";
import { generateThumbnail } from "../services/thumbnail.service.js"

const router = express.Router();

/*
==================================================
🔐 All YouTube routes require authentication
==================================================
*/
router.use(verifyJWT);

/*
==================================================
📤 Upload Video
==================================================
*/
router.post(
  "/video",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

/*
==================================================
📊 Dashboard
==================================================
*/
router.get("/dashboard", getDashboard);

/*
==================================================
📈 Video Analytics
==================================================
*/
router.get("/analytics/:videoId", getVideoAnalytics);

router.get("/videos", getChannelVideos);

router.post("/generate-thumbnail", async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const thumbnailPath = await generateThumbnail(title);

    res.json({
      message: "Thumbnail Generated ✅",
      thumbnail: thumbnailPath   // 👈 IMPORTANT
    });

  } catch (error) {
    res.status(500).json({
      message: "Thumbnail generation failed",
      error: error.message,
    });
  }
});

export default router;