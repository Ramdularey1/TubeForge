import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const MyThumbnails = () => {
  const [thumbnails, setThumbnails] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchThumbnails();
  }, []);

  const fetchThumbnails = async () => {
    const res = await API.get("/youtube/thumbnails");
    setThumbnails(res.data);
  };

  const selectThumbnail = (thumb) => {
    localStorage.setItem(
      "selectedThumbnail",
      JSON.stringify(thumb)
    );

    // 🔥 redirect
    navigate("/upload");
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        My Thumbnails
      </h1>

      <div className="grid grid-cols-3 gap-4">

        {thumbnails.map((thumb) => (

          <div
            key={thumb._id}
            className="border rounded p-3 hover:shadow-lg transition"
          >

            <img
              src={
                "http://localhost:8000" +
                thumb.imageUrl
              }
              className="w-full rounded"
            />

            <p className="mt-2 text-sm">
              {thumb.title}
            </p>

            <button
              onClick={() =>
                selectThumbnail(thumb)
              }
              className="bg-green-500 text-white px-3 py-1 mt-2 rounded w-full"
            >
              Use
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyThumbnails;