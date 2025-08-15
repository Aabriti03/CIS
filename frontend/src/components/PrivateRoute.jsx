// frontend/src/components/PrivateRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  let user = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") user = JSON.parse(stored);
  } catch (err) {
    console.error("❌ Failed to parse user from localStorage:", err);
  }

  const token = localStorage.getItem("token");

  // Require BOTH a token and a user to allow access
  if (!token || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
