import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  if (token) {
    config.headers.Authorization = `Bearer ${token.split('=')[1]}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    const navigate = useNavigate()
    if (error.response?.status === 401) {
      // Handle unauthorized (redirect to login)
      if (window.location.pathname !== '/student-login') {
        navigate("/student-login")
      }
    }
    return Promise.reject(error);
  }
);

export default api;