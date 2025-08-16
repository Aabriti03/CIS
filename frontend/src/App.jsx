// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import Register from "./components/Register";

import CustomerDashboard from "./pages/CustomerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PostHistory from "./pages/PostHistory";
import WorkerRequestHistory from "./pages/WorkerRequestHistory";
import Profile from "./pages/Profile";
import ServiceWorkerList from "./pages/ServiceWorkerList";
import WorkerProfile from "./pages/WorkerProfile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route
          path="/dashboard/customerdashboard/*"
          element={
            <PrivateRoute>
              <CustomerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/posthistory"
          element={
            <PrivateRoute>
              <PostHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/service-workers"
          element={
            <PrivateRoute>
              <ServiceWorkerList />
            </PrivateRoute>
          }
        />

        {/* Worker */}
        <Route
          path="/dashboard/workerdashboard/*"
          element={
            <PrivateRoute>
              <WorkerDashboard />
            </PrivateRoute>
          }
        />
        {/* Canonical worker history */}
        <Route
          path="/worker/requests"
          element={
            <PrivateRoute>
              <WorkerRequestHistory />
            </PrivateRoute>
          }
        />
        {/* Alias to avoid blank page if anything still points here */}
        <Route
          path="/dashboard/workerrequesthistory"
          element={
            <PrivateRoute>
              <WorkerRequestHistory />
            </PrivateRoute>
          }
        />

        <Route
          path="/worker/:id"
          element={
            <PrivateRoute>
              <WorkerProfile />
            </PrivateRoute>
          }
        />

        {/* Profile (works for any role) */}
        <Route
          path="/dashboard/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/dashboard/admindashboard/*"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
