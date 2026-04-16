
import Sidebar from "../components/ Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right side */}
      <div className="flex-1 flex flex-col bg-gray-100">

        {/* Navbar (fixed top) */}
        <Navbar />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

      </div>

    </div>
  );
};

export default DashboardLayout;