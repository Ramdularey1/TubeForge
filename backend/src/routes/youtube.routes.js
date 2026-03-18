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
import { upload } from "../middlewares/upload.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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
POST /api/youtube/video

form-data:
- video (file) ✅ required
- thumbnail (file) ✅ optional
- title (text)
- description (text)
- tags (comma separated)
- privacyStatus (public/private/unlisted)
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
📊 Dashboard Data
GET /api/youtube/dashboard
==================================================
*/
router.get("/dashboard", getDashboard);

export default router;