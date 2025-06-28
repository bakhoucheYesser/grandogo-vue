// src/services/api.service.ts
import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';

// Axios instance configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor (optional but kept for future flexibility)
apiClient.interceptors.request.use(
  (config) => {
    // No need to manually set Authorization if you're using cookies
    return config;
  },
  (error) => Promise.reject(error)
);



export default apiClient;
