import axios from 'axios';
import { authService } from './services/authService';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: 'https://localhost:7046',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401/403 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      // Handle unauthorized or forbidden responses
      if (status === 401 || status === 403) {
        // Clear token and redirect to login
        authService.logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;






