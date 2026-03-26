// import dotenv from "dotenv";
// dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes.js";
import connectDB from "./config/db.js";
import youtubeRoutes from "./routes/youtube.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

app.use(
  "/uploads",
  express.static("uploads")
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.use("/auth", authRoutes);
app.use("/youtube", youtubeRoutes);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at port ${PORT}`);
    });
}).catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
});;