const RecentVideosTable = ({ videos }) => {
  if (!videos) return null;

  return (
    <div className="bg-white rounded-xl shadow mt-8 p-4">

      <h2 className="text-lg font-semibold mb-4">
        Recent Uploads
      </h2>

      <table className="w-full">

        <thead>
          <tr className="border-b">

            <th className="p-2 text-left">Video</th>
            <th className="p-2">Date</th>

          </tr>
        </thead>

        <tbody>

          {videos.map((v) => (

            <tr key={v.id} className="border-b">

              <td className="p-2 flex gap-3">

                <img
                  src={v.snippet.thumbnails.default.url}
                  className="w-20"
                />

                {v.snippet.title}

              </td>

              <td className="p-2">
                {v.snippet.publishedAt}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default RecentVideosTable;