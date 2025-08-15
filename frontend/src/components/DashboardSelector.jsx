import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardSelector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.role) {
      navigate("/");
      return;
    }

    const role = String(user.role || "").toLowerCase();
    switch (role) {
      case "customer":
        navigate("/dashboard/customerdashboard");
        break;
      case "worker":
        navigate("/dashboard/workerdashboard");
        break;
      case "admin":
        navigate("/dashboard/admindashboard");
        break;
      default:
        navigate("/");
    }
  }, [navigate]);

  return (
    <div style={{ color: "#CFFFE2", padding: "2rem" }}>
      <h2>Loading your dashboard...</h2>
    </div>
  );
};

export default DashboardSelector;
