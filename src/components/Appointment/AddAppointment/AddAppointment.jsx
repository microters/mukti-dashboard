"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaUserMd, FaUser, FaMoneyBillWave, FaStethoscope } from "react-icons/fa";
import { MdFormatListNumbered, MdPayment } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useDoctors from "../../../hook/useDoctors";

const getAvailableDatesForMonth = (selectedMonth, availableDays) => {
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const availableDates = [];
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    if (availableDays.includes(date.getDay())) {
      availableDates.push(date);
    }
  }
  return availableDates;
};

const AddAppointment = () => {
  // State declarations
  const [loading, setLoading] = useState(false);
  const [patientLoading, setPatientLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  
  const { doctors, loading: doctorLoading, fetchDoctors } = useDoctors();
  const [patients, setPatients] = useState([]);
  
  // Use calendar for selecting appointment date
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [feeOptions, setFeeOptions] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [newPatientInput, setNewPatientInput] = useState("");
  
  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    consultationFee: "",
    paymentMethod: "",
    reference: "",
    mobileNumber: "",
    weight: "",
    age: "",
    isManualPatient: false,
  });
  
  // API key and BASE_URL (update these as needed)
  const API_KEY = "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079";
  const BASE_URL = "http://localhost:5000/api";
  
  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);
  
  // Fetch patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/patient`, {
          headers: { "x-api-key": API_KEY },
        });
        const formattedPatients = response.data.map((patient) => ({
          value: patient.id,
          label: `${patient.name} (${patient.phoneNumber || "No Phone"})`,
          phone: patient.phoneNumber || "",
        }));
        setPatients(formattedPatients);
      } catch (error) {
        console.error("Error loading patients:", error);
      } finally {
        setPatientLoading(false);
      }
    };
    fetchPatients();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Handle doctor selection
  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
    setFormData({ ...formData, doctor: selectedOption?.value || "" });
  
    if (!selectedOption) {
      setAvailableDates([]);
      setFeeOptions([]);
      setSelectedFee(null);
      return;
    }
  
    setScheduleLoading(true);
    const doctor = doctors.find((doc) => doc.id === selectedOption.value);
    if (doctor) {
      // Convert doctor's available schedule days to numbers
      const daysMapping = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
      const availableDays = doctor?.schedule?.map((sch) => daysMapping[sch.day]) || [];
      // Calculate available dates for the currently selected month
      setAvailableDates(getAvailableDatesForMonth(selectedDate, availableDays));
  
      const appointmentFee = doctor.translations?.en?.appointmentFee;
      const followUpFee = doctor.translations?.en?.followUpFee;
      setFeeOptions([
        { value: appointmentFee, label: `Appointment Fee (${appointmentFee})` },
        { value: followUpFee, label: `Follow-Up Fee (${followUpFee})` },
      ]);
      setSelectedFee(null);
    }
    setScheduleLoading(false);
  };
  
  // Handle fee change
  const handleFeeChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedFee({ value: selectedOption.value, label: selectedOption.value });
      setFormData({ ...formData, consultationFee: selectedOption.value });
    } else {
      setSelectedFee(null);
      setFormData({ ...formData, consultationFee: "" });
    }
  };
  
  // Handle patient selection
  const handlePatientChange = (selectedOption) => {
    setSelectedPatient(selectedOption);
    setFormData({
      ...formData,
      patient: selectedOption?.value || "",
      mobileNumber: selectedOption?.phone || "",
      isManualPatient: false,
    });
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (selectedOption) => {
    setSelectedPaymentMethod(selectedOption);
    setFormData({ ...formData, paymentMethod: selectedOption?.value || "" });
  };
  
  // Handle blood group change
  const handleBloodGroupChange = (selectedOption) => {
    setSelectedBloodGroup(selectedOption);
    setFormData({ ...formData, bloodGroup: selectedOption?.value || "" });
  };
  
  // Handle patient creation by pressing Enter (for new patient)
  const handlePatientKeyDown = (event) => {
    if (event.key === "Enter" && newPatientInput.trim() !== "") {
      event.preventDefault();
      const newPatient = {
        value: `new-${Date.now()}`,
        label: newPatientInput.trim(),
        phone: "",
      };
      setPatients((prev) => [...prev, newPatient]);
      setSelectedPatient(newPatient);
      setFormData({
        ...formData,
        patient: newPatient.value,
        mobileNumber: "",
        isManualPatient: true,
      });
      setNewPatientInput("");
    }
  };
  
  // Generic change handler for other fields
  const handleChangeFields = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      let cleanedValue = value.trim();
      if (cleanedValue.startsWith("88")) {
        cleanedValue = cleanedValue.substring(2);
      }
      setFormData({ ...formData, [name]: cleanedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    let cleanedMobileNumber = formData.mobileNumber.trim();
    if (!cleanedMobileNumber.startsWith("88")) {
      cleanedMobileNumber = "88" + cleanedMobileNumber;
    }
  
    const payload = {
      doctorId: selectedDoctor ? selectedDoctor.value : "",
      doctorName: selectedDoctor ? selectedDoctor.label : "",
      patientId: selectedPatient && !selectedPatient.value.startsWith("new-") ? selectedPatient.value : null,
      patientName: selectedPatient ? selectedPatient.label : "",
      appointmentDate: selectedDate, // Directly use the date selected via calendar
      consultationFee: parseFloat(formData.consultationFee),
      paymentMethod: formData.paymentMethod,
      serialNumber: formData.serialNumber || null,
      mobileNumber: cleanedMobileNumber,
      weight: formData.weight || null,
      age: formData.age || null,
      reference: formData.reference || null,
      bloodGroup: formData.bloodGroup || null,
      reason: formData.reason || "",
      address: formData.address || "",
      isNewPatient: selectedPatient && selectedPatient.value.startsWith("new-") ? true : false,
    };
  
    try {
      const response = await axios.post(`${BASE_URL}/appointment/add`, payload, {
        headers: { "x-api-key": API_KEY },
      });
      alert(response.data.message || "Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
          <FaStethoscope /> Add New Appointment
        </h2>
        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Doctor Selection */}
          <div className="mb-6">
            <label className="label flex items-center gap-2">
              <FaUserMd /> Select Doctor
            </label>
            {doctorLoading ? (
              <Skeleton height={40} />
            ) : (
              <Select
                options={doctors.map((doc) => ({
                  value: doc.id,
                  label: doc.name || (doc.translations?.en?.name ?? "Unknown Doctor"),
                }))}
                value={selectedDoctor}
                onChange={handleDoctorChange}
                placeholder="Choose a Doctor"
                isClearable
              />
            )}
          </div>
  
          {/* Calendar for Appointment Date */}
          {selectedDoctor && (
            <div className="mb-6">
              <label className="label flex items-center gap-2">
                Select Appointment Date
              </label>
              <Calendar
                onChange={(date) => {
                  setSelectedDate(date);
                  // Update available dates when month changes
                  const daysMapping = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 };
                  const availableDays = (selectedDoctor &&
                    doctors.find(doc => doc.id === selectedDoctor.value)?.schedule || []
                  ).map(sch => daysMapping[sch.day]);
                  setAvailableDates(getAvailableDatesForMonth(date, availableDays));
                }}
                value={selectedDate}
                minDate={new Date()}
                tileDisabled={({ date }) =>
                  !availableDates.some(d => d.toDateString() === date.toDateString())
                }
              />
              
            </div>
          )}
  
          {/* Patient Selection */}
          <div className="mb-6">
            <label className="label flex items-center gap-2">
              <FaUser /> Select Patient
            </label>
            {patientLoading ? (
              <Skeleton height={40} />
            ) : (
              <Select
                options={patients}
                value={selectedPatient}
                onChange={handlePatientChange}
                onInputChange={(inputValue) => setNewPatientInput(inputValue)}
                onKeyDown={handlePatientKeyDown}
                placeholder="Type and press Enter to add"
                isClearable
              />
            )}
          </div>
  
          {/* Payment Method */}
          <div className="mb-6">
            <label className="label flex items-center gap-2">
              <MdPayment /> Payment Method
            </label>
            <Select
              options={[
                { value: "CASH", label: "Cash" },
                { value: "BKASH", label: "Bkash" },
                { value: "NAGAD", label: "Nagad" },
                { value: "ROCKET", label: "Rocket" },
                { value: "BANK", label: "Bank" },
              ]}
              value={selectedPaymentMethod}
              onChange={handlePaymentMethodChange}
              placeholder="Choose Payment Method"
              isClearable
            />
          </div>
  
          {/* Fee Selection */}
          <div className="mb-6">
            <label className="label flex items-center gap-2">
              <FaMoneyBillWave /> Fee
            </label>
            <Select
              options={feeOptions}
              value={selectedFee}
              onChange={handleFeeChange}
              placeholder="Select Fee"
              isClearable
            />
          </div>
  
          {/* Serial Number */}
          <div className="mb-6">
            <label className="label flex items-center gap-2">
              <MdFormatListNumbered /> Serial Number
            </label>
            <input
              type="number"
              name="serialNumber"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              value={formData.serialNumber}
              onChange={handleChangeFields}
              placeholder="Enter Serial Number"
            />
          </div>
  
          {/* Mobile Number */}
          <div className="mb-6">
            <label className="label">Mobile Number</label>
            <input
              type="number"
              name="mobileNumber"
              className="input-field"
              value={formData.mobileNumber}
              onChange={handleChange}
              disabled={formData.isManualPatient ? false : !!selectedPatient}
            />
          </div>
  
          {/* Blood Group */}
          <div className="mb-6">
            <label className="label">Blood Group</label>
            <Select
              options={[
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
              ]}
              value={selectedBloodGroup}
              onChange={handleBloodGroupChange}
              placeholder="Select Blood Group"
              isClearable
            />
          </div>
  
          {/* Weight Field */}
          <div className="mb-6">
            <label className="label flex items-center gap-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.weight}
              onChange={handleChangeFields}
              placeholder="Enter weight in kg"
            />
          </div>
  
          {/* Age Field */}
          <div className="mb-6">
            <label className="label flex items-center gap-2">
              Age (years)
            </label>
            <input
              type="number"
              name="age"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.age}
              onChange={handleChangeFields}
              placeholder="Enter age in years"
            />
          </div>
  
          {/* Reference Field */}
          <div className="mb-6">
            <label className="label">Reference</label>
            <input
              type="text"
              name="reference"
              className="input-field"
              value={formData.reference}
              onChange={handleChangeFields}
            />
          </div>
  
          {/* Reason */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700">Reason</label>
            <textarea
              name="reason"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.reason || ""}
              onChange={handleChangeFields}
              onKeyDown={(e) => {
                if (e.key === " ") e.stopPropagation();
              }}
              placeholder="Enter the reason for the appointment"
            />
          </div>
  
          {/* Address */}
          <div className="mb-6">
            <label className="label">Address</label>
            <input
              type="text"
              name="address"
              className="input-field"
              value={formData.address}
              onChange={handleChangeFields}
            />
          </div>
  
          {/* Submit & Reset Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="reset"
              className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;
