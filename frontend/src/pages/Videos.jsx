import DashboardLayout from "../layouts/DashboardLayout";
import VideoCard from "../components/VideoCard";

import { useEffect, useState } from "react";
import { getDashboard } from "../api/youtube";

const Videos = () => {

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {

      const res = await getDashboard();

      setVideos(res.videos);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        My Videos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {videos.map((v) => (
          <VideoCard
            key={v.id}
            video={v}
          />
        ))}

      </div>

    </DashboardLayout>
  );
};

export default Videos;