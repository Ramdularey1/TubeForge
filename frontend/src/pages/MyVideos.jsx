// import { useEffect, useState } from "react";
// import API from "../api/axios";
// import { useNavigate } from "react-router-dom";

// const MyVideos = () => {
//   const [videos, setVideos] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   const fetchVideos = async () => {
//     const res = await API.get("/youtube/fetch-video");
//     setVideos(res.data);
//   };

//   const handleUse = (video) => {
//     localStorage.setItem(
//       "selectedVideo",
//       JSON.stringify(video)
//     );
//     navigate("/upload");
//   };

//   // 🔥 DELETE FUNCTION
//   const deleteVideo = async (id) => {
//     try {
//       await API.delete(`/youtube/video/${id}`);

//       setVideos((prev) =>
//         prev.filter((video) => video._id !== id)
//       );

//     } catch (err) {
//       console.log(err);
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div className="p-6">

//       <h1 className="text-2xl font-bold mb-6">
//         Fetch Video
//       </h1>

//       <div className="grid grid-cols-3 gap-4">

//         {videos && videos.map((video) => (

//           <div
//             key={video._id}
//             className="border rounded p-3 hover:shadow-lg transition"
//           >

//             <h2 className="mt-2 font-semibold text-sm">
//               {video.title}
//             </h2>

//             <video
//               controls
//               className="mt-2 w-full"
//             >
//               <source
//                 src={
//                   "http://localhost:8000" +
//                   video.videoUrl
//                 }
//               />
//             </video>

//             <div className="flex gap-2 mt-2">

//               <button
//                 onClick={() => handleUse(video)}
//                 className="bg-green-600 text-white px-3 py-1 rounded w-full"
//               >
//                 Use
//               </button>

//               <button
//                 onClick={() => deleteVideo(video._id)}
//                 className="bg-red-600 text-white px-3 py-1 rounded w-full"
//               >
//                 Delete
//               </button>

//             </div>

//           </div>
//         ))}

//       </div>

//     </div>
//   );
// };

// export default MyVideos;



import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const videoRefs = useRef({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await API.get("/youtube/fetch-video");
      setVideos(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUse = (video) => {
    localStorage.setItem("selectedVideo", JSON.stringify(video));
    navigate("/upload");
  };

  const handleEdit = (video) => {
    localStorage.setItem("editVideo", JSON.stringify(video));
    navigate("/edit-video");
  };

  const deleteVideo = async (id) => {
    try {
      await API.delete(`/youtube/video/${id}`);
      setVideos((prev) =>
        prev.filter((v) => v._id !== id)
      );
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            My Videos
          </h1>
          <p className="text-sm text-zinc-400">
            Manage your content
          </p>
        </div>

        <button
          onClick={() => navigate("/upload")}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl"
        >
          + Upload
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-zinc-400">
          Loading videos...
        </div>
      )}

      {/* Empty */}
      {!loading && videos.length === 0 && (
        <div className="text-center py-20 text-zinc-400">
          No videos found
        </div>
      )}

      {/* LIST */}
      <div className="space-y-4">

        {videos.map((video) => (
          <div
            key={video._id}
            className="group relative bg-zinc-900/60 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-4 transition-all duration-300 hover:bg-zinc-900 hover:scale-[1.01] hover:shadow-2xl hover:border-white/20"
          >

            {/* 🔥 Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 blur-xl transition pointer-events-none" />

            {/* VIDEO */}
            <div className="w-full sm:w-48 flex-shrink-0 relative">

              <video
                ref={(el) => (videoRefs.current[video._id] = el)}
                className="w-full rounded-lg transition duration-300 group-hover:brightness-75 group-hover:scale-[1.02]"
                muted
                loop
                autoPlay
                playsInline
                onMouseEnter={(e) => e.currentTarget.pause()}
                onMouseLeave={(e) => e.currentTarget.play()}
              >
                <source
                  src={"http://localhost:8000" + video.videoUrl}
                />
              </video>

             

            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between">

              <div>
                <h2 className=" font-semibold text-whi text-sm sm:text-base line-clamp-2">
                  {video.title}
                </h2>

                <p className="text-xs text-zinc-400 mt-1">
                  Uploaded video
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-3">

                <button
                  onClick={() => handleUse(video)}
                  className="bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Use
                </button>

                <button
                  onClick={() => handleEdit(video)}
                  className="bg-yellow-500 hover:bg-yellow-400 px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteVideo(video._id)}
                  className="bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded-lg text-sm transition"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyVideos;