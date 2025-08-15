// frontend/src/pages/WorkerProfile.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get(`/users/workers/id/${id}`);
        console.log("📢 [FRONTEND] WorkerProfile API response:", data);
        if (!alive) return;
        setWorker(data);
      } catch (e) {
        if (!alive) return;
        setErr('Failed to load worker profile.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading…</div>;
  if (err) return <div className="text-white p-6">{err}</div>;
  if (!worker) return <div className="text-white p-6">Worker not found.</div>;


  return (
    <div className="text-white">
      <h2>{worker?.name}</h2>
      <div>
        <div><strong>Category:</strong> {worker?.category || '-'}</div>
        <div><strong>Experience:</strong> {worker?.experience ? `${worker.experience} yrs` : '-'}</div>
        <div><strong>Location:</strong> {worker?.location || '-'}</div>
        <div><strong>Email:</strong> {worker?.email || '-'}</div>
        <div><strong>Phone:</strong> {worker?.phone || '-'}</div>
        {/* Add more fields your backend returns, avoiding password of course */}
      </div>

      <div style={{ marginTop: 12 }}>
        <button
          onClick={async () => {
            try {
          // Ask the customer for a short description (required by backend)
              const description = window.prompt('Describe your request for this worker:');
               if (!description || !description.trim()) {
              alert('Description is required.');
              return;
               }

             await api.post('/postrequests', {
              // Your backend accepts { category, description } and can store workerId (see backend change #4)
               category: worker?.category,
              description: description.trim(),
                  workerId: worker._id, // optional but we’ll support it in backend change #4
             });

             alert('✅ Request posted successfully!');
             navigate('/dashboard/posthistory');
        } catch (e) {
           console.error(e);
             alert('Failed to send request.');
              }
            }}

        >
          Send Request
        </button>
      </div>
    </div>
  );
}
