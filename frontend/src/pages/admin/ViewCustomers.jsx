import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";

const ViewCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/admin/customers", {
          signal: controller.signal,
        });
        if (active) setCustomers(res.data || []);
      } catch (err) {
        if (active) setError("Failed to load customers");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCustomers();
    return () => {
      active = false;
      controller.abort();
    };
  }, [location.pathname]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Customers</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td className="border px-4 py-2">{c.name}</td>
                <td className="border px-4 py-2">{c.email}</td>
                <td className="border px-4 py-2">{c.phone}</td>
                <td className="border px-4 py-2">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCustomers;
