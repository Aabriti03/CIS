import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";

const UserIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="#fff"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.418 0-8 3.134-8 7v1h16v-1c0-3.866-3.582-7-8-7z"/>
  </svg>
);

const proper = (slug) =>
  slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "";

export default function ServiceWorkerList() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const LIST_WORKERS_BY_CATEGORY_URL = (c) => `/users/workers/${c}`;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(LIST_WORKERS_BY_CATEGORY_URL(category));
        if (!alive) return;
        setWorkers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching workers:", error);
        if (!alive) return;
        setWorkers([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [category]);

  const handleSendRequest = async (workerIdRaw) => {
    const workerId = workerIdRaw || null;
    try {
      const payload = {
        workerId,
        category,
        description: `Request for ${proper(category)}`,
      };
      const res = await api.post("/postrequests", payload);
      alert(res?.data?.message || "Request sent successfully and saved to Post History.");
    } catch (error) {
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to send request.";
      alert(`Failed to send request: ${backendMsg}`);
      console.error("Send request error:", error);
    }
  };

  const pageStyle = { backgroundColor: "#F7FFF9", minHeight: "100vh" };
  const headerWrap = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  };
  const backBtn = {
    all: "unset",
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#111",
    fontSize: 13,
    cursor: "pointer",
  };
  const gridStyle = {
    display: "grid",
    gap: 24, // more gap between profiles
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  };
  const card = {
    background: "#000",
    color: "#fff",
    borderRadius: 14,
    padding: 16,
    minHeight: 140, // smaller height
    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
  };
  const rowTop = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  };
  const nameStyle = { fontWeight: 800, fontSize: 18 }; // bigger font
  const small = { fontSize: 14, opacity: 0.9, lineHeight: 1.3 };

  return (
    <div style={pageStyle}>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <div style={headerWrap}>
          <h1 className="text-2xl font-bold">
            Available Workers for {proper(category)}
          </h1>
          <button type="button" onClick={() => navigate(-1)} style={backBtn}>
            ← Back
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : workers.length === 0 ? (
          <p className="text-gray-600">No workers found for {proper(category)}.</p>
        ) : (
          <div style={gridStyle}>
            {workers.map((w) => {
              const workerId = w?._id || w?.id;
              return (
                <div key={workerId}>
                  <div style={card}>
                    <div style={rowTop}>
                      <UserIcon size={18} />
                      <h3 style={nameStyle}>{w?.name || "-"}</h3>
                    </div>
                    {w?.email && <p style={small}>{w.email}</p>}
                    {w?.phone && <p style={small}>{w.phone}</p>}
                    <p style={small}>Category: {w?.category || proper(category)}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSendRequest(workerId)}
                    style={{
                      display: "block",
                      margin: "10px auto 0",
                      padding: "6px 14px",
                      borderRadius: 8,
                      background: "#166534", // darker green
                      color: "#fff",
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    Send Request
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
