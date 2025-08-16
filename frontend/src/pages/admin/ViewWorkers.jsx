import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/api";

const categories = ["babysitting", "electric", "gardening", "househelp", "plumbing"];

const ViewWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // reset state when navigating back
    setWorkers([]);
    setActiveCategory(null);
  }, [location.pathname]);

  const fetchWorkers = async (cat) => {
    setActiveCategory(cat);
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/workers/by-category/${cat}`);
      setWorkers(res.data || []);
    } catch (err) {
      setError("Failed to load workers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Workers</h2>
      <div className="flex gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => fetchWorkers(c)}
            className={`px-4 py-2 rounded ${
              activeCategory === c ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && activeCategory && (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Joined</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w._id}>
                <td className="border px-4 py-2">{w.name}</td>
                <td className="border px-4 py-2">{w.email}</td>
                <td className="border px-4 py-2">{w.phone}</td>
                <td className="border px-4 py-2">{w.category}</td>
                <td className="border px-4 py-2">
                  {new Date(w.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewWorkers;
