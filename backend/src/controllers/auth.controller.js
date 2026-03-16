import { oauth2Client } from "../config/googleOauth.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";

export const googleLogin = async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/youtube.upload"
    ]
  });

  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  try {
    const code = req.query.code;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2"
    });

    const { data } = await oauth2.userinfo.get();

    // user info from google
    const user = {
      email: data.email,
      name: data.name,
      picture: data.picture
    };

    // create JWT
    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    // send cookie
    res.cookie("token", token, {
      httpOnly: true
    });

    // redirect to frontend
    res.redirect("http://localhost:5174/dashboard");

  } catch (error) {
    console.log(error);
    res.send("Authentication Failed");
  }
};