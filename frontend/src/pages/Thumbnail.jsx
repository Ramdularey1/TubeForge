// import DashboardLayout from "../layouts/DashboardLayout";
// import { useState } from "react";
// import API from "../api/axios";

// const Thumbnail = () => {
//   const [title, setTitle] = useState("");
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const generateThumbnail = async () => {
//     try {
//       setLoading(true);

//       const res = await API.post(
//         "/youtube/generate-thumbnail",
//         { title }
//       );

//       const imageUrl =
//         "http://localhost:8000" +
//         res.data.thumbnailPath;

//       console.log("Image URL:", res.data.thumbnailPath);

//       setImage(imageUrl); // ✅ store image for preview

//       setLoading(false);

//     } catch (err) {
//       console.log(err);
//       setLoading(false);
//     }
//   };

//   const downloadImage = () => {
//     const link = document.createElement("a");
//     link.href = image;
//     link.download = "thumbnail.png";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <DashboardLayout>

//       <h1 className="text-2xl font-bold mb-6">
//         AI Thumbnail Generator
//       </h1>

//       <div className="bg-white p-6 rounded-xl shadow max-w-2xl">

//         {/* Input */}
//         <input
//           type="text"
//           placeholder="Enter video title"
//           className="border p-2 w-full mb-4"
//           value={title}
//           onChange={(e) =>
//             setTitle(e.target.value)
//           }
//         />

//         {/* Generate button */}
//         <button
//           onClick={generateThumbnail}
//           className="bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Generate
//         </button>

//         {/* Loading */}
//         {loading && (
//           <p className="mt-4">
//             Generating...
//           </p>
//         )}

//         {/* ✅ IMAGE PREVIEW */}
//         {image && (
//           <div className="mt-6">

//             <h2 className="font-semibold mb-2">
//               Preview
//             </h2>

//             <img
//               src={image}
//               alt="thumbnail"
//               className="w-full rounded shadow"
//             />

//             {/* Download */}
//             <button
//               onClick={downloadImage}
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Download
//             </button>

//           </div>
//         )}

//       </div>

//     </DashboardLayout>
//   );
// };

// export default Thumbnail;



import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import API from "../api/axios";

const Thumbnail = () => {
  // 🔥 separate states
  const [thumbnailTitle, setThumbnailTitle] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);

  const [saved, setSaved] = useState(false);

  // 🔥 Generate thumbnail
  const generateThumbnail = async () => {
    try {
      if (!thumbnailTitle) {
        alert("Please enter thumbnail title");
        return;
      }

      setLoading(true);
      setSaved(false);

      const res = await API.post(
        "/youtube/generate-thumbnail",
        { title: thumbnailTitle }
      );

      const imageUrl =
        "http://localhost:8000" +
        res.data.thumbnailPath;

      setImage(imageUrl);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Save thumbnail
  const saveThumbnail = async () => {
    try {
      setSaving(true);

      await API.post("/youtube/save-thumbnail", {
        title: thumbnailTitle,
        imageUrl: image.replace(
          "http://localhost:8000",
          ""
        ),
      });

      setSaved(true);

    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  // 🔥 Save video
  const saveVideo = async () => {
    try {
      if (!video) {
        alert("Please select a video");
        return;
      }

      if (!videoTitle) {
        alert("Please enter video title");
        return;
      }

      setSavingVideo(true);

      const formData = new FormData();

      formData.append("video", video);
      formData.append("title", videoTitle);
      formData.append("description", videoTitle);

      // if (image) {
      //   formData.append(
      //     "thumbnailPath",
      //     image.replace("http://localhost:8000", "")
      //   );
      // }

      await API.post("/youtube/save-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Video saved in backend ✅");

      setVideo(null);
      setVideoTitle("");

    } catch (err) {
      console.log(err);
      alert("Save failed");
    } finally {
      setSavingVideo(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "thumbnail.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        AI Thumbnail Generator
      </h1>

      <div className="grid grid-cols-2 gap-6">

        {/* ================= LEFT: THUMBNAIL ================= */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4">
            Generate Thumbnail
          </h2>

          <input
            type="text"
            placeholder="Enter thumbnail title"
            className="border p-2 w-full mb-4"
            value={thumbnailTitle}
            onChange={(e) => setThumbnailTitle(e.target.value)}
          />

          <button
            onClick={generateThumbnail}
            className="bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          {image && (
            <div className="mt-6">

              <img
                src={image}
                alt="thumbnail"
                className="w-full rounded shadow"
              />

              <div className="flex gap-3 mt-4">

                <button
                  onClick={downloadImage}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Download
                </button>

                <button
                  onClick={saveThumbnail}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>

              </div>

              {saved && (
                <p className="text-green-600 mt-2">
                  Saved ✅
                </p>
              )}

            </div>
          )}

        </div>

        {/* ================= RIGHT: VIDEO ================= */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="font-semibold mb-4">
            Save Video
          </h2>

          {/* ✅ VIDEO TITLE INPUT */}
          <input
            type="text"
            placeholder="Enter video title"
            className="border p-2 w-full mb-4"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) =>
              setVideo(e.target.files[0])
            }
          />

          <br /><br />

          <button
            onClick={saveVideo}
            disabled={!video || savingVideo}
            className="bg-purple-600 text-white px-4 py-2 rounded w-full"
          >
            {savingVideo ? "Saving..." : "Save Video"}
          </button>

          <p className="text-gray-500 text-sm mt-2">
            Title is required.
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Thumbnail;