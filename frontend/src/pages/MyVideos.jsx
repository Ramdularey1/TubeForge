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

  // 🔥 Use video
  const handleUse = (video) => {
    localStorage.setItem(
      "selectedVideo",
      JSON.stringify(video)
    );

    navigate("/upload"); // 🔥 redirect
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Fetch Video
      </h1>

      <div className="grid grid-cols-3 gap-4">

        {videos && videos.map((video) => (

          <div
            key={video._id}
            className="border rounded p-3"
          >

            <img
              src={
                "http://localhost:8000" +
                video.thumbnailUrl
              }
              className="w-full rounded"
            />

            <h2 className="mt-2 font-semibold text-sm">
              {video.title}
            </h2>

            <video
              controls
              className="mt-2 w-full"
            >
              <source
                src={
                  "http://localhost:8000" +
                  video.videoUrl
                }
              />
            </video>

            {/* 🔥 USE BUTTON */}
            <button
              onClick={() => handleUse(video)}
              className="bg-green-600 text-white px-3 py-1 mt-2 rounded w-full"
            >
              Use
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyVideos;