import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../components/ServiceWorkerList.css'; // reuse your existing styles

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q') || '';

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q.trim()) {
      setWorkers([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        // Call backend API to search workers by name or category
        const res = await api.get(`/search?query=${searchTerm}`);

        setWorkers(res.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setWorkers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div className="worker-list-container">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="category-title">Search results for: "{q}"</h2>

      {loading ? (
        <p>Loading...</p>
      ) : workers.length === 0 ? (
        <p>No workers found matching your search.</p>
      ) : (
        <div className="worker-grid">
          {workers.map((worker) => (
            <div className="worker-card" key={worker._id}>
              <h3>{worker.name || 'Unnamed Worker'}</h3>
              <p><strong>Email:</strong> {worker.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {worker.phone || 'N/A'}</p>
              <p><strong>Category:</strong> {worker.category || 'N/A'}</p>
              <p><strong>Date Joined:</strong> {worker.createdAt ? new Date(worker.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
