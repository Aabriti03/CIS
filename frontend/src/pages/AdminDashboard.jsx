import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import RecentActivities from "./admin/RecentActivities";
import ViewCustomers from "./admin/ViewCustomers";
import ViewWorkers from "./admin/ViewWorkers";
import "./admin/admin.css";
import logo from "../assets/logo.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="admin-root">
      <div className="admin-body">
        <aside className="admin-sidebar">
          <div className="brand-vertical">
            <img src={logo} alt="Logo" className="logo" />
            <span className="brand-text">Admin Panel</span>
          </div>

          <nav className="admin-nav">
            <NavLink end to="" className={({ isActive }) => "nav-item-vertical" + (isActive ? " active" : "")}>
              Recent Activities
            </NavLink>
            <NavLink to="customers" className={({ isActive }) => "nav-item-vertical" + (isActive ? " active" : "")}>
              View Customer Profiles
            </NavLink>
            <NavLink to="workers" className={({ isActive }) => "nav-item-vertical" + (isActive ? " active" : "")}>
              View Worker Profiles
            </NavLink>
            <button className="nav-item-vertical logout" onClick={logout}>Logout</button>
          </nav>
        </aside>

        <main className="admin-content">
          <Routes>
            <Route index element={<RecentActivities />} />
            <Route path="customers" element={<ViewCustomers />} />
            <Route path="workers" element={<ViewWorkers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
