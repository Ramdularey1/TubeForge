import mongoose from "mongoose";

const thumbnailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Thumbnail = mongoose.model(
  "Thumbnail",
  thumbnailSchema
);