
import DashboardLayout from "../layouts/DashboardLayout";
import { useState } from "react";
import API from "../api/axios";

const Thumbnail = () => {
  const [thumbnailTitle, setThumbnailTitle] = useState("");
  const [videoTitle, setVideoTitle] = useState("");

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);

  const [saved, setSaved] = useState(false);

  const generateThumbnail = async () => {
    if (!thumbnailTitle) {
      alert("Please enter thumbnail title");
      return;
    }

    try {
      setLoading(true);
      setSaved(false);

      const res = await API.post(
        "/youtube/generate-thumbnail",
        { title: thumbnailTitle }
      );

      setImage("http://localhost:8000" + res.data.thumbnailPath);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const saveThumbnail = async () => {
    try {
      setSaving(true);

      await API.post("/youtube/save-thumbnail", {
        title: thumbnailTitle,
        imageUrl: image.replace("http://localhost:8000", ""),
      });

      setSaved(true);
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const saveVideo = async () => {
    if (!video) return alert("Please select a video");
    if (!videoTitle) return alert("Please enter video title");

    try {
      setSavingVideo(true);

      const formData = new FormData();
      formData.append("video", video);
      formData.append("title", videoTitle);
      formData.append("description", videoTitle);

      await API.post("/youtube/save-video", formData);

      alert("Video saved ✅");
      setVideo(null);
      setVideoTitle("");
    } catch (err) {
      console.log(err);
    } finally {
      setSavingVideo(false);
    }
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = image;
    link.download = "thumbnail.png";
    link.click();
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            AI Thumbnail Generator
          </h1>
          <p className="text-sm text-zinc-400">
            Generate thumbnails & save videos
          </p>
        </div>

        {/* 🔥 Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">

            <h2 className="font-semibold text-lg">
              Generate Thumbnail
            </h2>

            <input
              type="text"
              placeholder="Enter thumbnail title"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-red-500"
              value={thumbnailTitle}
              onChange={(e) => setThumbnailTitle(e.target.value)}
            />

            <button
              onClick={generateThumbnail}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-500 py-2 rounded-xl transition"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            {image && (
              <div className="space-y-4">

                <img
                  src={image}
                  alt="thumbnail"
                  className="w-full rounded-xl"
                />

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={downloadImage}
                    className="bg-blue-500 hover:bg-blue-400 py-2 rounded-xl"
                  >
                    Download
                  </button>

                  <button
                    onClick={saveThumbnail}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-500 py-2 rounded-xl"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>

                {saved && (
                  <p className="text-green-500 text-sm">
                    Saved successfully ✅
                  </p>
                )}

              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-zinc-900/60 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">

            <h2 className="font-semibold text-lg">
              Save Video
            </h2>

            <input
              type="text"
              placeholder="Enter video title"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
            />

            <input
              type="file"
              className="w-full text-sm"
              onChange={(e) => setVideo(e.target.files[0])}
            />

            <button
              onClick={saveVideo}
              disabled={!video || savingVideo}
              className="w-full bg-purple-600 hover:bg-purple-500 py-2 rounded-xl"
            >
              {savingVideo ? "Saving..." : "Save Video"}
            </button>

            <p className="text-xs text-zinc-400">
              Title is required before saving.
            </p>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default Thumbnail;