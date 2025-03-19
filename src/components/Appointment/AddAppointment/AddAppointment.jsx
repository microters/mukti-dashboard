import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import {
  FaUserMd, FaUser, FaMoneyBillWave, FaStethoscope
} from "react-icons/fa";
import { MdFormatListNumbered, MdPayment } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useDoctors from "../../../hook/useDoctors";


const AddAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [patientLoading, setPatientLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const { doctors, loading: doctorLoading, fetchDoctors } = useDoctors();
  const [patients, setPatients] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [availableSchedules, setAvailableSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedFee, setSelectedFee] = useState(null);
  const [feeOptions, setFeeOptions] = useState([]);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [newPatientInput, setNewPatientInput] = useState("");
  const [hasScheduleForToday, setHasScheduleForToday] = useState(false);

  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    consultationFee: "",
    paymentMethod: "",
    reference: "",
    scheduleId: "",
    mobileNumber: "",
    weight: "",
    age: "",
    isManualPatient: false,
  });

  const API_KEY = "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079";  // Change to your API key
  const BASE_URL = "https://api.muktihospital.com/api";  // Change to your backend API URL

  useEffect(() => {
    // Fetch doctors using the useDoctors hook
    fetchDoctors();
  }, [fetchDoctors]);
  
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
  
  const handleDoctorChange = (selectedOption) => {
    setSelectedDoctor(selectedOption);
    setFormData({ ...formData, doctor: selectedOption?.value || "" });

    if (!selectedOption) {
      setSchedules([]);
      setAvailableSchedules([]);
      setSelectedSchedule(null);
      setFeeOptions([]);
      setSelectedFee(null);
      setHasScheduleForToday(false);
      return;
    }

    setScheduleLoading(true);
    const doctor = doctors.find((doc) => doc.id === selectedOption.value);
    
    if (doctor) {
      // Get current day of the week (Sunday, Monday, etc.)
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const today = new Date();
      const currentDayName = daysOfWeek[today.getDay()];
      
      // Store all schedules
      setSchedules(doctor?.schedule || []);
      
      // Filter schedules for today
      const todaySchedules = doctor?.schedule?.filter(sch => 
        sch.day === currentDayName
      ) || [];
      
      setAvailableSchedules(todaySchedules);
      setHasScheduleForToday(todaySchedules.length > 0);

      // Set fee options
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

  const handleFeeChange = (selectedOption) => {
    if (selectedOption) {
      setSelectedFee({ value: selectedOption.value, label: selectedOption.value });
      setFormData({ ...formData, consultationFee: selectedOption.value });
    } else {
      setSelectedFee(null);
      setFormData({ ...formData, consultationFee: "" });
    }
  };

  const handlePatientChange = (selectedOption) => {
    setSelectedPatient(selectedOption);
    setFormData({
      ...formData,
      patient: selectedOption?.value || "",
      mobileNumber: selectedOption?.phone || "",
      isManualPatient: false,
    });
  };

  const handleScheduleChange = (selectedOption) => {
    setSelectedSchedule(selectedOption);
    setFormData({ ...formData, scheduleId: selectedOption?.value || "" });
  };

  const handlePaymentMethodChange = (selectedOption) => {
    setSelectedPaymentMethod(selectedOption);
    setFormData({ ...formData, paymentMethod: selectedOption?.value || "" });
  };

  const handleBloodGroupChange = (selectedOption) => {
    setSelectedBloodGroup(selectedOption);
    setFormData({ ...formData, bloodGroup: selectedOption?.value || "" });
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling only for mobile number
    if (name === 'mobileNumber') {
      let cleanedValue = value.trim();
      // Remove leading '88' or any country code if already added
      if (cleanedValue.startsWith('88')) {
        cleanedValue = cleanedValue.substring(2);
      }
      setFormData({ ...formData, [name]: cleanedValue });
    } else {
      // For all other fields including "reason", preserve spaces
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    let cleanedMobileNumber = formData.mobileNumber.trim();
  
    // Add '88' as the country code if it doesn't already have it
    if (!cleanedMobileNumber.startsWith('88')) {
      cleanedMobileNumber = '88' + cleanedMobileNumber;  // Prepend '88' country code
    }
  
    const payload = {
      doctorId: selectedDoctor ? selectedDoctor.value : "",
      doctorName: selectedDoctor ? selectedDoctor.label : "",
      patientId: selectedPatient && !selectedPatient.value.startsWith("new-") ? selectedPatient.value : null,
      patientName: selectedPatient ? selectedPatient.label : "",
      scheduleId: formData.scheduleId || null,
      consultationFee: parseFloat(formData.consultationFee),
      paymentMethod: formData.paymentMethod,
      serialNumber: formData.serialNumber || null,
      mobileNumber: cleanedMobileNumber,  // Use mobile number with '88' prepended
      weight: formData.weight || null,
      age: formData.age || null,
      reference: formData.reference || null,
      bloodGroup: formData.bloodGroup || null,
      reason: formData.reason || "",  // Preserve spaces in reason
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Selection */}
            <div>
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
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              )}
            </div>
            {/* Schedule Selection */}
            {selectedDoctor && (
              <div>
                <label className="label flex items-center gap-2">
                  Doctor's Schedule
                </label>
                {scheduleLoading ? (
                  <Skeleton height={40} />
                ) : hasScheduleForToday ? (
                  <Select
                    options={availableSchedules.map((sch) => ({
                      value: sch.id,
                      label: `${sch.day} (${sch.startTime} - ${sch.endTime})`,
                    }))}
                    value={selectedSchedule}
                    onChange={handleScheduleChange}
                    placeholder="Choose a Schedule"
                    isClearable
                  />
                ) : (
                  <div className="text-red-500 py-2 px-3 bg-red-50 rounded border border-red-200">
                    Schedule Not Found. Doctor is not available today.
                  </div>
                )}
              </div>
            )}

            {/* Patient Selection */}
            <div>
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
            <div>
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
            <div>
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
            <div>
              <label className="label flex items-center gap-2">
                <MdFormatListNumbered /> Serial Number
              </label>
              <input
                type="number"
                name="serialNumber"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="Enter Serial Number"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="label">Mobile Number</label>
              <input
                type="number"
                name="mobileNumber"
                className="input-field mt-0"
                value={formData.mobileNumber}
                onChange={handleChange}
                disabled={formData.isManualPatient ? false : !!selectedPatient}
              />
            </div>

            {/* Blood Group */}
            <div>
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
            <div>
              <label className="label flex items-center gap-2">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter weight in kg"
              />
            </div>

            {/* Age Field */}
            <div>
              <label className="label flex items-center gap-2">
                Age (years)
              </label>
              <input
                type="number"
                name="age"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter age in years"
              />
            </div>
             {/* Reference Field */}
            <div>
              <label className="label">Reference</label>
              <input
                type="text"
                name="reference"
                className="input-field"
                value={formData.reference}
                onChange={handleChange}
              />
            </div>
            {/* Reason */}
            <div>
              <label className="text-sm font-medium text-gray-700">Reason</label>
              <textarea
                name="reason"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.reason || ''}
                onChange={handleChange}
                onKeyDown={(e) => {
                  // Prevent any special handling of space key
                  if (e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
                placeholder="Enter the reason for the appointment"
              />
            </div>

            {/* Address */}
            <div>
              <label className="label">Address</label>
              <input
                type="text"
                name="address"
                className="input-field"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
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