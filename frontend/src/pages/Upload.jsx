import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import API from "../api/axios";

const Upload = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [privacy, setPrivacy] = useState("private");

 const handleUpload = async () => {
  try {

    const formData = new FormData();

    formData.append("video", video);
    formData.append("thumbnail", thumbnail);

    formData.append("title", title);
    formData.append("description", description);
    formData.append("privacyStatus", privacy);

    const res = await API.post(
      "/youtube/video",
      formData
    );

    alert("Uploaded ✅");

  } catch (err) {

    console.log(err);

    alert("Upload failed");

  }
};

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Upload Video
      </h1>

      <div className="bg-white p-6 rounded-xl shadow max-w-3xl">

        {/* Video */}

        <input
          type="file"
          onChange={(e) =>
            setVideo(e.target.files[0])
          }
        />

        <br /><br />

        {/* Thumbnail */}

        <input
          type="file"
          onChange={(e) =>
            setThumbnail(e.target.files[0])
          }
        />

        <br /><br />

        {/* Title */}

        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <br /><br />

        {/* Description */}

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br /><br />

        {/* Privacy */}

        <select
          value={privacy}
          onChange={(e) =>
            setPrivacy(e.target.value)
          }
        >
          <option value="private">
            Private
          </option>

          <option value="public">
            Public
          </option>

          <option value="unlisted">
            Unlisted
          </option>
        </select>

        <br /><br />

        <button
          onClick={handleUpload}
          className="bg-red-600 text-white px-6 py-2 rounded"
        >
          Upload
        </button>

      </div>

    </DashboardLayout>
  );
};

export default Upload;