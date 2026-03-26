import axios from "axios";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export const generateThumbnail = async (title) => {
  try {

    // free image generator (stable)
    const text = encodeURIComponent(title);

    const url =
      `https://dummyimage.com/1280x720/000/fff&text=${text}`;

    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }

    const fileName = uuidv4() + ".png";

    const filePath = path.join(
      "uploads",
      fileName
    );

    fs.writeFileSync(
      filePath,
      response.data
    );

    return `/uploads/${fileName}`;

  } catch (error) {

    console.log(
      "THUMBNAIL ERROR",
      error.message
    );

    throw new Error(
      "Thumbnail generation failed"
    );
  }
};