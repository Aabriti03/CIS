// frontend/src/pages/WorkerRequestHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // ✅ use shared axios instance
import WorkerNavbar from "../components/WorkerNavbar";

const WorkerRequestHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/postrequests/worker/accepted");
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching request history:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  return (
    <div style={{ backgroundColor: "#CFFFE2", minHeight: "100vh", padding: "20px" }}>
      <WorkerNavbar />
      <h2>Your Accepted Requests</h2>
      {loading ? (
        <p>Loading...</p>
      ) : history.length === 0 ? (
        <p>No accepted requests found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#98ff98" }}>
              <th style={{ padding: "10px", border: "1px solid #000" }}>Category</th>
              <th style={{ padding: "10px", border: "1px solid #000" }}>Description</th>
              <th style={{ padding: "10px", border: "1px solid #000" }}>Status</th>
              <th style={{ padding: "10px", border: "1px solid #000" }}>Date Accepted</th>
            </tr>
          </thead>
          <tbody>
            {history.map((req) => (
              <tr key={req._id}>
                <td style={{ padding: "10px", border: "1px solid #000" }}>
                  {req.category
                    ? req.category.charAt(0).toUpperCase() + req.category.slice(1)
                    : ""}
                </td>
                <td style={{ padding: "10px", border: "1px solid #000" }}>
                  {req.description || ""}
                </td>
                <td style={{ padding: "10px", border: "1px solid #000" }}>
                  {req.status
                    ? req.status.charAt(0).toUpperCase() + req.status.slice(1)
                    : ""}
                </td>
                <td style={{ padding: "10px", border: "1px solid #000" }}>
                  {req.updatedAt ? new Date(req.updatedAt).toLocaleString() : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WorkerRequestHistory;
