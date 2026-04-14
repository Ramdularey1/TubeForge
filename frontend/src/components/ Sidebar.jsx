import {
  Home,
  LayoutDashboard,
  Video,
  BarChart,
  Settings,
} from "lucide-react";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-black text-white h-screen p-5">

      <h1 className="text-2xl font-bold text-red-500 mb-8">
        TubeForge
      </h1>

      <nav className="space-y-4">

        <Link to="/dashboard" className="flex items-center gap-3 hover:text-red-500">
          <Home /> Home
        </Link>

        <Link to="/dashboard" className="flex items-center gap-3 hover:text-red-500">
          <LayoutDashboard /> Dashboard
        </Link>

        <Link to="/upload" className="flex items-center gap-3 hover:text-red-500">
          <Video /> Upload
        </Link>

        <Link to="/videos" className="flex items-center gap-3 hover:text-red-500">
          <Video /> My Videos
        </Link>

        <Link to="/thumbnail" className="flex items-center gap-3 hover:text-red-500">
          <Video /> Thumbnail AI
        </Link>
        <Link to="/my-thumbnails" className="flex items-center gap-3 hover:text-red-500">
          <Video /> My Thumbnails
        </Link>
        <Link to = "/my-videos" className="flex items-center gap-3 hover:text-red-500">
          <Video />Fetch Video
        </Link>

        

        <Link to="/analytics" className="flex items-center gap-3 hover:text-red-500">
          <BarChart /> Analytics
        </Link>

        <Link to="/settings" className="flex items-center gap-3 hover:text-red-500">
          <Settings /> Settings
        </Link>

      </nav>

    </div>
  );
};

export default Sidebar;