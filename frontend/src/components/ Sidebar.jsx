import {
  LayoutDashboard,
  Upload,
  Youtube,
  Image,
  Images,
  Clapperboard,
} from "lucide-react";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-black text-white h-screen p-5">

      <h1 className="text-2xl font-bold text-red-500 mb-8">
        TubeForge
      </h1>

      <nav className="space-y-6">

        <Link to="/dashboard" className="flex items-center gap-3 hover:text-red-500 transition">
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link to="/upload" className="flex items-center gap-3 hover:text-red-500 transition">
          <Upload size={20} />
          Upload Your Video
        </Link>

        <Link to="/videos" className="flex items-center gap-3 hover:text-red-500 transition">
          <Youtube size={20} />
          My YouTube Videos
        </Link>

        <Link to="/thumbnail" className="flex items-center gap-3 hover:text-red-500 transition">
          <Image size={20} />
          Thumbnail AI
        </Link>

        <Link to="/my-thumbnails" className="flex items-center gap-3 hover:text-red-500 transition">
          <Images size={20} />
          My Thumbnails
        </Link>

        <Link to="/my-videos" className="flex items-center gap-3 hover:text-red-500 transition">
          <Clapperboard size={20} />
          Recorded Videos
        </Link>

      </nav>

    </div>
  );
};

export default Sidebar;