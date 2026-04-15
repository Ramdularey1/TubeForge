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




import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const res = await API.get("/youtube/fetch-video");
    setVideos(res.data);
  };

  const handleUse = (video) => {
    localStorage.setItem("selectedVideo", JSON.stringify(video));
    navigate("/upload");
  };

  // 🔥 NEW: EDIT VIDEO
  const handleEdit = (video) => {
    localStorage.setItem("editVideo", JSON.stringify(video));
    navigate("/edit-video");
  };

  const deleteVideo = async (id) => {
    try {
      await API.delete(`/youtube/video/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Fetch Video</h1>

      <div className="grid grid-cols-3 gap-4">
        {videos.map((video) => (
          <div
            key={video._id}
            className="border rounded p-3 hover:shadow-lg"
          >
            <h2 className="text-sm font-semibold">{video.title}</h2>

            <video controls className="mt-2 w-full">
              <source
                src={"http://localhost:8000" + video.videoUrl}
              />
            </video>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleUse(video)}
                className="bg-green-600 text-white px-2 py-1 rounded w-full"
              >
                Use
              </button>

              <button
                onClick={() => handleEdit(video)}
                className="bg-yellow-500 text-white px-2 py-1 rounded w-full"
              >
                Edit
              </button>

              <button
                onClick={() => deleteVideo(video._id)}
                className="bg-red-600 text-white px-2 py-1 rounded w-full"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyVideos;