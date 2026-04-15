import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const generateThumbnail = async (title) => {
  try {
    // 🔥 strong prompt (important)
    const prompt = `YouTube thumbnail, bold text "${title}", bright colors, high contrast, cinematic lighting, viral style`;

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 15000,
    });

    const uploadDir = path.resolve("uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const fileName = uuidv4() + ".png";

    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, response.data);

    return `/uploads/${fileName}`;
  } catch (error) {
    console.log("🔥 POLLINATIONS ERROR:", error.message);

    throw new Error("Thumbnail generation failed");
  }
};
