import { useNavigate } from "react-router-dom";


const VideoCard = ({ video }) => {
  const snippet = video.snippet;

  const navigate = useNavigate();

  const videoId =
    video?.contentDetails?.videoId;

 

  return (
    
    <div
      
      className="bg-white rounded-xl shadow hover:shadow-lg hover:scale-105 transition "
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
        className="mt-2 text-xs cursor-pointer  bg-red-500 text-white px-2 py-2 rounded"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/analytics/${videoId}`);
          }}
         
        >
          View Analytics
        </button>

      </div>
    </div>
  );
};

export default VideoCard;