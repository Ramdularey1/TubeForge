import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },

    name: String,
    email: String,
    picture: String,

    accessToken: String,
    refreshToken: String,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);