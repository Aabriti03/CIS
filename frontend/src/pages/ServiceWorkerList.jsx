import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

const ServiceWorkerList = () => {
  const { category } = useParams(); // ✅ category is now defined
  const navigate = useNavigate();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to build URL
  const LIST_WORKERS_BY_CATEGORY_URL = (category) => `/users/workers/${category}`;

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true);
        const res = await api.get(LIST_WORKERS_BY_CATEGORY_URL(category)); // ✅ use api instance
        setWorkers(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching workers:", error);
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [category]);

  const handleSendRequest = async (worker) => {
  try {
    const description = window.prompt(`Describe your request for ${worker.name}:`);
    if (!description || !description.trim()) {
      alert('Description is required.');
      return;
    }

    await api.post('/postrequests', {
      category: worker.category,
      description: description.trim(),
      workerId: worker._id, // optional; supported by backend change #4
    });

    alert('✅ Request posted successfully!');
    navigate('/dashboard/posthistory');
  } catch (error) {
    console.error('Error posting request:', error);
    alert('Failed to send request.');
  }
};

  const handleViewProfile = (workerId) => {
    navigate(`/worker/${workerId}`);
  };

  return (
    <div className="min-h-screen bg-[#F7FFF9] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold capitalize">{category} Workers</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        </div>

        {/* Worker List */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : workers.length === 0 ? (
          <p className="text-red-600 font-semibold text-lg">
            No workers found for this category.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div
                key={worker._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-lg font-semibold">{worker.name}</h2>
                  <p className="text-sm text-gray-600">{worker.category}</p>
                  <p className="text-sm">Email: {worker.email}</p>
                  <p className="text-sm">Phone: {worker.phone}</p>
                  <p className="text-sm">Joined: {worker.dateJoined}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleViewProfile(worker._id)}
                    className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleSendRequest(worker)}
                    className="flex-1 px-3 py-2 bg-[#CFFFE2] rounded-lg hover:bg-[#b9ffd6]"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceWorkerList;
