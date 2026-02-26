import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { clearAuth } from '@/features/auth/services/tokenStorage';

/**
 * Configured Axios instance for CosMate API
 * - Automatically adds auth token to requests
 * - Handles 401 errors (auto logout)
 * - Centralized error handling
 * - baseURL has no /api prefix - endpoints must specify their own prefix
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TEMP DEBUG: Verify baseURL configuration
console.log('🔧 [axiosInstance] baseURL =', axiosInstance.defaults.baseURL);
console.log('🔧 [axiosInstance] env var =', import.meta.env.VITE_API_BASE_URL);

/**
 * Request Interceptor
 * Automatically attach JWT token from localStorage to every request
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('cosmate_access_token');
    const tokenType = localStorage.getItem('cosmate_token_type') || 'Bearer';
    
    if (token && config.headers) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle common error scenarios:
 * - 401: Unauthorized → Clear token and redirect to login
 * - 403: Forbidden → Show permission error
 * - 500: Server error → Show generic error
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Success response - just return data
    return response;
  },
  (error: AxiosError) => {
    // Handle error responses
    if (error.response) {
      const { status } = error.response;

      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          clearAuth();
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', error.response.data);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', error.response.data);
          break;

        case 500:
          // Server error
          console.error('Server error:', error.response.data);
          break;

        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error - no response from server');
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
