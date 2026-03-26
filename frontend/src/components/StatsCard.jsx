import { Eye, Users, MessageCircle, Video } from "lucide-react";

const icons = {
  views: <Eye size={28} />,
  subs: <Users size={28} />,
  comments: <MessageCircle size={28} />,
  videos: <Video size={28} />,
};

const colors = {
  views: "from-red-500 to-pink-500",
  subs: "from-blue-500 to-cyan-500",
  comments: "from-yellow-500 to-orange-500",
  videos: "from-green-500 to-emerald-500",
};

const StatsCard = ({ title, value, type }) => {
  return (
    <div
      className={`bg-gradient-to-r ${colors[type]} text-white p-6 rounded-xl shadow-lg hover:scale-105 transition duration-200`}
    >
      <div className="flex justify-between items-center">

        <div>
          <p className="text-sm">{title}</p>

          <h2 className="text-2xl font-bold">
            {value}
          </h2>
        </div>

        <div>
          {icons[type]}
        </div>

      </div>
    </div>
  );
};

export default StatsCard;