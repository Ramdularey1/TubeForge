import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Jan", views: 400, subs: 20 },
  { name: "Feb", views: 800, subs: 40 },
  { name: "Mar", views: 600, subs: 35 },
  { name: "Apr", views: 1200, subs: 80 },
  { name: "May", views: 900, subs: 60 },
  { name: "Jun", views: 1500, subs: 120 },
];

const AnalyticsChart = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

      {/* Line Chart */}

      <div className="bg-white p-4 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          Views Growth
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

      {/* Bar Chart */}

      <div className="bg-white p-4 rounded-xl shadow">

        <h2 className="font-semibold mb-4">
          Subscribers Growth
        </h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="subs"
              fill="#3b82f6"
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default AnalyticsChart;