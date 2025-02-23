import React, { useState } from "react";
import { FaUserMd, FaUser, FaMoneyBillWave, FaGift, FaVideo, FaStethoscope } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { BsBank, BsCashCoin } from "react-icons/bs";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AddAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctor: "",
    patient: "",
    consultationFee: 0,
    vat: 0,
    promoCode: "",
    consultationType: "physical",
    paymentMethod: "",
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert("Appointment successfully added!");
    }, 2000);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
          <FaStethoscope /> Add New Appointment
        </h2>
        <p className="text-gray-500 text-sm mt-2">Fill in the details below to book an appointment.</p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Doctor Selection */}
            <div>
              <label className="label flex items-center gap-2"><FaUserMd /> Select Doctor</label>
              {loading ? <Skeleton height={40} /> :
                <select name="doctor" value={formData.doctor} onChange={handleChange} className="input-field">
                  <option value="">Choose Doctor</option>
                  <option value="dr_ahmed">Dr. Ahmed</option>
                  <option value="dr_khan">Dr. Khan</option>
                </select>
              }
            </div>

            {/* Patient Selection */}
            <div>
              <label className="label flex items-center gap-2"><FaUser /> Select Patient</label>
              {loading ? <Skeleton height={40} /> :
                <select name="patient" value={formData.patient} onChange={handleChange} className="input-field">
                  <option value="">Choose Patient</option>
                  <option value="john_doe">John Doe</option>
                  <option value="jane_smith">Jane Smith</option>
                </select>
              }
            </div>

            {/* Payment Details */}
            <div>
              <label className="label flex items-center gap-2"><FaMoneyBillWave /> Consultation Fee</label>
              {loading ? <Skeleton height={40} /> :
                <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} className="input-field" placeholder="Enter Consultation Fee" />}
            </div>

            <div>
              <label className="label flex items-center gap-2"><FaMoneyBillWave /> VAT</label>
              {loading ? <Skeleton height={40} /> :
                <input type="number" name="vat" value={formData.vat} onChange={handleChange} className="input-field" placeholder="Enter VAT Amount" />}
            </div>

            {/* Promo Code */}
            <div>
              <label className="label flex items-center gap-2"><FaGift /> Promo Code</label>
              {loading ? <Skeleton height={40} /> :
                <input type="text" name="promoCode" value={formData.promoCode} onChange={handleChange} className="input-field" placeholder="Enter Promo Code (Optional)" />}
            </div>

            {/* Type of Consultation */}
            <div>
              <label className="label flex items-center gap-2"><FaVideo /> Type of Consultation</label>
              {loading ? <Skeleton height={40} /> :
                <select name="consultationType" value={formData.consultationType} onChange={handleChange} className="input-field">
                  <option value="physical">Physical</option>
                  <option value="video_call">Video Call</option>
                </select>
              }
            </div>

            {/* Payment Methods */}
            <div>
              <label className="label flex items-center gap-2"><MdPayment /> Payment Method</label>
              {loading ? <Skeleton height={40} /> :
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="input-field">
                  <option value="">Select Payment Method</option>
                  <option value="bkash">Bkash</option>
                  <option value="bank"><BsBank /> Bank</option>
                  <option value="reference"><BsCashCoin /> Reference</option>
                </select>
              }
            </div>
          </div>

          {/* Submit & Discard Buttons */}
          <div className="mt-6 flex gap-4">
            <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button type="reset" className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition">
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;
