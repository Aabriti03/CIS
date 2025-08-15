// frontend/src/api/api.js
import axios from 'axios';

// Create an axios instance with your backend API base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // change this if your backend runs elsewhere
});

// Automatically attach token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
