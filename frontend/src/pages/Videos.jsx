import DashboardLayout from "../layouts/DashboardLayout";
import VideoCard from "../components/VideoCard";

import { useEffect, useState } from "react";
import { getDashboard } from "../api/youtube";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await getDashboard();
      setVideos(res.videos);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
            My Videos
          </h1>

          <p className="text-sm text-zinc-400">
            Manage your uploaded content
          </p>
        </div>

        {/* 🔥 SHIMMER */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-900/60 border border-white/10 rounded-2xl p-3 space-y-3 animate-pulse"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-zinc-800 rounded-lg" />

                {/* Title */}
                <div className="h-4 bg-zinc-700 rounded w-3/4" />

                {/* Subtitle */}
                <div className="h-3 bg-zinc-700 rounded w-1/2" />
              </div>
            ))}

          </div>
        )}

        {/* 🔥 ACTUAL DATA */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}

          </div>
        )}

        {/* Empty */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            No videos found
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default Videos;