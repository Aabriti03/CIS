import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./WorkerNavbar.css";

const WorkerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // Go to login
  };

  const goToProfile = () => {
    navigate("/dashboard/profile");
  };

  const goHome = () => {
    navigate("/dashboard/workerdashboard"); // ✅ matches App.jsx
  };

  const goToRequestHistory = () => {
    navigate("/dashboard/workerhistory"); // ✅ fixed route
  };

  return (
    <nav className="worker-navbar">
      <div className="nav-logo" onClick={goHome}>
        <img src={logo} alt="Logo" />
      </div>

      {/* Use CSS .nav-links for horizontal layout */}
      <ul className="nav-links">
        <li onClick={goHome}>Home</li>
        <li onClick={goToRequestHistory}>Request History</li>
        <li onClick={goToProfile}>Profile</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
};

export default WorkerNavbar;
