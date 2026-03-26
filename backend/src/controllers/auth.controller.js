// import { oauth2Client } from "../config/googleOauth.js";
// import { google } from "googleapis";
// import jwt from "jsonwebtoken";

// export const googleLogin = async (req, res) => {
//   const url = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: [
//       "profile",
//       "email",
//       "https://www.googleapis.com/auth/youtube.upload"
//     ]
//   });

//   res.redirect(url);
// };

// export const googleCallback = async (req, res) => {
//   try {
//     const code = req.query.code;

//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     const oauth2 = google.oauth2({
//       auth: oauth2Client,
//       version: "v2"
//     });

//     const { data } = await oauth2.userinfo.get();

//     // user info from google
//     const user = {
//       email: data.email,
//       name: data.name,
//       picture: data.picture
//     };

//     // create JWT
//     const token = jwt.sign(user, process.env.JWT_SECRET, {
//       expiresIn: "7d"
//     });

//     // send cookie
//     res.cookie("token", token, {
//       httpOnly: true
//     });

//     // redirect to frontend
//     res.redirect("http://localhost:5174/dashboard");

//   } catch (error) {
//     console.log(error);
//     res.send("Authentication Failed");
//   }
// };




import { oauth2Client } from "../config/googleOauth.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
// import { User } from "../models/User.model.js";
import { User } from "../models/user.model.js";


// ================= GOOGLE LOGIN =================
export const googleLogin = async (req, res) => {

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // ensures refresh_token comes
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.upload",
      "https://www.googleapis.com/auth/youtube.readonly"
    ]
  });

  res.redirect(url);
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
  secure: false,
  sameSite: "lax",
});

    // redirect to frontend (later)
    res.redirect("http://localhost:5174/dashboard");

  } catch (error) {
    console.log(error);
    res.send("Authentication Failed");
  }
};