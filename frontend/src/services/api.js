import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8001', // Changed to match the exact host loopback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the auth token if it exists in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;