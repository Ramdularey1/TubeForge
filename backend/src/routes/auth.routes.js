import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { fetchUser } from "../controllers/auth.controller.js";
import { logout } from "../controllers/auth.controller.js";
import {
  googleLogin,
  googleCallback
} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/get-user",verifyJWT, fetchUser);
router.post("/logout",verifyJWT, logout)

export const authRoutes = router;