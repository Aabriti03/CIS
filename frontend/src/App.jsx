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
// Customer search removed for now
// import SearchResults from "./pages/SearchResults";
import ServiceWorkerList from "./pages/ServiceWorkerList";
import WorkerProfile from "./pages/WorkerProfile";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
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
        {/* Post History under dashboard */}
        <Route
          path="/dashboard/posthistory"
          element={
            <PrivateRoute>
              <PostHistory />
            </PrivateRoute>
          }
        />
        {/* Customer search disabled */}
        {/*
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchResults />
            </PrivateRoute>
          }
        />
        */}
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
        {/* ✅ Primary worker history route */}
        <Route
          path="/worker/requests"
          element={
            <PrivateRoute>
              <WorkerRequestHistory />
            </PrivateRoute>
          }
        />
        {/* ✅ Alias so /dashboard/workerhistory also works */}
        <Route
          path="/dashboard/workerhistory"
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
