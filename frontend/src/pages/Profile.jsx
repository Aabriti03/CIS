// frontend/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";            // customer navbar
import WorkerNavbar from "../components/WorkerNavbar"; // worker navbar

export default function Profile() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get("/auth/profile")
      .then((res) => {
        if (mounted) setData(res.data);
      })
      .catch((e) => {
        const msg =
          e?.response?.data?.message || e.message || "Failed to load profile";
        if (mounted) setErr(msg);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (!data) return null;

  const cardStyle = {
    background: "#000",
    color: "#fff",
    borderRadius: 12,
    padding: "18px 20px",
    maxWidth: "380px",
    margin: "16px auto", // leave space under navbar
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  };
  const rowStyle = { marginBottom: "10px", display: "flex", alignItems: "baseline" };
  const labelStyle = { color: "#fff", fontWeight: 700, marginRight: 8, opacity: 0.9, minWidth: 86 };
  const valueStyle = { color: "#fff", display: "inline-block", wordBreak: "break-word", flex: 1 };

  return (
    <>
      {/* Keep the navbar visible based on role */}
      {data.role === "worker" ? <WorkerNavbar /> : <Navbar />}

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: "#000" }}>
          My Profile
        </h2>

        <div style={cardStyle}>
          <div style={rowStyle}>
            <span style={labelStyle}>Name:</span>
            <span style={valueStyle}>{data.name}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Email:</span>
            <span style={valueStyle}>{data.email}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Phone:</span>
            <span style={valueStyle}>{data.phone}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Role:</span>
            <span style={valueStyle} className="capitalize">
              {data.role}
            </span>
          </div>

          {data.role === "worker" && (
            <div style={rowStyle}>
              <span style={labelStyle}>Category:</span>
              <span style={valueStyle} className="capitalize">
                {data.category || "-"}
              </span>
            </div>
          )}

          <div style={{ ...rowStyle, marginBottom: 0 }}>
            <span style={labelStyle}>Joined:</span>
            <span style={valueStyle}>
              {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
