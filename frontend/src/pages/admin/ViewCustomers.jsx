import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ViewCustomers = () => {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const { data } = await api.get("/admin/customers");
        if (live) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        if (live) setErr("Failed to load customers");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  const filtered = rows.filter((u) =>
    [u.name, u.email, u.phone].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  const fmt = (iso) => {
    try { return new Date(iso).toISOString().slice(0, 10); } catch { return "—"; }
  };

  return (
    <section className="admin-card">
      <h2 style={{ margin: "0 0 12px" }}>Customers</h2>

      <div style={{ margin: "0 0 12px" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, or phone…"
          style={{ padding: "10px 12px", width: "100%", borderRadius: 10, border: "1px solid #e5e7eb" }}
        />
      </div>

      {loading && <div>Loading…</div>}
      {err && !loading && <div style={{ color: "crimson" }}>{err}</div>}
      {!loading && !err && (
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ minWidth: 200 }}>Name</th>
                <th style={{ minWidth: 220 }}>Email</th>
                <th style={{ minWidth: 140 }}>Phone</th>
                <th style={{ minWidth: 140 }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>{u.name || "—"}</td>
                  <td>{u.email || "—"}</td>
                  <td>{u.phone || "—"}</td>
                  <td><span className="badge">{fmt(u.createdAt)}</span></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={4} style={{ color: "#6b7280" }}>No customers found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ViewCustomers;
