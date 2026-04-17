import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ Fetch user using cookies
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/auth/get-user",
        {
          withCredentials: true, // ✅ important for cookies
        }
      );

      setUser(res.data);
      console.log("User:", res.data);
    } catch (err) {
      console.log("Fetch user error:", err);
    }
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Logout (clear cookie from backend)
 const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:8000/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    // ✅ clear user state (instant UI update)
    setUser(null);

    // ✅ redirect cleanly
    window.location.replace("/");

  } catch (err) {
    console.error("Logout error:", err);

    // ✅ fallback (even if API fails, still logout UI)
    setUser(null);
    window.location.replace("/");
  }
};

  return (
    <div className="h-16 bg-gray-900 text-white flex justify-between items-center px-6">
      
      <h2 className="text-lg font-semibold">TubeForge</h2>

      <div className="relative" ref={dropdownRef}>
        
        {/* Profile Image */}
        <img
          src={user?.picture || "https://i.pravatar.cc/40"}
          alt="profile"
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full cursor-pointer"
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-3 w-56 bg-white text-black rounded-lg shadow-lg overflow-hidden">
            
            <div className="px-4 py-3 border-b">
              <p className="font-medium">{user?.name || "Guest"}</p>
              <p className="text-sm text-gray-500">
                {user?.email || "Not logged in"}
              </p>
            </div>

           

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;