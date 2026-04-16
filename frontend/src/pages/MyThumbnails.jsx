import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";

const MyThumbnails = () => {
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchThumbnails();
  }, []);

  const fetchThumbnails = async () => {
    try {
      const res = await API.get("/youtube/thumbnails");
      setThumbnails(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const selectThumbnail = (thumb) => {
    localStorage.setItem("selectedThumbnail", JSON.stringify(thumb));
    navigate("/upload");
  };

  const deleteThumbnail = async (id) => {
    try {
      await API.delete(`/youtube/thumbnail/${id}`);
      setThumbnails((prev) =>
        prev.filter((t) => t._id !== id)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            My Thumbnails
          </h1>
          <p className="text-sm text-zinc-400">
            Your generated thumbnails
          </p>
        </div>

        <button
          onClick={() => navigate("/thumbnail")}
          className="mt-3 sm:mt-0 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl"
        >
          + Create New
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-zinc-400">
          Loading...
        </div>
      )}

      {/* Empty */}
      {!loading && thumbnails.length === 0 && (
        <div className="text-center py-20 text-zinc-400">
          No thumbnails yet
        </div>
      )}

      {/* 🔥 GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {thumbnails.map((thumb) => (
          <div
            key={thumb._id}
            className="group relative rounded-2xl overflow-hidden cursor-pointer"
          >

            {/* IMAGE */}
            <img
              src={
                "http://localhost:8000" +
                thumb.imageUrl
              }
              className="w-full h-48 object-cover transition group-hover:scale-105"
            />

            {/* 🔥 OVERLAY */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-3">

              {/* Title */}
              <p className="text-sm font-medium line-clamp-2">
                {thumb.title}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => selectThumbnail(thumb)}
                  className="flex-1 bg-green-600 hover:bg-green-500 py-1 rounded-lg text-sm"
                >
                  Use
                </button>

                <button
                  onClick={() => deleteThumbnail(thumb._id)}
                  className="flex-1 bg-red-600 hover:bg-red-500 py-1 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
    </DashboardLayout>
  );
};

export default MyThumbnails;