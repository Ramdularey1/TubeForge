import dotenv from "dotenv";
dotenv.config(); // MUST be first
import { google } from "googleapis";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { authRoutes } from "./routes/auth.routes.js";
import connectDB from "./config/db.js";
import youtubeRoutes from "./routes/youtube.routes.js";

const app = express();


console.log("ENV CHECK:");
console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("SECRET:", process.env.GOOGLE_CLIENT_SECRET);
console.log("REDIRECT:", process.env.GOOGLE_REDIRECT_URI);
console.log("Mongo URI:", process.env.MONGODB_URI);

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


// CORS
app.use(
  cors({
    origin: "http://localhost:5174", // change when deployed
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Routes
app.use("/auth", authRoutes);
app.use("/youtube", youtubeRoutes);

// Start server after DB connect
const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });