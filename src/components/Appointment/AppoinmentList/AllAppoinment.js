// Updated AppointmentList.js with auto-cancellation for missed appointments
import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaClock, FaEdit, FaSearch, FaFilter, FaPen, FaPrint, FaTimes } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Import our custom hooks
import { useAppointments } from "../../../hook/useAppointments";
import { useDoctors } from "../../../hook/useDoctors";

// Import separated components
import AppointmentEditForm, { prepareAppointmentForEdit, prepareEditDataForApi } from "./AppointmentEditForm"
import { usePrintAppointment } from "./AppointmentPrintService"

const AppointmentList = () => {
  // Get functions and state from our custom hooks
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    updateAppointment,
    approveAppointment,
    cancelAppointment, // Add cancelAppointment function to our hook usage
  } = useAppointments();
  
  const { doctors, loading: doctorsLoading, fetchDoctors } = useDoctors();
  
  // Get print functionality
  const { handlePrint, PrintFrame } = usePrintAppointment();
  
  // Local state
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [serialEditMode, setSerialEditMode] = useState(null);
  const [serialNumber, setSerialNumber] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
    address: "",
    appointmentDate: "", // Add appointmentDate field
    status: "" // Add status field
  });
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Print functionality
  const [printingAppointment, setPrintingAppointment] = useState(null);

  // Load data when component mounts
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, [fetchAppointments, fetchDoctors]);

  // Auto-cancel missed appointments
  useEffect(() => {
    const checkMissedAppointments = async () => {
      if (!appointments || !Array.isArray(appointments)) return;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const missedAppointments = appointments.filter(appointment => {
        // Only check pending appointments (without serial number)
        if (appointment.serialNumber || appointment.status === "cancelled") return false;
        
        // Get appointment date (from appointmentDate field or createdAt)
        const appointmentDate = appointment.appointmentDate 
          ? new Date(appointment.appointmentDate) 
          : new Date(appointment.createdAt);
        
        // If appointment date is in the past and the patient didn't show up
        return appointmentDate < today;
      });
      
      // Auto-cancel missed appointments
      for (const appointment of missedAppointments) {
        try {
          await cancelAppointment(appointment.id, "Auto-cancelled due to no-show");
          console.log(`Auto-cancelled appointment ${appointment.id} due to patient no-show`);
        } catch (error) {
          console.error(`Failed to auto-cancel appointment ${appointment.id}:`, error);
        }
      }
      
      // If any appointments were auto-cancelled, refresh the list
      if (missedAppointments.length > 0) {
        fetchAppointments();
      }
    };
    
    // Check for missed appointments when the component loads
    checkMissedAppointments();
    
    // Set up a daily check (can be adjusted as needed)
    const intervalId = setInterval(checkMissedAppointments, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [appointments, cancelAppointment, fetchAppointments]);

  // Apply filters whenever filter criteria or appointments change
  useEffect(() => {
    if (!appointments || !Array.isArray(appointments)) return;
    
    let result = [...appointments];
    
    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(appointment => {
        if (filterStatus === "complete") return appointment.serialNumber && appointment.status !== "cancelled";
        if (filterStatus === "pending") return !appointment.serialNumber && appointment.status !== "cancelled";
        if (filterStatus === "cancelled") return appointment.status === "cancelled";
        return true;
      });
    }
    
    // Filter by selected doctor
    if (selectedDoctor) {
      result = result.filter(appointment => appointment.doctorId === selectedDoctor);
    }
    
    // Search by patient name/mobile
    if (patientSearch.trim()) {
      const searchTerm = patientSearch.toLowerCase();
      result = result.filter(
        appointment => 
          (appointment.mobileNumber && appointment.mobileNumber.includes(patientSearch)) ||
          (appointment.patientName && appointment.patientName.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(appointment => {
        const appDate = appointment.appointmentDate 
          ? new Date(appointment.appointmentDate) 
          : new Date(appointment.createdAt);
        return appDate >= start;
      });
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(appointment => {
        const appDate = appointment.appointmentDate 
          ? new Date(appointment.appointmentDate) 
          : new Date(appointment.createdAt);
        return appDate <= end;
      });
    }
    
    setFilteredAppointments(result);
  }, [appointments, filterStatus, selectedDoctor, patientSearch, startDate, endDate]);

  // Start editing an appointment
  const handleEditStart = (appointment) => {
    setEditData(prepareAppointmentForEdit(appointment));
    setEditMode(appointment.id);
  };
  
  // Handle changes to edit form fields
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  // Save edited appointment
  const handleSaveEdit = async (id) => {
    try {
      // Prepare data for API using the helper function
      const apiData = prepareEditDataForApi(editData);
      
      await updateAppointment(id, apiData);
      setEditMode(null);
      alert("Appointment updated successfully");
      await fetchAppointments(); // Refresh data
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert(`Error: ${error.message || "Failed to update"}`);
    }
  };

  // Approve an appointment by adding a serial number
  const handleApprove = async (id) => {
    if (!serialNumber.trim()) {
      alert("Please enter a serial number");
      return;
    }

    try {
      await approveAppointment(id, serialNumber);
      setSerialEditMode(null);
      setSerialNumber("");
      alert("Appointment approved successfully");
      await fetchAppointments(); // Refresh data
    } catch (error) {
      console.error("Error approving appointment:", error);
      alert(`Error: ${error.message || "Failed to approve"}`);
    }
  };
  
  // Manually cancel an appointment
  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id, "Manually cancelled");
        alert("Appointment cancelled successfully");
        await fetchAppointments(); // Refresh data
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        alert(`Error: ${error.message || "Failed to cancel"}`);
      }
    }
  };

  // Print appointment handler
  const initiatePrint = (appointment) => {
    setPrintingAppointment(appointment);
    handlePrint(appointment);
  };

  // Reset all filters
  const handleReset = () => {
    setFilterStatus("all");
    setSelectedDoctor("");
    setPatientSearch("");
    setStartDate("");
    setEndDate("");
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  };

  // Get status label based on appointment status
  const getStatusLabel = (appointment) => {
    if (appointment.status === "cancelled") {
      return "Cancelled";
    } else if (appointment.serialNumber) {
      return "Complete";
    } else {
      return "Pending";
    }
  };

  // Get status icon based on appointment status
  const getStatusIcon = (appointment) => {
    if (appointment.status === "cancelled") {
      return <FaTimes className="text-red-500" size={18} />;
    } else if (appointment.serialNumber) {
      return <FaCheckCircle className="text-green-500" size={18} />;
    } else {
      return <FaClock className="text-orange-500" size={18} />;
    }
  };

  // Show error message if loading appointments failed
  if (error) {
    return <div className="text-red-500 p-4">Error loading appointments: {error.message}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Print Frame Component */}
      <PrintFrame appointment={printingAppointment} />

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">
            Appointment List
          </h2>
        </div>
        
        {/* Filters Section */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <div className="flex gap-2 flex-wrap">
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
                <button
                  className={`px-4 py-2 rounded text-sm ${
                    filterStatus === "cancelled"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setFilterStatus("cancelled")}
                >
                  Cancelled
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
                {!doctorsLoading && doctors && doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name || (doctor.translations?.en?.name || 'Unknown Doctor')}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Patient Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Search (Name or Mobile)
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 pl-8 border rounded"
                  placeholder="Search by patient name or mobile"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                />
                <FaSearch className="absolute left-2 top-3 text-gray-400" />
              </div>
            </div>
            
            {/* Date Range Filter - Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            {/* Date Range Filter - End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate} // Can't select end date before start date
              />
            </div>
          </div>
          
          {/* Reset Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
            >
              <FaFilter /> Reset Filters
            </button>
          </div>
        </div>

        {/* Count Summary */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium">Total:</span> 
              <span className="bg-blue-100 px-2 py-1 rounded">{filteredAppointments.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Complete:</span> 
              <span className="bg-green-100 px-2 py-1 rounded text-green-700">
                {filteredAppointments.filter(app => app.serialNumber && app.status !== "cancelled").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Pending:</span> 
              <span className="bg-orange-100 px-2 py-1 rounded text-orange-700">
                {filteredAppointments.filter(app => !app.serialNumber && app.status !== "cancelled").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Cancelled:</span> 
              <span className="bg-red-100 px-2 py-1 rounded text-red-700">
                {filteredAppointments.filter(app => app.status === "cancelled").length}
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
              // Use the separated Edit Form component
              <AppointmentEditForm
                editData={editData}
                handleEditChange={handleEditChange}
                handleSaveEdit={handleSaveEdit}
                editMode={editMode}
                onCancel={() => setEditMode(null)}
              />
            ) : (
              // Regular Table View
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Date</th>
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
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <tr 
                        key={appointment.id} 
                        className={`border-b hover:bg-gray-50 ${
                          appointment.status === "cancelled" ? "bg-red-50" : ""
                        }`}
                      >
                        <td className="py-3 px-4">
                          {formatDate(appointment.appointmentDate || appointment.createdAt)}
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
                                appointment.status === "cancelled"
                                  ? "text-red-600"
                                  : appointment.serialNumber
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
                            {/* Only show action buttons for non-cancelled appointments */}
                            {appointment.status !== "cancelled" && (
                              <>
                                {/* Print Button */}
                                <button
                                  className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                  onClick={() => initiatePrint(appointment)}
                                  title="Print Appointment"
                                >
                                  <FaPrint size={16} />
                                </button>
                                
                                {/* Edit Button */}
                                <button
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  onClick={() => handleEditStart(appointment)}
                                  title="Edit Appointment"
                                >
                                  <FaPen size={16} />
                                </button>
                                
                                {/* Cancel Button */}
                                <button
                                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                  onClick={() => handleCancelAppointment(appointment.id)}
                                  title="Cancel Appointment"
                                >
                                  <FaTimes size={16} />
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
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-6 text-center text-gray-500">
                        No appointments found
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

export default AppointmentList;