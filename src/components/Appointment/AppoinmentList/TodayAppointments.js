// TodayAppointments.js - Component to show only today's appointments with full edit functionality
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaEdit, FaCalendarDay, FaPen, FaSave, FaTimes } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TodayAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serialEditMode, setSerialEditMode] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // New state for full editing
  const [editMode, setEditMode] = useState(null);
  const [editData, setEditData] = useState({
    doctorName: "",
    patientName: "",
    mobileNumber: "",
    serialNumber: "",
    weight: "",
    age: "",
    bloodGroup: "",
    consultationFee: "",
    paymentMethod: "",
    reason: "",
    address: ""
  });
  
  // Filtering states
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const API_KEY = "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079";
  const BASE_URL = "https://api.muktihospital.com/api";

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Extract unique doctors from appointments for the filter dropdown
  useEffect(() => {
    if (todayAppointments.length > 0) {
      const uniqueDoctors = [...new Set(todayAppointments.map(app => app.doctorId))].map(id => {
        const doc = todayAppointments.find(app => app.doctorId === id);
        return { id, name: doc.doctorName };
      });
      setDoctors(uniqueDoctors);
    }
  }, [todayAppointments]);

  // Filter appointments by today's date and apply status/doctor filters
  useEffect(() => {
    filterTodayAppointments();
  }, [appointments, filterStatus, selectedDoctor]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/appointment`, {
        headers: { "x-api-key": API_KEY },
      });
      
      // The API returns response.data.appointments which is the array we need
      if (response.data && response.data.appointments && Array.isArray(response.data.appointments)) {
        setAppointments(response.data.appointments);
      } else {
        console.error("Response is not in expected format:", response.data);
        setAppointments([]);
      }
      
    } catch (error) {
      console.error("Error loading appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTodayAppointments = () => {
    // Get today's date with time set to beginning of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date for comparison (end of range)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // First filter by today's date
    let result = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.createdAt);
      return appointmentDate >= today && appointmentDate < tomorrow;
    });
    
    // Then apply other filters
    if (filterStatus !== "all") {
      result = result.filter(appointment => {
        if (filterStatus === "complete") return appointment.serialNumber;
        if (filterStatus === "pending") return !appointment.serialNumber;
        return true;
      });
    }
    
    if (selectedDoctor) {
      result = result.filter(appointment => appointment.doctorId === selectedDoctor);
    }
    
    setTodayAppointments(result);
  };

  const getStatusLabel = (appointment) => {
    if (appointment.serialNumber) {
      return "Complete";
    } else {
      return "Pending";
    }
  };

  const getStatusIcon = (appointment) => {
    if (appointment.serialNumber) {
      return <FaCheckCircle className="text-green-500" size={18} />;
    } else {
      return <FaClock className="text-orange-500" size={18} />;
    }
  };

  // Function to start editing an appointment
  const handleEditStart = (appointment) => {
    // Format the blood group for display
    let formattedBloodGroup = appointment.bloodGroup || "";
    formattedBloodGroup = formattedBloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
    
    setEditData({
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
    });
    
    setEditMode(appointment.id);
  };
  
  // Handle input changes for edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  // Handle save for full appointment edit
  const handleSaveEdit = async (id) => {
    try {
      // Format data for API
      const payload = {
        doctorName: editData.doctorName,
        patientName: editData.patientName,
        mobileNumber: editData.mobileNumber,
        serialNumber: editData.serialNumber,
        weight: editData.weight,
        age: editData.age,
        bloodGroup: editData.bloodGroup,
        consultationFee: editData.consultationFee,
        paymentMethod: editData.paymentMethod,
        reason: editData.reason,
        address: editData.address
      };
      
      console.log("Updating appointment with data:", payload);
      
      const response = await axios.put(
        `${BASE_URL}/appointment/edit/${id}`,
        payload,
        {
          headers: { 
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
          },
        }
      );
      
      console.log("Response from server:", response.data);
      
      // Update the local state if the API call was successful
      if (response.data && response.data.appointment) {
        // Refresh the appointments list
        fetchAppointments();
        
        setEditMode(null);
        alert("Appointment updated successfully");
      } else {
        throw new Error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      
      // More detailed error message
      if (error.response) {
        console.error("Server responded with:", error.response.status, error.response.data);
        alert(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response received from server. Check your network connection.");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleApprove = async (id) => {
    if (!serialNumber.trim()) {
      alert("Please enter a serial number");
      return;
    }

    try {
      // Using the correct endpoint from your backend - "/edit/:id"
      const endpoint = `${BASE_URL}/appointment/edit/${id}`;
      
      // Format payload according to your backend expectations
      const payload = { 
        serialNumber: serialNumber.trim()
      };
      
      console.log("Sending update to:", endpoint);
      console.log("With payload:", payload);
      
      const response = await axios.put(
        endpoint,
        payload,
        {
          headers: { 
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
          },
        }
      );
      
      console.log("Response from server:", response.data);
      
      // Update the local state if the API call was successful
      if (response.data && response.data.appointment) {
        // Fetch all appointments again to ensure we have the latest data
        fetchAppointments();
        
        setSerialEditMode(null);
        setSerialNumber("");
        alert("Appointment approved successfully");
      } else {
        throw new Error("Failed to update appointment");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      
      // More detailed error message
      if (error.response) {
        console.error("Server responded with:", error.response.status, error.response.data);
        alert(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response received from server. Check your network connection.");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleReset = () => {
    setFilterStatus("all");
    setSelectedDoctor("");
  };

  // Format time for displaying in table
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    // Format time as HH:MM AM/PM
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Get today's date as a formatted string
  const getTodayDate = () => {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
              <FaCalendarDay className="text-blue-600" /> Today's Appointments
            </h2>
            <p className="text-gray-500 mt-1">{getTodayDate()}</p>
          </div>
        </div>
        
        {/* Filters Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded text-sm ${
                    filterStatus === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 rounded text-sm ${
                    filterStatus === "pending"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </button>
                <button
                  className={`px-4 py-2 rounded text-sm ${
                    filterStatus === "complete"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setFilterStatus("complete")}
                >
                  Complete
                </button>
              </div>
            </div>
            
            {/* Doctor Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                <option value="">All Doctors</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Reset Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Count Summary */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Today's Total:</span> 
              <span className="bg-blue-100 px-2 py-1 rounded">{todayAppointments.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Complete:</span> 
              <span className="bg-green-100 px-2 py-1 rounded text-green-700">
                {todayAppointments.filter(app => app.serialNumber).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Pending:</span> 
              <span className="bg-orange-100 px-2 py-1 rounded text-orange-700">
                {todayAppointments.filter(app => !app.serialNumber).length}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height={50} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {editMode ? (
              // Edit Form
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-medium">Edit Appointment</h3>
                  <button onClick={() => setEditMode(null)} className="text-gray-500 hover:text-gray-700">
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
                    onClick={() => setEditMode(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Regular Table View
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Appointment Date</th>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Doctor</th>
                    <th className="py-3 px-4 text-left">Serial</th>
                    <th className="py-3 px-4 text-left">Mobile</th>
                    <th className="py-3 px-4 text-left">Reason</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.length > 0 ? (
                    todayAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b hover:bg-gray-50">
<td className="py-3 px-4">
  {appointment.appointmentDate 
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
        dateStyle: "medium",
      })
    : 'N/A'}
</td>


                        <td className="py-3 px-4">{appointment.patientName || 'N/A'}</td>
                        <td className="py-3 px-4">{appointment.doctorName || 'N/A'}</td>
                        <td className="py-3 px-4">
                          {serialEditMode === appointment.id ? (
                            <input
                              type="text"
                              className="border p-1 w-20"
                              value={serialNumber}
                              onChange={(e) => setSerialNumber(e.target.value)}
                            />
                          ) : (
                            appointment.serialNumber || "-"
                          )}
                        </td>
                        <td className="py-3 px-4">{appointment.mobileNumber || 'N/A'}</td>
                        <td className="py-3 px-4 max-w-xs truncate">{appointment.reason || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(appointment)}
                            <span
                              className={`${
                                appointment.serialNumber
                                  ? "text-green-600"
                                  : "text-orange-500"
                              }`}
                            >
                              {getStatusLabel(appointment)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {/* Edit Button */}
                            <button
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              onClick={() => handleEditStart(appointment)}
                              title="Edit Appointment"
                            >
                              <FaPen size={16} />
                            </button>
                            
                            {/* Approve Button (only for pending appointments) */}
                            {!appointment.serialNumber && (
                              <>
                                {serialEditMode === appointment.id ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      className="text-green-600 hover:text-green-800"
                                      onClick={() => handleApprove(appointment.id)}
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="text-red-600 hover:text-red-800"
                                      onClick={() => {
                                        setSerialEditMode(null);
                                        setSerialNumber("");
                                      }}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    className="text-orange-600 hover:text-orange-800 flex items-center gap-1"
                                    onClick={() => {
                                      setSerialEditMode(appointment.id);
                                      setSerialNumber("");
                                    }}
                                    title="Approve Appointment"
                                  >
                                    <FaEdit size={16} />
                                    Approve
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-6 text-center text-gray-500">
                        No appointments for today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayAppointments;