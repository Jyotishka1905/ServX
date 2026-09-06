import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8001', // Change this to your production URL later if needed
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