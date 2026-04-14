// import DashboardLayout from "../layouts/DashboardLayout";
// import { useState } from "react";
// import API from "../api/axios";

// const Upload = () => {
//   const [video, setVideo] = useState(null);
//   const [thumbnail, setThumbnail] = useState(null);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");

//   const [privacy, setPrivacy] = useState("private");

//   const selectedThumb = JSON.parse(
//   localStorage.getItem("selectedThumbnail")
// );

//  const handleUpload = async () => {
//   try {

//     const formData = new FormData();

//     formData.append("video", video);
//     formData.append("thumbnail", thumbnail);

//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("privacyStatus", privacy);

//     const res = await API.post(
//       "/youtube/video",
//       formData
//     );

//     alert("Uploaded ✅");

//   } catch (err) {

//     console.log(err);

//     alert("Upload failed");

//   }
// };

//   return (
//     <DashboardLayout>

//       <h1 className="text-2xl font-bold mb-6">
//         Upload Video
//       </h1>

//       <div className="bg-white p-6 rounded-xl shadow max-w-3xl">

//         {/* Video */}

//         <input
//           type="file"
//           onChange={(e) =>
//             setVideo(e.target.files[0])
//           }
//         />

//         <br /><br />

//         {/* Thumbnail */}

//         <input
//           type="file"
//           onChange={(e) =>
//             setThumbnail(e.target.files[0])
//           }
//         />
//         {selectedThumb && (
//   <div className="mb-4">

//     <p className="text-sm font-semibold">
//       Selected Thumbnail
//     </p>

//     <img
//       src={
//         "http://localhost:8000" +
//         selectedThumb.imageUrl
//       }
//       className="w-60 rounded shadow"
//     />

//   </div>
// )}

//         <br /><br />

//         {/* Title */}

//         <input
//           type="text"
//           placeholder="Title"
//           className="border p-2 w-full"
//           value={title}
//           onChange={(e) =>
//             setTitle(e.target.value)
//           }
//         />

//         <br /><br />

//         {/* Description */}

//         <textarea
//           placeholder="Description"
//           className="border p-2 w-full"
//           value={description}
//           onChange={(e) =>
//             setDescription(e.target.value)
//           }
//         />

//         <br /><br />

//         {/* Privacy */}

//         <select
//           value={privacy}
//           onChange={(e) =>
//             setPrivacy(e.target.value)
//           }
//         >
//           <option value="private">
//             Private
//           </option>

//           <option value="public">
//             Public
//           </option>

//           <option value="unlisted">
//             Unlisted
//           </option>
//         </select>

//         <br /><br />

//         <button
//           onClick={handleUpload}
//           className="bg-red-600 text-white px-6 py-2 rounded"
//         >
//           Upload
//         </button>

//       </div>

//     </DashboardLayout>
//   );
// };

// export default Upload;

import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState("private");

  const [selectedThumb, setSelectedThumb] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const navigate = useNavigate();

  // ✅ Load from localStorage
  useEffect(() => {
    const storedThumb = JSON.parse(
      localStorage.getItem("selectedThumbnail")
    );
    setSelectedThumb(storedThumb);

    const storedVideo = JSON.parse(
      localStorage.getItem("selectedVideo")
    );
    setSelectedVideo(storedVideo);

  }, []);

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      // ✅ Video priority
      if (video) {
        formData.append("video", video);
      } else if (selectedVideo) {
        formData.append(
          "videoPath",
          selectedVideo.videoUrl
        );
      }

      // ✅ Thumbnail priority
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      } else if (selectedThumb) {
        formData.append(
          "thumbnailPath",
          selectedThumb.imageUrl
        );
      }

      formData.append("title", title);
      formData.append("description", description);
      formData.append("privacyStatus", privacy);

      await API.post("/youtube/video", formData);

      alert("Uploaded ✅");

      // reset
      setVideo(null);
      setThumbnail(null);
      setSelectedVideo(null);
      setSelectedThumb(null);

      localStorage.removeItem("selectedThumbnail");
      localStorage.removeItem("selectedVideo");

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

        {/* 🔥 VIDEO REDIRECT BUTTON */}
        <button
          onClick={() => navigate("/my-videos")}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Upload / Manage Videos
        </button>

        <p className="text-gray-500 text-sm mt-2">
          Upload videos from My Videos page
        </p>

        {/* ✅ Selected Video Preview */}
        {selectedVideo && (
          <div className="mt-4">

            <p className="text-sm font-semibold">
              Selected Video
            </p>

            <video
              controls
              className="w-60 rounded shadow"
            >
              <source
                src={
                  "http://localhost:8000" +
                  selectedVideo.videoUrl
                }
              />
            </video>

            <button
              onClick={() => {
                localStorage.removeItem("selectedVideo");
                setSelectedVideo(null);
              }}
              className="bg-gray-500 text-white px-3 py-1 mt-2 rounded"
            >
              Remove
            </button>

          </div>
        )}

        <br /><br />

        {/* 🔥 Thumbnail Section */}
        <div className="flex flex-col gap-3">

          {/* Manual Upload */}
          <input
            type="file"
            onChange={(e) => {
              setThumbnail(e.target.files[0]);
              localStorage.removeItem("selectedThumbnail");
              setSelectedThumb(null);
            }}
          />

          {/* OR Choose from DB */}
          <button
            onClick={() => navigate("/my-thumbnails")}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Choose from My Thumbnails
          </button>

        </div>

        {/* ✅ Selected Thumbnail Preview */}
        {selectedThumb && !thumbnail && (
          <div className="mt-4">

            <p className="text-sm font-semibold">
              Selected Thumbnail
            </p>

            <img
              src={
                "http://localhost:8000" +
                selectedThumb.imageUrl
              }
              className="w-60 rounded shadow"
            />

            <button
              onClick={() => {
                localStorage.removeItem("selectedThumbnail");
                setSelectedThumb(null);
              }}
              className="bg-gray-500 text-white px-3 py-1 mt-2 rounded"
            >
              Remove
            </button>

          </div>
        )}

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
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="unlisted">Unlisted</option>
        </select>

        <br /><br />

        {/* Upload Button */}
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