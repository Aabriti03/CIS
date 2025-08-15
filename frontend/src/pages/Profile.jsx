// frontend/src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import api from '../api/api'; // your helper
import './Profile.css';


export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get('/auth/profile', {
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

        if (!alive) return;
        setUser(data);
      } catch (err) {
        if (!alive) return;
        setError(
          err?.response?.status === 401
            ? 'Session expired. Please log in again.'
            : 'Failed to load profile.'
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error)   return <div className="text-red-600">{error}</div>;
  if (!user)   return <div>No profile found.</div>;

  return (
    <div className="profile-page max-w-3xl mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatarUrl || "/placeholder-user.png"}
          alt={user.name || user.email}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.name || "Unnamed User"}</h1>
          <div className="text-gray-600">{user.email}</div>
          <div className="text-gray-600 capitalize">{user.role}</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div><span className="font-semibold">Phone:</span> {user.phone || "—"}</div>
        <div><span className="font-semibold">Address:</span> {user.address || "—"}</div>
      </div>
    </div>
  );
}
