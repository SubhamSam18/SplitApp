import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
function DashboardLayout({ children }) {
  return (
    <div className="main-layout" style={{ display: "flex" }}>
      <Navbar />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
