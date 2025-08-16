// frontend/src/components/WorkerNavbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "./WorkerNavbar.css";

const WorkerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // back to login
  };

  const goHome = () => {
    navigate("/dashboard/workerdashboard"); // worker home
  };

  const goToRequestHistory = () => {
    navigate("/worker/requests"); // canonical worker history route
  };

  const goToProfile = () => {
    navigate("/dashboard/profile"); // <-- FIX: this route actually exists
  };

  return (
    <nav className="worker-navbar">
      <div className="nav-logo" onClick={goHome}>
        <img src={logo} alt="Logo" />
      </div>

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
