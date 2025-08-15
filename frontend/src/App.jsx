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
import SearchResults from "./pages/SearchResults";
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
        <Route
          path="/post-history"
          element={
            <PrivateRoute>
              <PostHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchResults />
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
        <Route
          path="/worker/requests"
          element={
            <PrivateRoute>
              <WorkerRequestHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/worker/:workerId"
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
