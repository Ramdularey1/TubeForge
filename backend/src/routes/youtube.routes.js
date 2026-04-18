import express from "express";
import { uploadVideo, getDashboard } from "../controllers/youtube.controller.js";
import { getVideoAnalytics } from "../controllers/youtube.analytics.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelVideos } from "../controllers/youtube.controller.js";
import { generateThumbnail } from "../services/thumbnail.service.js"
import { saveThumbnail } from "../controllers/youtube.controller.js";
import { getThumbnail } from "../controllers/youtube.controller.js";
import { saveVideo } from "../controllers/youtube.controller.js"; 
import { getVideo } from "../controllers/youtube.controller.js";
import { deleteThumbnail } from "../controllers/youtube.controller.js";
import { deleteVideo } from "../controllers/youtube.controller.js";
import { editVideo } from "../controllers/youtube.controller.js";
import { mergeVideos } from "../controllers/youtube.controller.js";
import { changeSpeed } from "../controllers/youtube.controller.js";
import { getChannelAnalytics } from "../controllers/youtube.analytics.controller.js";

import { get } from "mongoose";

const router = express.Router();

/*
==================================================
🔐 All YouTube routes require authentication
==================================================
*/
// router.use(verifyJWT);

/*
==================================================
📤 Upload Video
==================================================
*/
router.post(
  "/video",
  verifyJWT,
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
router.get("/dashboard",verifyJWT, getDashboard);

/*
==================================================
📈 Video Analytics
==================================================
*/
router.get("/analytics/:videoId", getVideoAnalytics);

router.get("/videos",verifyJWT, getChannelVideos);

router.post("/generate-thumbnail", async (req, res) => {

  console.log("🔥 ROUTE HIT");

  const { title } = req.body;

  const thumbnailPath =
    await generateThumbnail(title);

  console.log("🔥 FROM SERVICE:", thumbnailPath);

  res.json({
    message: "Thumbnail Generated ✅",
    thumbnailPath,
  });
});

router.post("/save-thumbnail", verifyJWT, saveThumbnail);

router.get("/thumbnails",verifyJWT, getThumbnail);
// router.post("/save-video", saveVideo);
router.post(
  "/save-video",
 verifyJWT,
  upload.single("video"), // 🔥 MUST MATCH FRONTEND
  saveVideo
);
router.get("/fetch-video",verifyJWT,getVideo)
router.delete("/thumbnail/:id",verifyJWT, deleteThumbnail);
router.delete("/video/:id",verifyJWT, deleteVideo);

router.post(
  "/video/edit",
  verifyJWT,
  upload.single("video"),
  editVideo
);

router.post("/video/merge", upload.array("videos"), mergeVideos);
router.post("/video/speed", upload.single("video"), changeSpeed);
router.get("/channel-analytics",verifyJWT,  getChannelAnalytics);

export default router;