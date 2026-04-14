import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    description: String,
    videoUrl: String,
    thumbnailUrl: String,
    youtubeVideoId: String,
  },
  { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);