// frontend/src/pages/WorkerDashboard.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import WorkerNavbar from "../components/WorkerNavbar";

export default function WorkerDashboard() {
  const [me, setMe] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function fetchProfile() {
    try {
      const res = await api.get("/auth/profile");
      setMe(res.data);
    } catch (e) {
      console.error("Failed to load profile:", e);
    }
  }

  async function fetchRequests() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get("/postrequests/worker");
      setRows(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Error loading requests:", e);
      const msg = e?.response?.data?.message || "Failed to load requests";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchRequests();
  }, []);

  return (
    <div>
      <WorkerNavbar />

      {/* ✅ Greeting Section */}
      {me && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Hi {me.name}!
          </h2>
          <p style={{ fontSize: "1.1rem" }}>
            Category:{" "}
            <span style={{ textTransform: "capitalize" }}>
              {me.category || "-"}
            </span>
          </p>
        </div>
      )}

      {/* Keep your existing request box UI untouched */}
      <div style={{ padding: 20 }}>
        <h2>Available Requests</h2>

        {loading && <p>Loading...</p>}
        {err && <p style={{ color: "red" }}>{err}</p>}
        {!loading && !err && rows.length === 0 && (
          <p>No requests available at the moment.</p>
        )}

        {!loading &&
          !err &&
          rows.length > 0 &&
          rows.map((r) => (
            <div
              key={r._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                background: "#fff",
              }}
            >
              <p>
                <strong>Category:</strong> {r.category}
              </p>
              <p>
                <strong>Description:</strong> {r.description}
              </p>
              {r.customer && (
                <p>
                  <strong>Customer:</strong> {r.customer.name} (
                  {r.customer.email})
                </p>
              )}
              <p>
                <strong>Created:</strong>{" "}
                {new Date(r.createdAt).toLocaleString()}
              </p>
              {r.status === "pending" && (
                <button
                  onClick={async () => {
                    try {
                      await api.patch(`/postrequests/${r._id}/accept`);
                      fetchRequests();
                    } catch (e) {
                      console.error("Accept failed:", e);
                      alert("Failed to accept request");
                    }
                  }}
                  style={{
                    background: "black",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                >
                  Accept
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
