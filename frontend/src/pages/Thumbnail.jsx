import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import API from "../api/axios";

const Thumbnail = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateThumbnail = async () => {
    try {
      setLoading(true);

      const res = await API.post(
         "/youtube/generate-thumbnail",
        { title }
      );

      console.log(res.data);

      setImage(
        "http://localhost:8000" +
          res.data.thumbnailPath
      );

      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        AI Thumbnail Generator
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-2xl">

        {/* title */}

        <input
          type="text"
          placeholder="Enter video title"
          className="border p-2 w-full mb-4"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        {/* button */}

        <button
          onClick={generateThumbnail}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Generate
        </button>

        {loading && <p>Generating...</p>}

        {/* image */}

        {image && (
          <div className="mt-6">

            <img
              src={image}
              className="w-full rounded"
            />

           <a
  href={image}
  download
  target="_blank"
  rel="noreferrer"
    className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
>
  Download
</a>

          </div>
        )}

      </div>

    </DashboardLayout>
  );
};

export default Thumbnail;