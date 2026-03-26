// import Sidebar from "../components/Sidebar.jsx";
import Sidebar from "../components/ Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex-1 bg-gray-100 min-h-screen">

        <Navbar />

        <div className="p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;