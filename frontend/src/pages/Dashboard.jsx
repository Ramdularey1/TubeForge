import DashboardLayout from "../layouts/DashboardLayout";
import StatsCard from "../components/StatsCard";
import AnalyticsChart from "../components/AnalyticsChart";
import RecentVideosTable from "../components/RecentVideosTable";

import { useEffect, useState } from "react";
import { getDashboard } from "../api/youtube";

const Dashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();

      console.log(res);

      setData(res);

    } catch (err) {
      console.log(err);
    }
  };

  if (!data) return <div>Loading...</div>;

  const channel = data.channel;
  const videos = data.videos;

  console.log(channel);
  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          title="Views"
          value={channel.views}
          type="views"
        />

        <StatsCard
          title="Subscribers"
          value={channel.subscribers}
          type="subs"
        />

        <StatsCard
          title="Videos"
          value={channel.totalVideos}
          type="videos"
        />

        <StatsCard
          title="Channel"
          value={channel.title}
          type="comments"
        />

      </div>

      {/* Charts */}

      <AnalyticsChart />

      {/* Table */}

      <RecentVideosTable videos={videos} />

    </DashboardLayout>
  );
};

export default Dashboard;