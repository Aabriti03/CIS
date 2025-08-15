import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";

/* Match your Customer Dashboard categories exactly */
const CATEGORIES = [
  { key: "babysitting", label: "Babysitting" },
  { key: "electric", label: "Electric" },
  { key: "gardening", label: "Gardening" },
  { key: "househelp", label: "House Help" },
  { key: "plumbing", label: "Plumbing" },
];

const ViewWorkers = () => {
  const [activeKey, setActiveKey] = useState(CATEGORIES[0].key);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    setLoading(true);
    setErr("");
    (async () => {
      try {
        // Uses your existing workers-by-category API
        const { data } = await api.get(`/users/workers/${encodeURIComponent(activeKey)}`);
        if (live) setWorkers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (live) setErr("Failed to load workers");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [activeKey]);

  const activeLabel = useMemo(
    () => CATEGORIES.find(c => c.key === activeKey)?.label || "Workers",
    [activeKey]
  );

  return (
    <section className="admin-card">
      <h2 style={{ margin: "0 0 12px" }}>Worker Profiles</h2>

      <div className="grid" style={{ marginBottom: 16 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className="tile"
            onClick={() => setActiveKey(c.key)}
            style={{ textAlign: "left", border: activeKey === c.key ? "2px solid #16a34a" : undefined }}
          >
            <h4 style={{ marginBottom: 4 }}>{c.label}</h4>
            <p>View profiles</p>
          </button>
        ))}
      </div>

      <h3 style={{ margin: "6px 0 10px" }}>{activeLabel}</h3>
      {loading && <div>Loading…</div>}
      {err && !loading && <div style={{ color: "crimson" }}>{err}</div>}
      {!loading && !err && (
        <div className="grid">
          {workers.map((w) => (
            <article key={w._id || w.id} className="tile">
              <h4>{w.name}</h4>
              <p style={{ margin: "6px 0" }}><span className="badge">Phone: {w.phone || "—"}</span></p>
              <p>Category: {w.category}</p>
              <p>City: {w.address || "—"}</p>
              {/* No Send Request button */}
            </article>
          ))}
          {workers.length === 0 && <div style={{ color: "#6b7280" }}>No workers in this category.</div>}
        </div>
      )}
    </section>
  );
};

export default ViewWorkers;
