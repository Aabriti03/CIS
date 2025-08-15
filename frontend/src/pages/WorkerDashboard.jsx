import React, { useEffect, useState } from "react";
import api from '../api/api';
import WorkerNavbar from "../components/WorkerNavbar";
import "../components/WorkerDashboard.css";

const WorkerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ Only New Requests stat now
  const [stats, setStats] = useState({
    newRequests: 0,
  });

  const computeStatsFrom = (list) => {
    const newCount = list.filter((r) => r.status === "pending").length;
    return { newRequests: newCount };
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/postrequests/worker`);

        { headers: { Authorization: `Bearer ${token}` } }
      
      const serverList = res.data || [];
      setRequests(serverList);
      setStats(computeStatsFrom(serverList));
    } catch (error) {
      console.error("Error fetching worker requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (requestId, status) => {
    if (!requestId || !status) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/postrequests/${requestId}`, { status });

        { headers: { Authorization: `Bearer ${token}` } }
      await fetchRequests();
    } catch (error) {
      console.error(`Error updating request status to ${status}:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="worker-dashboard">
      <WorkerNavbar />

      {/* ✅ Mint green background below navbar */}
      <div style={{ backgroundColor: "#CFFFE2", minHeight: "100vh" }}>
        {/* Quick Stats (New Requests only) */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>{stats.newRequests}</h3>
            <p>New Requests</p>
          </div>
        </div>

        {/* Requests Section */}
        <div className="requests-container">
          <h2>Requests in Your Category</h2>

          {loading ? (
            <p>Loading requests...</p>
          ) : requests.length === 0 ? (
            <p>No service requests available in your category.</p>
          ) : (
            <div className="request-cards">
              {requests.map((req) => (
                <div key={req._id} className="request-card">
                  <h3>
                    {req.category
                      ? req.category.charAt(0).toUpperCase() +
                        req.category.slice(1)
                      : "Request"}
                  </h3>
                  <p>{req.description}</p>
                  <p>
                    Status:{" "}
                    {req.status
                      ? req.status.charAt(0).toUpperCase() +
                        req.status.slice(1)
                      : "—"}
                  </p>
                  <p>
                    Date:{" "}
                    {req.createdAt
                      ? new Date(req.createdAt).toLocaleString()
                      : "—"}
                  </p>
                  {req.status === "pending" && (
                    <div>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleAction(req._id, "accepted")}
                        style={{ marginRight: "10px" }}
                      >
                        Accept
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleAction(req._id, "declined")}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
