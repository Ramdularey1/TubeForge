import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const generateThumbnail = async (title) => {
  try {
    if (!process.env.HF_TOKEN) {
      console.log("ERROR: HF_TOKEN missing in .env");
      throw new Error("HF_TOKEN missing");
    }

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        inputs: `YouTube thumbnail, bold text "${title}", cinematic lighting, high contrast, modern youtube style`
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "image/png", // ✅ VERY IMPORTANT FIX
        },
        responseType: "arraybuffer",
      }
    );

    // create uploads folder if missing
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    const fileName = `${uuidv4()}.png`;
    const filePath = path.join("uploads", fileName);

    fs.writeFileSync(filePath, response.data);

    return `/uploads/${fileName}`;

  } catch (error) {
    console.log(
      "🔥 HF ERROR:",
      error.response?.data?.toString() || error.message
    );

    throw new Error("Thumbnail generation failed");
  }
};