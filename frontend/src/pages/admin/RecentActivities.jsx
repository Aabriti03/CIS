import React, { useEffect, useState } from "react";
import api from "../../api/api";

const RecentActivities = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const { data } = await api.get("/admin/recent-activities");
        if (live) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (live) setErr("Failed to load activities");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  return (
    <section className="admin-card">
      <h2 style={{ margin: "0 0 12px 0" }}>Recent Activities</h2>
      {loading && <div>Loading…</div>}
      {err && !loading && <div style={{ color: "crimson" }}>{err}</div>}
      {!loading && !err && (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ minWidth: 140 }}>Date & Time</th>
                <th>Activity</th>
                <th style={{ minWidth: 120 }}>User / Request ID</th>
                <th style={{ minWidth: 100 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.ts}</td>
                  <td>{r.activity}</td>
                  <td>{r.ref}</td>
                  <td><span className="badge">{r.status}</span></td>
                </tr>
              ))}
              {rows.length === 0 && <tr><td colSpan={4} style={{ color: "#6b7280" }}>No recent activity.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentActivities;
