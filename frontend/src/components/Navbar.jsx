// frontend/src/components/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './Navbar.css';
import logo from '../assets/logo.png';
import { CATEGORIES, CATEGORY_LABELS } from '../constants/categories'; // 🔹 use constants

const Navbar = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const openPostModal = () => setShowPostModal(true);
  const closePostModal = () => {
    setShowPostModal(false);
    setSelectedCategory('');
    setDescription('');
  };

  const handleSubmitPostRequest = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !description.trim()) {
      alert('Please select a category and write a description');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You are not logged in');
        return;
      }

      const response = await api.post('/postrequests', {
        category: selectedCategory,
        description: description.trim(),
      });

      if (response.status === 201) {
        alert('✅ Request posted successfully!');
        closePostModal();
        // ✅ Redirect to Post History under dashboard
        navigate('/dashboard/posthistory');
      } else {
        alert('⚠️ Unexpected server response');
        console.log(response);
      }
    } catch (error) {
      console.error('Error posting request:', error);
      const msg =
        error?.response?.data?.message || 'Failed to post request. Please try again.';
      alert(`❌ ${msg}`);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div
          className="navbar-logo"
          onClick={() => navigate('/dashboard/customerdashboard')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="Logo" />
        </div>
        <div className="navbar-search">
          {/* Empty search bar placeholder */}
        </div>
        <ul className="nav-links">
          <li onClick={() => navigate('/dashboard/customerdashboard')} style={{ cursor: 'pointer' }}>
            Home
          </li>
          <li onClick={openPostModal} style={{ cursor: 'pointer' }}>
            Post Request
          </li>
          <li onClick={() => navigate('/dashboard/posthistory')} style={{ cursor: 'pointer' }}>
            Post History
          </li>
          <li
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/');
            }}
            style={{ cursor: 'pointer' }}
          >
            Logout
          </li>
          <li onClick={() => navigate('/dashboard/profile')} style={{ cursor: 'pointer' }}>
            View Profile
          </li>
          
        </ul>
      </nav>

      {showPostModal && (
        <div className="modal-overlay" onClick={closePostModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Post a Request</h2>
            <form onSubmit={handleSubmitPostRequest}>
              <label>
                Category:
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Description:
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write your request here..."
                  required
                />
              </label>

              <div className="modal-buttons">
                <button type="submit">Submit Request</button>
                <button type="button" onClick={closePostModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
