// frontend/src/pages/WorkerRequestHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import WorkerNavbar from "../components/WorkerNavbar";

export default function WorkerRequestHistory() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function fetchHistory() {
    setLoading(true);
    setErr("");
    try {
      // ✅ Fetch accepted requests for this worker
      const res = await api.get("/postrequests/accepted");
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
  }, []);

  return (
    <div>
      <WorkerNavbar />
      <div style={{ padding: 20 }}>
        <h2>Request History (Accepted)</h2>

        {loading && <p>Loading...</p>}
        {err && <p style={{ color: "red" }}>{err}</p>}

        {!loading && !err && rows.length === 0 && (
          <p>No accepted requests yet.</p>
        )}

        {!loading && !err && rows.length > 0 && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              background: "#fff", // <- white card like Post History
              color: "#000",
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
