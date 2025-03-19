// src/hooks/useDoctors.js
import { useState, useCallback } from 'react';
import useApi from './useApi';
import { ENDPOINTS } from '../api/config';

/**
 * Hook for managing doctors
 * @returns {Object} - Doctor functions and state
 */
export const useDoctors = () => {
  const { data, loading, error, makeRequest } = useApi();
  const [doctors, setDoctors] = useState([]);
  
  /**
   * Fetch all doctors
   * @returns {Promise} - Request promise
   */
  const fetchDoctors = useCallback(async () => {
    try {
      const response = await makeRequest('get', ENDPOINTS.DOCTORS.LIST);
      
      if (Array.isArray(response)) {
        setDoctors(response);
        return response;
      } else if (response && response.doctors && Array.isArray(response.doctors)) {
        // Alternative API response format
        setDoctors(response.doctors);
        return response.doctors;
      } else {
        console.error("Unexpected response format:", response);
        setDoctors([]);
        return [];
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setDoctors([]);
      return [];
    }
  }, [makeRequest]);
  
  /**
   * Fetch a single doctor by ID
   * @param {string} doctorId - Doctor ID
   * @returns {Promise} - Request promise
   */
  const fetchDoctorById = useCallback(async (doctorId) => {
    try {
      return await makeRequest('get', ENDPOINTS.DOCTORS.DETAIL(doctorId));
    } catch (err) {
      console.error(`Error fetching doctor ${doctorId}:`, err);
      throw err;
    }
  }, [makeRequest]);
  
  /**
   * Add a new doctor
   * @param {Object} doctorData - Doctor data
   * @returns {Promise} - Request promise
   */
  const addDoctor = useCallback(async (doctorData) => {
    try {
      return await makeRequest('post', ENDPOINTS.DOCTORS.ADD, doctorData);
    } catch (err) {
      console.error('Error adding doctor:', err);
      throw err;
    }
  }, [makeRequest]);
  
  /**
   * Update an existing doctor
   * @param {string} doctorId - Doctor ID
   * @param {Object} doctorData - Updated doctor data
   * @returns {Promise} - Request promise
   */
  const updateDoctor = useCallback(async (doctorId, doctorData) => {
    try {
      return await makeRequest('put', ENDPOINTS.DOCTORS.EDIT(doctorId), doctorData);
    } catch (err) {
      console.error(`Error updating doctor ${doctorId}:`, err);
      throw err;
    }
  }, [makeRequest]);
  
  /**
   * Delete a doctor
   * @param {string} doctorId - Doctor ID
   * @returns {Promise} - Request promise
   */
  const deleteDoctor = useCallback(async (doctorId) => {
    try {
      return await makeRequest('delete', ENDPOINTS.DOCTORS.DELETE(doctorId));
    } catch (err) {
      console.error(`Error deleting doctor ${doctorId}:`, err);
      throw err;
    }
  }, [makeRequest]);
  
  return {
    doctors,
    loading,
    error,
    fetchDoctors,
    fetchDoctorById,
    addDoctor,
    updateDoctor,
    deleteDoctor
  };
};

export default useDoctors;