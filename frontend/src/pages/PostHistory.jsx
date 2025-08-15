// frontend/src/pages/PostHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // ✅ use shared axios instance
import Navbar from "../components/Navbar";

export default function PostHistory() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await api.get("/postrequests");
        setRequests(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Error fetching post history:", e);
        if (e.response?.status === 401) {
          // Token invalid → logout
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [navigate]);

  return (
    <div style={{ backgroundColor: "#CFFFE2", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2 style={{ color: "black" }}>Your Post History</h2>

        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No post requests found.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "black", color: "#fff" }}>
                <th style={{ padding: 12, textAlign: "left" }}>Category</th>
                <th style={{ padding: 12, textAlign: "left" }}>Description</th>
                <th style={{ padding: 12, textAlign: "left" }}>Status</th>
                <th style={{ padding: 12, textAlign: "left" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 10 }}>{r.category}</td>
                  <td style={{ padding: 10 }}>{r.description}</td>
                  <td style={{ padding: 10, textTransform: "capitalize" }}>
                    {r.status}
                  </td>
                  <td style={{ padding: 10 }}>
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
