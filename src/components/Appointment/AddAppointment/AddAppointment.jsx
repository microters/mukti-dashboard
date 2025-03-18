import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import {
  FaUserMd,
  FaUser,
  FaMoneyBillWave,
  FaStethoscope,
} from "react-icons/fa";
import { MdFormatListNumbered, MdPayment, MdPersonSearch } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AddAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
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
    scheduleId: "",
    mobileNumber: "",
    weight: "",
    age: "", 
    isManualPatient: false,
  });

  const API_KEY = "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079";
  const BASE_URL = "https://api.muktihospital.com/api";

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctor`, {
          headers: { "x-api-key": API_KEY },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error loading doctors:", error);
      } finally {
        setDoctorLoading(false);
      }
    };
    fetchDoctors();
  }, []);

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
      setSelectedSchedule(null);
      setFeeOptions([]);
      setSelectedFee(null);
      return;
    }

    const doctor = doctors.find((doc) => doc.id === selectedOption.value);
    setSchedules(doctor?.schedule || []);

    if (doctor) {
      const appointmentFee = doctor.translations?.en?.appointmentFee;
      const followUpFee = doctor.translations?.en?.followUpFee;
      setFeeOptions([
        { value: appointmentFee, label: `Appointment Fee (${appointmentFee})` },
        { value: followUpFee, label: `Follow-Up Fee (${followUpFee})` },
      ]);
      setSelectedFee(null);
    }
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const payload = {
      doctorId: formData.doctor,
      patientId: formData.patient,
      scheduleId: formData.scheduleId || null,
      consultationFee: parseFloat(formData.consultationFee),
      paymentMethod: formData.paymentMethod,
      reference: formData.reference || null,
      serialNumber: formData.serialNumber || null,
      mobileNumber: formData.mobileNumber || null,
      weight: formData.weight || null,
      age: formData.age || null, 
      bloodGroup: formData.bloodGroup || null,
      reason: formData.reason || "",
      address: formData.address || "",
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
        <p className="text-gray-500 text-sm mt-2">
          Fill out the form below to book an appointment.
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Selection with React-Select */}
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

            {/* Schedule Selection with React-Select */}
            {formData.doctor && (
              <div>
                <label className="label flex items-center gap-2">
                  Doctor's Schedule
                </label>
                {scheduleLoading ? (
                  <Skeleton height={40} />
                ) : schedules.length > 0 ? (
                  <Select
                    options={schedules.map((sch) => ({
                      value: sch.id,
                      label: `${sch.day} (${sch.startTime} - ${sch.endTime})`,
                    }))}
                    value={selectedSchedule}
                    onChange={handleScheduleChange}
                    placeholder="Choose a Schedule"
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                ) : (
                  <p className="text-red-500">No schedule available</p>
                )}
              </div>
            )}

            {/* Patient Selection with Injection Feature */}
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
            {/* Payment Method Selection */}
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
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
              {/* Fee Selection - Shows Only Numeric Value After Selection */}
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
                className="react-select-container"
                classNamePrefix="react-select"
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
              {/* Mobile Number - Auto-filled & Editable for New Patients */}
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
              <label className="label flex items-center gap-2">
                <MdPersonSearch /> Reference
              </label>
              <input
                type="text"
                name="reference"
                className="input-field"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Enter Reference Name or ID"
              />
            </div>

           {/* Reason */}
            <div>
              <label className="text-sm font-medium text-gray-700">Reason</label>
              <textarea
                name="reason"
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter the reason for the appointment"
              />
            </div>
             {/* Address */}
             <div>
              <label className="label">Address</label>
              <input type="text" name="address" className="input-field" value={formData.address} onChange={handleChange} />
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




