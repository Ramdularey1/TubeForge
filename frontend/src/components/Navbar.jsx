const Navbar = () => {
  return (
    <div className="h-16 bg-gray-900 text-white flex justify-between items-center px-6">

      <h2 className="text-lg font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">

        <button className="bg-red-600 px-4 py-2 rounded">
          Upload
        </button>

        <img
          src="https://i.pravatar.cc/40"
          alt=""
          className="w-10 h-10 rounded-full"
        />

      </div>

    </div>
  );
};

export default Navbar;