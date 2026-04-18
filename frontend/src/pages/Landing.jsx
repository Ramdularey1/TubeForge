
import React from "react";

const Landing = () => {
  const handleLogin = () => {
    window.location.href = "https://tubeforge-lhg4.onrender.com/auth/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-gray-900 text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-0">
        <div className="absolute top-20 left-10 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-56 w-56 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-6 md:px-10 lg:px-16">
        <h1 className="text-xl font-bold tracking-wide text-red-500 sm:text-2xl">
          TubeForge
        </h1>

        <button
          onClick={handleLogin}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium backdrop-blur-md transition hover:bg-white/10 sm:px-5 sm:py-2.5 sm:text-base"
        >
          Login with Google
        </button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1 text-xs font-medium text-red-300 sm:text-sm">
            AI-powered YouTube creation workflow
          </div>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Create Stunning
            <span className="block bg-gradient-to-r from-red-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              YouTube Videos Faster
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base md:text-lg">
            Generate thumbnails, edit videos, and upload to YouTube from one
            clean workflow designed for creators.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-red-600 px-6 py-3 font-semibold transition hover:scale-[1.02] hover:bg-red-500 sm:w-auto"
            >
              Get Started
            </button>

            <button className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold backdrop-blur-md transition hover:bg-white/10 sm:w-auto">
              Explore Features
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <h3 className="text-base font-semibold">Thumbnail Generator</h3>
              <p className="mt-2 text-sm text-gray-400">
                Create eye-catching thumbnails for better clicks.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <h3 className="text-base font-semibold">Video Editing</h3>
              <p className="mt-2 text-sm text-gray-400">
                Edit and polish your content in one place.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <h3 className="text-base font-semibold">One-click Upload</h3>
              <p className="mt-2 text-sm text-gray-400">
                Publish directly to YouTube with less effort.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;