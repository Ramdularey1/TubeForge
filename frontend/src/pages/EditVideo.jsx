import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const EditVideo = () => {
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const [trimmedVideo, setTrimmedVideo] = useState(null);

  const [videos, setVideos] = useState([]);
  const [mergePreview, setMergePreview] = useState(null);
  const [mergedVideo, setMergedVideo] = useState(null);

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);
  const [speed, setSpeed] = useState(1);

  const [trimLoading, setTrimLoading] = useState(false);
  const [speedLoading, setSpeedLoading] = useState(false);
  const [mergeLoading, setMergeLoading] = useState(false);

  const navigate = useNavigate();

  // Load selected video
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("editVideo"));

    if (stored) {
      setSelectedVideo(stored);

      const url =
        "https://tubeforge-lhg4.onrender.com" +
        stored.videoUrl +
        "?t=" +
        Date.now();

      setPreview(url);
    }
  }, []);

  // Select video
  const handleSelect = (e) => {
    const file = e.target.files[0];

    setVideo(file);
    setPreview(URL.createObjectURL(file));

    setSelectedVideo(null);
    setTrimmedVideo(null);
  };

  // Multi select
  const handleMultiSelect = (e) => {
    setVideos([...e.target.files]);
  };

  // Trim
  const handleTrim = async () => {
    try {
      if (!video && !selectedVideo && !trimmedVideo) {
        alert("Select video first");
        return;
      }

      if (Number(end) <= Number(start)) {
        alert("Invalid range");
        return;
      }

      setTrimLoading(true);

      const formData = new FormData();

      if (video) formData.append("video", video);
      else if (trimmedVideo) formData.append("videoPath", trimmedVideo);
      else formData.append("videoPath", selectedVideo.videoUrl);

      formData.append("start", start);
      formData.append("end", end);

      const res = await API.post("/youtube/video/edit", formData);

      const newVideo = res.data.videoPath;

      const url =
        "https://tubeforge-lhg4.onrender.com" + newVideo + "?t=" + Date.now();

      setTrimmedVideo(newVideo);
      setPreview(url);

      setVideo(null);
      setSelectedVideo(null);

      alert("Trim applied ✅");

    } catch (err) {
      console.log(err);
      alert("Trim failed");
    } finally {
      setTrimLoading(false);
    }
  };

  // Speed
  const handleSpeed = async () => {
    try {
      if (!video && !trimmedVideo && !selectedVideo) {
        alert("Select video first");
        return;
      }

      setSpeedLoading(true);

      const formData = new FormData();

      if (video) formData.append("video", video);
      else if (trimmedVideo) formData.append("videoPath", trimmedVideo);
      else formData.append("videoPath", selectedVideo.videoUrl);

      formData.append("speed", speed);

      const res = await API.post("/youtube/video/speed", formData);

      const newVideo = res.data.videoPath;

      const url =
        "https://tubeforge-lhg4.onrender.com" + newVideo + "?t=" + Date.now();

      setTrimmedVideo(newVideo);
      setPreview(url);

      setVideo(null);
      setSelectedVideo(null);

      alert("Speed applied ✅");

    } catch (err) {
      console.log(err);
      alert("Speed failed");
    } finally {
      setSpeedLoading(false);
    }
  };



  const handleMerge = async () => {
  try {
    if (videos.length < 2) {
      alert("Select at least 2 videos");
      return;
    }

    setMergeLoading(true);

    const formData = new FormData();

    videos.forEach((v) => {
      formData.append("videos", v);
    });

    const res = await API.post("/youtube/video/merge", formData);

    const newVideo = res.data.videoPath;

    const url =
      "https://tubeforge-lhg4.onrender.com" + newVideo + "?t=" + Date.now();

    setMergePreview(url);
    setMergedVideo(newVideo); // ✅ FIX

    alert("Merged successfully ✅");

  } catch (err) {
    console.log(err);
    alert("Merge failed");
  } finally {
    setMergeLoading(false);
  }
};







  const handleSave = async () => {
  try {
    let videoToSave = null;
    let title = "";

    // 🔥 First priority → merged video
    if (mergedVideo) {
      videoToSave = mergedVideo;
      title = "Merged Video";
    }

    // 🔥 Otherwise → trimmed/speed video
    else if (trimmedVideo) {
      videoToSave = trimmedVideo;
      title = "Edited Video";
    }

    else {
      alert("No video to save");
      return;
    }

    await API.post("/youtube/save-video", {
      videoPath: videoToSave,
      title,
    });

    alert("Saved successfully ✅");
    navigate("/my-videos");

  } catch (err) {
    console.log(err);
    alert("Save failed");
  }
};



  return (
    <>
    <h1>Comming soon</h1>
    </>
    // <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">

    //   <h1 className="text-xl md:text-2xl font-bold text-center">
    //     Video Editor 🚀
    //   </h1>

    //   {/* GRID */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    //     {/* TRIM + SPEED */}
    //     <div className="border p-4 rounded shadow-sm">

    //       <h2 className="font-semibold text-lg mb-2">
    //         Trim & Speed
    //       </h2>

    //       <input type="file" onChange={handleSelect} />

    //       {preview && (
    //         <video
    //           key={preview}
    //           controls
    //           className="w-full max-w-md mx-auto mt-4 rounded"
    //         >
    //           <source src={preview} />
    //         </video>
    //       )}

    //       <div className="mt-4 space-y-2">
    //         <div>
    //           <label className="text-sm">Start: {start}s</label>
    //           <input
    //             type="range"
    //             min="0"
    //             max="100"
    //             value={start}
    //             onChange={(e) => setStart(e.target.value)}
    //             className="w-full"
    //           />
    //         </div>

    //         <div>
    //           <label className="text-sm">End: {end}s</label>
    //           <input
    //             type="range"
    //             min="0"
    //             max="100"
    //             value={end}
    //             onChange={(e) => setEnd(e.target.value)}
    //             className="w-full"
    //           />
    //         </div>
    //       </div>

    //       <button
    //         onClick={handleTrim}
    //         disabled={trimLoading}
    //         className="bg-green-600 text-white px-4 py-2 mt-4 rounded w-full"
    //       >
    //         {trimLoading ? "Trimming..." : "Trim Video"}
    //       </button>

    //       <div className="mt-4">
    //         <select
    //           value={speed}
    //           onChange={(e) => setSpeed(e.target.value)}
    //           className="border p-2 w-full rounded"
    //         >
    //           <option value={0.5}>0.5x</option>
    //           <option value={1}>1x</option>
    //           <option value={2}>2x</option>
    //         </select>

    //         <button
    //           onClick={handleSpeed}
    //           disabled={speedLoading}
    //           className="bg-yellow-600 text-white px-4 py-2 mt-2 rounded w-full"
    //         >
    //           {speedLoading ? "Applying Speed..." : "Apply Speed"}
    //         </button>
    //       </div>

    //       {trimmedVideo && (
    //         <button
    //           onClick={handleSave}
    //           className="bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full"
    //         >
    //           Save Video
    //         </button>
    //       )}

    //     </div>

    //     {/* MERGE */}
    //     <div className="border p-4 rounded shadow-sm">

    //       <h2 className="font-semibold text-lg mb-2">
    //         Merge Videos
    //       </h2>

    //       <input type="file" multiple onChange={handleMultiSelect} />

    //       {videos.length > 0 && (
    //         <p className="text-sm text-gray-600 mt-2">
    //           {videos.length} video(s) selected
    //         </p>
    //       )}

    //       {videos.length === 1 && (
    //         <p className="text-red-500 text-sm">
    //           Select at least 2 videos
    //         </p>
    //       )}

    //       <button
    //         onClick={handleMerge}
    //         disabled={videos.length < 2 || mergeLoading}
    //         className={`px-4 py-2 mt-3 rounded w-full ${
    //           videos.length < 2 || mergeLoading
    //             ? "bg-gray-400"
    //             : "bg-purple-600 text-white"
    //         }`}
    //       >
    //         {mergeLoading ? "Merging..." : "Merge Videos"}
    //       </button>

    //       {mergePreview && (
    //         <video
    //           key={mergePreview}
    //           controls
    //           className="w-full max-w-md mx-auto mt-4 rounded"
    //         >
    //           <source src={mergePreview} />
    //         </video>
    //       )}

    //         {mergePreview && (
    //         <button
    //           onClick={handleSave}
    //           className="bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full"
    //         >
    //           Save Video
    //         </button>
    //       )}

    //     </div>

    //   </div>

    // </div>
  );
};

export default EditVideo;



