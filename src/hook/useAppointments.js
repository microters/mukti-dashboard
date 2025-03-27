// src/hooks/useAppointments.js
import { useState, useCallback } from 'react';

import { ENDPOINTS } from '../api/config';
import useApi from './useApi';

/**
 * Hook for managing appointments
 * @returns {Object} - Appointment functions and state
 */
export const useAppointments = () => {
  const { data, loading, error, makeRequest } = useApi();
  const [appointments, setAppointments] = useState([]);
  
  /**
   * Fetch all appointments
   * @returns {Promise} - Request promise
   */
  const fetchAppointments = useCallback(async () => {
    try {
      const response = await makeRequest('get', ENDPOINTS.APPOINTMENTS.LIST);
      
      // Log the response to check its structure
      console.log('Appointments Response:', response);
  
      // Handle response correctly based on API structure
      if (response && response.appointments && Array.isArray(response.appointments)) {
        setAppointments(response.appointments);
        return response.appointments;
      } else {
        console.error("Unexpected response format:", response);
        setAppointments([]);
        return [];
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
      return [];
    }
  }, [makeRequest]);
  
  
  /**
   * Fetch today's appointments only
   * @returns {Promise} - Request promise with today's appointments
   */
  const fetchTodayAppointments = useCallback(async () => {
    try {
      const response = await makeRequest('get', ENDPOINTS.APPOINTMENTS.LIST);
      
      if (response && response.appointments && Array.isArray(response.appointments)) {
        // Get today's date at beginning of day
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get tomorrow's date for comparison
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Filter appointments for today
        const todayAppointments = response.appointments.filter(appointment => {
          const appDate = new Date(appointment.createdAt);
          return appDate >= today && appDate < tomorrow;
        });
        
        return todayAppointments;
      }
      return [];
    } catch (err) {
      console.error('Error fetching today\'s appointments:', err);
      return [];
    }
  }, [makeRequest]);
  
  /**
   * Fetch a single appointment by ID
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} - Request promise
   */
  const fetchAppointmentById = useCallback(async (appointmentId) => {
    try {
      return await makeRequest('get', ENDPOINTS.APPOINTMENTS.DETAIL(appointmentId));
    } catch (err) {
      console.error(`Error fetching appointment ${appointmentId}:`, err);
      throw err;
    }
  }, [makeRequest]);
  
  /**
   * Add a new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise} - Request promise
   */
  const addAppointment = useCallback(async (appointmentData) => {
    try {
      return await makeRequest('post', ENDPOINTS.APPOINTMENTS.ADD, appointmentData);
    } catch (err) {
      console.error('Error adding appointment:', err);
      throw err;
    }
  }, [makeRequest]);
  
  /**
   * Update an existing appointment
   * @param {string} appointmentId - Appointment ID
   * @param {Object} appointmentData - Updated appointment data
   * @returns {Promise} - Request promise
   */
  const updateAppointment = useCallback(async (appointmentId, appointmentData) => {
    try {
      return await makeRequest('put', ENDPOINTS.APPOINTMENTS.EDIT(appointmentId), appointmentData);
    } catch (err) {
      console.error(`Error updating appointment ${appointmentId}:`, err);
      throw err;
    }
  }, [makeRequest]);
  
  /**
   * Approve an appointment by adding a serial number
   * @param {string} appointmentId - Appointment ID
   * @param {string} serialNumber - Serial number to assign
   * @returns {Promise} - Request promise
   */
  const approveAppointment = useCallback(async (appointmentId, serialNumber) => {
    try {
      return await makeRequest('put', ENDPOINTS.APPOINTMENTS.EDIT(appointmentId), { serialNumber });
    } catch (err) {
      console.error(`Error approving appointment ${appointmentId}:`, err);
      throw err;
    }
  }, [makeRequest]);
  
  /**
   * Delete an appointment
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise} - Request promise
   */
  const deleteAppointment = useCallback(async (appointmentId) => {
    try {
      return await makeRequest('delete', ENDPOINTS.APPOINTMENTS.DELETE(appointmentId));
    } catch (err) {
      console.error(`Error deleting appointment ${appointmentId}:`, err);
      throw err;
    }
  }, [makeRequest]);
  
  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    fetchTodayAppointments,
    fetchAppointmentById,
    addAppointment,
    updateAppointment,
    approveAppointment,
    deleteAppointment
  };
};

export default useAppointments;