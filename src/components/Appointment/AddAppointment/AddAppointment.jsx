import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserMd,
  FaUser,
  FaMoneyBillWave,
  FaGift,
  FaVideo,
  FaStethoscope,
} from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * TimeSlotButtons Component
 * Displays 50 slot buttons.
 * The button for the selected slot appears red; all others appear green.
 */
const TimeSlotButtons = ({ timeSlots, selectedSlot, onSlotClick }) => {
  return (
    <div className="mt-6">
      {/* Top Label */}
      <div className="mb-2">
        <span className="font-semibold">Available Slots:</span>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          <span>Available</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {timeSlots.map((slot) => {
          // If the slot's id matches the selectedSlot's id, mark it as selected (red)
          const isSelected = selectedSlot && selectedSlot.id === slot.id;
          return (
            <button
              key={slot.id}
              className={`px-3 py-2 rounded text-white font-semibold ${
                isSelected
                  ? "bg-red-500"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={() => onSlotClick(slot)}
            >
              {slot.start}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AddAppointment = () => {
  // State Variables
  const [loading, setLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [schedules, setSchedules] = useState([]);
  // timeSlots will always be an array of 50 slots (default)
  const [timeSlots, setTimeSlots] = useState([]);
  // chosenSlot stores the slot selected by the user
  const [chosenSlot, setChosenSlot] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    doctor: "",            // doctorId
    patient: "",           // patientId
    consultationFee: 0,
    vat: 0,
    promoCode: "",
    consultationType: "physical",
    paymentMethod: "",
    directorReference: "",
    scheduleId: "",        // Selected schedule id
  });

  // API Key & Base URL (adjust as needed)
  const API_KEY =
    "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079";
  const BASE_URL = "http://localhost:5000/api";

  // Fetch Doctors (assumed to include schedule info)
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

  // Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/patient`, {
          headers: { "x-api-key": API_KEY },
        });
        setPatients(response.data);
      } catch (error) {
        console.error("Error loading patients:", error);
      } finally {
        setPatientLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // Handle Doctor Change
  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    // Reset schedule, chosenSlot, and timeSlots when doctor changes
    setFormData({ ...formData, doctor: doctorId, scheduleId: "" });
    setChosenSlot(null);
    setTimeSlots([]);

    if (!doctorId) {
      setSchedules([]);
      return;
    }

    // Assume each doctor object includes a "schedule" property
    const selectedDoctor = doctors.find((doc) => doc.id === doctorId);
    if (selectedDoctor && selectedDoctor.schedule) {
      setSchedules(selectedDoctor.schedule);
    } else {
      setSchedules([]);
    }
  };

  // Handle Schedule Change
  const handleScheduleChange = async (e) => {
    const scheduleId = e.target.value;
    setFormData({ ...formData, scheduleId });
    setChosenSlot(null);
    // Generate 50 default slots (1 to 50) for this schedule regardless of booking status
    if (!scheduleId) {
      setTimeSlots([]);
      return;
    }

    try {
      setScheduleLoading(true);
      // Here, we generate 50 slots by default.
      const max = 50;
      const defaultSlots = Array.from({ length: max }, (_, i) => ({
        id: i + 1,
        start: `Slot ${i + 1}`,
        // Optionally, you can set an end time or other labels
        isBooked: false, // All slots are available by default
        serialNumber: i + 1,
      }));
      setTimeSlots(defaultSlots);
    } catch (error) {
      console.error("Error generating time slots:", error);
    } finally {
      setScheduleLoading(false);
    }
  };

  // Handle other form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // When an available time slot button is clicked, store that slot as chosen
  const handleSlotClick = (slot) => {
    setChosenSlot(slot);
    console.log("Chosen slot:", slot);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use the chosen slot's serial number if available
    const serialNumber = chosenSlot?.serialNumber || null;

    const payload = {
      doctorId: formData.doctor,
      patientId: formData.patient,
      scheduleId: formData.scheduleId || null,
      serialNumber: serialNumber,
      consultationFee: parseFloat(formData.consultationFee),
      vat: parseFloat(formData.vat),
      promoCode: formData.promoCode || null,
      consultationType: formData.consultationType.toUpperCase(),
      paymentMethod: formData.paymentMethod,
      directorReference: formData.directorReference || null,
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
            {/* Doctor Selection */}
            <div>
              <label className="label flex items-center gap-2">
                <FaUserMd /> Select Doctor
              </label>
              {doctorLoading ? (
                <Skeleton height={40} />
              ) : (
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleDoctorChange}
                  className="input-field"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name || (doc.translations?.en?.name ?? "Unknown Doctor")}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Schedule Selection */}
            {formData.doctor && (
              <div>
                <label className="label flex items-center gap-2">
                  Doctor's Schedule
                </label>
                {scheduleLoading ? (
                  <Skeleton height={40} />
                ) : schedules.length > 0 ? (
                  <select
                    name="scheduleId"
                    value={formData.scheduleId}
                    onChange={handleScheduleChange}
                    className="input-field"
                  >
                    <option value="">Select Schedule</option>
                    {schedules.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.day} ({sch.startTime} - {sch.endTime})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-red-500">No schedule available</p>
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
                <select
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <label className="label flex items-center gap-2">
                <MdPayment /> Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Payment Method</option>
                <option value="BKASH">Bkash</option>
                <option value="BANK">Bank</option>
                <option value="REFERENCE">Reference</option>
              </select>
            </div>
          </div>

          {/* Other Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Consultation Fee */}
            <div>
              <label className="label flex items-center gap-2">
                <FaMoneyBillWave /> Consultation Fee
              </label>
              <input
                type="number"
                name="consultationFee"
                value={formData.consultationFee}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter Consultation Fee"
              />
            </div>
            {/* VAT */}
            <div>
              <label className="label flex items-center gap-2">
                <FaMoneyBillWave /> VAT
              </label>
              <input
                type="number"
                name="vat"
                value={formData.vat}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter VAT Amount"
              />
            </div>
            {/* Promo Code */}
            <div>
              <label className="label flex items-center gap-2">
                <FaGift /> Promo Code
              </label>
              <input
                type="text"
                name="promoCode"
                value={formData.promoCode}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter Promo Code (Optional)"
              />
            </div>
            {/* Director Reference */}
            <div>
              <label className="label flex items-center gap-2">
                Director Reference
              </label>
              <input
                type="text"
                name="directorReference"
                value={formData.directorReference}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter Director Reference (Optional)"
              />
            </div>
            {/* Consultation Type */}
            <div>
              <label className="label flex items-center gap-2">
                <FaVideo /> Consultation Type
              </label>
              <select
                name="consultationType"
                value={formData.consultationType}
                onChange={handleChange}
                className="input-field"
              >
                <option value="physical">Physical</option>
                <option value="video_call">Video Call</option>
              </select>
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
              Discard
            </button>
          </div>
        </form>

        {/* Display Time Slots as 50 Buttons */}
        {formData.scheduleId && (
          <TimeSlotButtons
            timeSlots={timeSlots}
            selectedSlot={chosenSlot}
            onSlotClick={handleSlotClick}
          />
        )}

        {/* Display chosen slot if selected */}
        {chosenSlot && (
          <div className="mt-4 text-blue-600 font-semibold">
            Chosen Slot: {chosenSlot.start}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddAppointment;
