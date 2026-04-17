import DashboardLayout from "../layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVideoAnalytics } from "../api/youtube";
import StatCard from "../components/StatCard";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getVideoAnalytics(id);
      const a = res.analytics;

      if (!a) {
        setData([]);
        return;
      }

      setRaw(a);

      setData([
        { name: "Views", value: a.views },
        { name: "Likes", value: a.likes },
        { name: "Comments", value: a.comments },
        { name: "Watch", value: a.estimatedMinutesWatched },
        { name: "Duration", value: a.averageViewDuration },
        { name: "Subs", value: a.subscribersGained },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) return <div className="p-6">Loading...</div>;

  if (data.length === 0)
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-400">
          No analytics yet
        </div>
      </DashboardLayout>
    );

  const format = (num) => num?.toLocaleString();

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 space-y-6">

        {/* 🔥 Title */}
        <h1 className="text-xl sm:text-2xl font-bold">
          Video Analytics
        </h1>

        {/* 🔥 STAT CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <StatCard title="Views" value={format(raw.views)} />
          <StatCard title="Likes" value={format(raw.likes)} />
          <StatCard title="Comments" value={format(raw.comments)} />
          <StatCard title="Watch Time" value={format(raw.estimatedMinutesWatched)} />
          <StatCard title="Avg Duration" value={format(raw.averageViewDuration)} />
          <StatCard title="Subscribers" value={format(raw.subscribersGained)} />

        </div>

        {/* 🔥 CHART */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;


