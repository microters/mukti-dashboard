// src/api/axiosInstance.js
import axios from 'axios';
import { API_KEY, BASE_URL, REQUEST_TIMEOUT, DEFAULT_HEADERS } from './config';

// Create axios instance with configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: DEFAULT_HEADERS
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Make sure the API key is always included
    if (!config.headers['x-api-key']) {
      config.headers['x-api-key'] = API_KEY;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error globally
    console.error('API Error:', error);
    
    // You can do more detailed error handling here
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request made but no response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;