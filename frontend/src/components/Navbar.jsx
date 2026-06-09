import { useState, useEffect, useRef } from "react";
import API from "../api/axios";

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
      if (localStorage.getItem("tubeforge_guest") === "true") {
        const guestEmail =
          localStorage.getItem("tubeforge_guest_email") ||
          "guest@tubeforge.demo";

        setUser({
          name: "Guest Creator",
          email: guestEmail,
          picture: "https://i.pravatar.cc/80?img=12",
        });
        return;
      }

      const res = await API.get("/auth/get-user");

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
    localStorage.removeItem("tubeforge_guest");
    localStorage.removeItem("tubeforge_guest_email");
    await API.post("/auth/logout");

    // ✅ clear user state (instant UI update)
    setUser(null);

    // ✅ redirect cleanly
    window.location.replace("/");

  } catch (err) {
    console.error("Logout error:", err);

    // ✅ fallback (even if API fails, still logout UI)
    localStorage.removeItem("tubeforge_guest");
    localStorage.removeItem("tubeforge_guest_email");
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
