import DashboardLayout from "../layouts/DashboardLayout";
import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";

import { getVideoAnalytics } from "../api/youtube";

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

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getVideoAnalytics(id);

      console.log("Analytics:", res);

      const a = res.analytics;

      if (!a) {
        setData([]);
        return;
      }

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

  if (!data) return <div>Loading...</div>;

  if (data.length === 0)
    return (
      <DashboardLayout>
        <h1>No analytics yet</h1>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Video Analytics
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart data={data}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#ef4444"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </DashboardLayout>
  );
};

export default Analytics;