import React from "react";

const Landing = () => {

  const handleLogin = () => {
    window.location.href =
      "http://localhost:8000/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white">

      {/* Navbar */}

      <nav className="flex justify-between px-10 py-4">

        <h1 className="text-2xl font-bold text-red-500">
          TubeForge
        </h1>

        <div className="space-x-4">

          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-gray-800 rounded"
          >
            Login with Google
          </button>

        </div>

      </nav>

      {/* Hero */}

      <div className="text-center mt-20">

        <h1 className="text-5xl font-bold">
          Create Stunning YouTube Videos
        </h1>

        <p className="mt-4 text-gray-300">
          Generate thumbnail, edit video and upload to YouTube in one click
        </p>

        <button
          onClick={handleLogin}
          className="mt-6 px-6 py-3 bg-red-600 rounded"
        >
          Get Started
        </button>

      </div>

    </div>
  );
};

export default Landing;