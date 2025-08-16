// frontend/src/pages/WorkerRequestHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function WorkerRequestHistory() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function fetchHistory() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/postrequests/accepted"); // ✅ backend route
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error loading worker history:", e);
      const msg = e?.response?.data?.message || "Failed to load history";
      setErr(msg);
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ backgroundColor: "#FFF8E1", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2 style={{ marginBottom: 16 }}>My Accepted Requests</h2>

        {loading ? (
          <p>Loading...</p>
        ) : err ? (
          <p style={{ color: "red" }}>{err}</p>
        ) : rows.length === 0 ? (
          <p>No accepted requests yet.</p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <thead>
              <tr style={{ background: "black", color: "#fff" }}>
                <th style={{ padding: 12, textAlign: "left" }}>Category</th>
                <th style={{ padding: 12, textAlign: "left" }}>Description</th>
                <th style={{ padding: 12, textAlign: "left" }}>Accepted At</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 10 }}>{r.category}</td>
                  <td style={{ padding: 10 }}>{r.description}</td>
                  <td style={{ padding: 10 }}>
                    {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : ""}
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
