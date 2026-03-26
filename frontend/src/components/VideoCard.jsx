import { useNavigate } from "react-router-dom";

const VideoCard = ({ video }) => {
  const snippet = video.snippet;

  const navigate = useNavigate();

  const videoId =
    video?.contentDetails?.videoId;

  const handleClick = () => {
    navigate(`/analytics/${videoId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow hover:shadow-lg hover:scale-105 transition cursor-pointer"
    >
      {/* Thumbnail */}

      <img
        src={snippet.thumbnails.medium.url}
        className="w-full h-40 object-cover rounded-t-xl"
      />

      {/* Info */}

      <div className="p-3">

        <h2 className="font-semibold text-sm">
          {snippet.title}
        </h2>

        <p className="text-xs text-gray-500 mt-1">
          {new Date(
            snippet.publishedAt
          ).toLocaleDateString()}
        </p>

        {/* Button */}

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/analytics/${videoId}`);
          }}
          className="mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded"
        >
          View Analytics
        </button>

      </div>
    </div>
  );
};

export default VideoCard;