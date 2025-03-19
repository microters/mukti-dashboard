// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

/**
 * Generic API hook for making requests
 * @returns {Object} - API utility functions and state
 */
export const useApi = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Make API request with specified method
   * @param {string} method - HTTP method: get, post, put, delete
   * @param {string} endpoint - API endpoint
   * @param {Object} payload - Request payload (for POST/PUT)
   * @param {Object} options - Additional axios options
   * @returns {Promise} - Request promise
   */
  const makeRequest = useCallback(async (method, endpoint, payload = null, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await axiosInstance.get(endpoint, options);
          break;
        case 'post':
          response = await axiosInstance.post(endpoint, payload, options);
          break;
        case 'put':
          response = await axiosInstance.put(endpoint, payload, options);
          break;
        case 'delete':
          response = await axiosInstance.delete(endpoint, options);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { data, loading, error, makeRequest };
};

export default useApi;