// src/components/appointment/AppointmentEditForm.js
import React from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { BLOOD_GROUPS, PAYMENT_METHODS, formatBloodGroup, parseBloodGroup } from '../../../api/config'

/**
 * Appointment Edit Form Component
 * @param {Object} props - Component props
 * @param {Object} props.editData - Current appointment data being edited
 * @param {Function} props.handleEditChange - Function to handle form field changes
 * @param {Function} props.handleSaveEdit - Function to save the edited appointment
 * @param {string} props.editMode - ID of the appointment being edited
 * @param {Function} props.onCancel - Function to cancel editing
 */
const AppointmentEditForm = ({ 
  editData, 
  handleEditChange, 
  handleSaveEdit, 
  editMode, 
  onCancel 
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Edit Appointment</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={18} />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Doctor Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
          <input
            type="text"
            name="doctorName"
            className="w-full p-2 border rounded"
            value={editData.doctorName}
            onChange={handleEditChange}
          />
        </div>
        
        {/* Patient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
          <input
            type="text"
            name="patientName"
            className="w-full p-2 border rounded"
            value={editData.patientName}
            onChange={handleEditChange}
          />
        </div>
        
        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            className="w-full p-2 border rounded"
            value={editData.mobileNumber}
            onChange={handleEditChange}
          />
        </div>
        
        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
          <input
            type="text"
            name="serialNumber"
            className="w-full p-2 border rounded"
            value={editData.serialNumber}
            onChange={handleEditChange}
          />
        </div>
        
        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
          <input
            type="number"
            name="weight"
            className="w-full p-2 border rounded"
            value={editData.weight}
            onChange={handleEditChange}
          />
        </div>
        
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age (years)</label>
          <input
            type="number"
            name="age"
            className="w-full p-2 border rounded"
            value={editData.age}
            onChange={handleEditChange}
          />
        </div>
        
        {/* Blood Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
          <select
            name="bloodGroup"
            className="w-full p-2 border rounded"
            value={editData.bloodGroup}
            onChange={handleEditChange}
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
        
        {/* Consultation Fee */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
          <input
            type="number"
            name="consultationFee"
            className="w-full p-2 border rounded"
            value={editData.consultationFee}
            onChange={handleEditChange}
          />
        </div>
        
        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            name="paymentMethod"
            className="w-full p-2 border rounded"
            value={editData.paymentMethod}
            onChange={handleEditChange}
          >
            <option value="">Select Payment Method</option>
            <option value="CASH">Cash</option>
            <option value="BKASH">Bkash</option>
            <option value="NAGAD">Nagad</option>
            <option value="ROCKET">Rocket</option>
            <option value="BANK">Bank</option>
          </select>
        </div>
        
        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="address"
            className="w-full p-2 border rounded"
            value={editData.address}
            onChange={handleEditChange}
          />
        </div>
        
        {/* Reason */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea
            name="reason"
            className="w-full p-2 border rounded"
            rows={3}
            value={editData.reason}
            onChange={handleEditChange}
          ></textarea>
        </div>
      </div>
      
      {/* Save and Cancel Buttons */}
      <div className="mt-4 flex justify-end gap-2">
        <button 
          onClick={() => handleSaveEdit(editMode)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
        >
          <FaSave /> Save Changes
        </button>
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </div>
  );
};

/**
 * Function to prepare appointment data for editing
 * @param {Object} appointment - Original appointment data
 * @returns {Object} - Formatted data for editing
 */
export const prepareAppointmentForEdit = (appointment) => {
  let formattedBloodGroup = formatBloodGroup(appointment.bloodGroup || "");
  
  return {
    doctorName: appointment.doctorName || "",
    patientName: appointment.patientName || "",
    mobileNumber: appointment.mobileNumber || "",
    serialNumber: appointment.serialNumber || "",
    weight: appointment.weight || "",
    age: appointment.age || "",
    bloodGroup: formattedBloodGroup,
    consultationFee: appointment.consultationFee || "",
    paymentMethod: appointment.paymentMethod || "",
    reason: appointment.reason || "",
    address: appointment.address || ""
  };
};

/**
 * Function to prepare edited data for API submission
 * @param {Object} editData - Edited appointment data
 * @returns {Object} - Formatted data for API
 */
export const prepareEditDataForApi = (editData) => {
  return {
    ...editData,
    bloodGroup: editData.bloodGroup ? parseBloodGroup(editData.bloodGroup) : editData.bloodGroup,
    weight: editData.weight ? parseFloat(editData.weight) : null,
    age: editData.age ? parseInt(editData.age) : null,
    consultationFee: editData.consultationFee ? parseFloat(editData.consultationFee) : null
  };
};

export default AppointmentEditForm;