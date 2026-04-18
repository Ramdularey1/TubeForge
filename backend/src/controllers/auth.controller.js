import {oauth2Client} from "../server.js"
import { google } from "googleapis";
import jwt from "jsonwebtoken";
// import { User } from "../models/User.model.js";
import { User } from "../models/user.model.js";


// ================= GOOGLE LOGIN =================
// export const googleLogin = async (req, res) => {

//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     prompt: "consent", // ensures refresh_token comes
//     scope: [
//       "profile",
//       "email",
//       "https://www.googleapis.com/auth/youtube.upload",
//       "https://www.googleapis.com/auth/youtube.readonly"
//     ]
//   });

//   res.redirect(url);
// };


export const googleLogin = async (req, res) => {
  try {
    console.log("USING CLIENT ID:", oauth2Client._clientId);
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent", // ensures refresh_token comes
      redirect_uri: process.env.GOOGLE_REDIRECT_URI, // 🔥 FIX ADDED
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube.readonly",
      ],
    });

    return res.redirect(url);
  } catch (error) {
    console.error("Google Login Error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};



// ================= GOOGLE CALLBACK =================
export const googleCallback = async (req, res) => {
  try {
    const code = req.query.code;

    // exchange code → tokens
    const { tokens } = await oauth2Client.getToken(code);
    console.log("🔥 GOOGLE TOKENS RECEIVED:");
    console.log(tokens);
    oauth2Client.setCredentials(tokens);

    // get google user info
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2"
    });

    const { data } = await oauth2.userinfo.get();

    // ================= SAVE USER =================
    let user = await User.findOne({ email: data.email });

    if (!user) {
      // create new user
      user = await User.create({
        googleId: data.id,
        email: data.email,
        name: data.name,
        picture: data.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token
      });
    } else {
      // update tokens
      user.accessToken = tokens.access_token;

      if (tokens.refresh_token) {
        user.refreshToken = tokens.refresh_token;
      }

      await user.save();
    }

    // ================= CREATE JWT =================
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // send cookie
    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
});

    // redirect to frontend (later)
    res.redirect("https://tube-forge-2ck1s47vw-ram-dulareys-projects.vercel.app/dashboard");

  } catch (error) {
    console.log(error);
    res.send("Authentication Failed");
  }
};

export const fetchUser = async (req, res) => {
  try {
    const user = req.user;
     console.log("🔥 FETCH USER:",user);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logged out successfully",
  });
};

