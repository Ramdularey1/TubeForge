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

  useEffect(() => {
    setSelectedThumb(JSON.parse(localStorage.getItem("selectedThumbnail")));
    setSelectedVideo(JSON.parse(localStorage.getItem("selectedVideo")));
  }, []);

  const handleUpload = async () => {
    try {
      const formData = new FormData();

      if (video) formData.append("video", video);
      else if (selectedVideo)
        formData.append("videoPath", selectedVideo.videoUrl);

      if (thumbnail) formData.append("thumbnail", thumbnail);
      else if (selectedThumb)
        formData.append("thumbnailPath", selectedThumb.imageUrl);

      formData.append("title", title);
      formData.append("description", description);
      formData.append("privacyStatus", privacy);

      await API.post("/youtube/video", formData);

      alert("Uploaded ✅");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Upload Video
          </h1>
          <p className="text-zinc-400 text-sm">
            Publish your content
          </p>
        </div>

        {/* 🔥 MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SIDE */}
          <div className="lg:col-span-1 space-y-6">

            {/* Video */}
            <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4 space-y-4">
              <h2 className="font-semibold">Video</h2>

              <button
                onClick={() => navigate("/my-videos")}
                className="w-full bg-blue-600 py-2 rounded-xl"
              >
                Manage Videos
              </button>

              {selectedVideo && (
                <video controls className="w-full rounded-lg">
                  <source
                    src={
                      "http://localhost:8000" +
                      selectedVideo.videoUrl
                    }
                  />
                </video>
              )}
            </div>

            {/* Thumbnail */}
            <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4 space-y-4">
              <h2 className="font-semibold">Thumbnail</h2>

              <input
                type="file"
                className="w-full text-sm"
                onChange={(e) => {
                  setThumbnail(e.target.files[0]);
                  setSelectedThumb(null);
                }}
              />

              <button
                onClick={() => navigate("/my-thumbnails")}
                className="w-full bg-purple-600 py-2 rounded-xl"
              >
                Choose from Library
              </button>

              {selectedThumb && (
                <img
                  src={
                    "http://localhost:8000" +
                    selectedThumb.imageUrl
                  }
                  className="w-full rounded-lg"
                />
              )}
            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 bg-zinc-900/60 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-6">

            {/* Title */}
            <div>
              <label className="text-sm text-zinc-400">
                Title
              </label>
              <input
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-zinc-400">
                Description
              </label>
              <textarea
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 h-32"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Privacy */}
            <div>
              <label className="text-sm text-zinc-400">
                Privacy
              </label>
              <select
                className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>

            {/* Upload */}
            <button
              onClick={handleUpload}
              className="w-full sm:w-auto bg-red-600 px-6 py-2 rounded-xl font-semibold"
            >
              Upload Video
            </button>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;