import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/admin/recent-activities", {
          signal: controller.signal,
        });
        if (active) {
          setActivities(res.data || []);
        }
      } catch (err) {
        if (active) setError("Failed to load activities");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchActivities();
    return () => {
      active = false;
      controller.abort();
    };
  }, [location.pathname]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Date & Time</th>
              <th className="px-4 py-2 border">Activity</th>
              <th className="px-4 py-2 border">User / Request ID</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a._id}>
                <td className="border px-4 py-2">{new Date(a.at).toLocaleString()}</td>
                <td className="border px-4 py-2">{a.type}</td>
                <td className="border px-4 py-2">
                  {a.actorId || a.customerId || a.workerId}
                </td>
                <td className="border px-4 py-2">{a.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentActivities;
