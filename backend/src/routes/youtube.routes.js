import express from "express";
// import { uploadVideo } from "../controllers/youtube.controller.js";
import { uploadVideo } from "../controllers/youtube.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// "video" must match Postman key
router.post("/video", upload.single("video"), uploadVideo);

export default router;