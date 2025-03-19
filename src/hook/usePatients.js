import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';

export const usePatients = () => {
  const { data, loading, error, makeRequest } = useApi();
  const [patients, setPatients] = useState([]);
  
  // সব রোগীর তালিকা নিয়ে আসে
  const fetchPatients = useCallback(async () => {
    try {
      const response = await makeRequest('get', '/patient');
      setPatients(response);
      return response;
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  }, [makeRequest]);
  
  // একজন রোগীর তথ্য নিয়ে আসে
  const fetchPatientById = useCallback(async (patientId) => {
    try {
      return await makeRequest('get', `/patient/${patientId}`);
    } catch (err) {
      console.error(`Error fetching patient ${patientId}:`, err);
    }
  }, [makeRequest]);
  
  // নতুন রোগী যোগ করে
  const addPatient = useCallback(async (patientData) => {
    try {
      return await makeRequest('post', '/patient/add', patientData);
    } catch (err) {
      console.error('Error adding patient:', err);
    }
  }, [makeRequest]);
  
  // রোগীর তথ্য আপডেট করে
  const updatePatient = useCallback(async (patientId, patientData) => {
    try {
      return await makeRequest('put', `/patient/edit/${patientId}`, patientData);
    } catch (err) {
      console.error(`Error updating patient ${patientId}:`, err);
    }
  }, [makeRequest]);
  
  // রোগী ডিলিট করে
  const deletePatient = useCallback(async (patientId) => {
    try {
      return await makeRequest('delete', `/patient/delete/${patientId}`);
    } catch (err) {
      console.error(`Error deleting patient ${patientId}:`, err);
    }
  }, [makeRequest]);
  
  // মোবাইল নম্বর দিয়ে রোগী খোঁজে
  const searchPatientByMobile = useCallback(async (mobileNumber) => {
    try {
      const allPatients = await fetchPatients();
      return allPatients.filter(patient => 
        patient.phoneNumber && patient.phoneNumber.includes(mobileNumber)
      );
    } catch (err) {
      console.error('Error searching patient by mobile:', err);
      return [];
    }
  }, [fetchPatients]);
  
  return {
    patients,
    loading,
    error,
    fetchPatients,
    fetchPatientById,
    addPatient,
    updatePatient,
    deletePatient,
    searchPatientByMobile
  };
};