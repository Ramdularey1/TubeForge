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
      setData(res);
    } catch (err) {
      console.log(err);
    }
  };

  console.log("🔥 DASHBOARD DATA:", data);
  // 🔥 Loading UI
  if (!data)
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-40 bg-zinc-800 rounded-lg" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-zinc-900 border border-zinc-800"
              />
            ))}
          </div>

          <div className="h-64 bg-zinc-900 rounded-2xl border border-zinc-800" />
        </div>
      </DashboardLayout>
    );

  const channel = data.channel;
  const videos = data.videos;

  return (
    <DashboardLayout>
      {/* 🔥 IMPORTANT: spacing handled here */}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="text-sm text-zinc-400">
            Welcome back 👋 Here’s your channel overview
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatsCard title="Views" value={channel.views} type="views" />
          <StatsCard
            title="Subscribers"
            value={channel.subscribers}
            type="subs"
          />
          <StatsCard title="Videos" value={channel.totalVideos} type="videos" />
          <StatsCard title="Channel" value={channel.title} type="comments" />
        </div>

        {/* Charts */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Analytics Overview</h2>

          <AnalyticsChart />
        </div>

        {/* Table */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Videos</h2>

          {/* Scrollable Container */}
          <div className="max-h-[400px] overflow-y-auto">
            <RecentVideosTable videos={videos} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
