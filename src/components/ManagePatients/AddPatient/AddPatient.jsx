import React, { useState } from "react";
import { FaUser, FaEdit} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AddPatient = () => {
    const { i18n } = useTranslation(["addDoctor"]);
    const [profilePhoto, setProfilePhoto] = useState("https://placehold.co/100");

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        gender: "",
        bloodGroup: "",
        dateOfBirth: "",
        age: "",
        weight: "",
    });

      // Handle Language Change
   const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
   };

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle Profile Photo Upload
    const handleProfilePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePhoto(URL.createObjectURL(file));

            // Store file in formData (if needed for backend upload)
            setFormData((prev) => ({ ...prev, image: file }));
        }
    };

    // Form Submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const patientData = {
            ...formData,
            image: profilePhoto.name,
        };
        console.log("Submitted Data:", patientData);
    };

    // Reset Form
    const handleDiscard = () => {
        setFormData({
            name: "",
            phoneNumber: "",
            email: "",
            gender: "",
            bloodGroup: "",
            dateOfBirth: "",
            age: "",
            weight: "",
        });
        setProfilePhoto("https://placehold.co/100");
    };

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
                          <FaUser /> Add Patient
                        </h2>
                        <p className="text-gray-500 text-sm mt-2">Fill in the details below to register a new patient.</p>
                    </div>
                        {/* Language switcher */}
                        <div className="mb-4">
                        <select
                            className="p-2 border rounded-md"
                            onChange={handleLanguageChange}
                            value={i18n.language}
                        >
                        <option value="en">English</option>
                        <option value="bn">Bangla</option>
                        </select>
                    </div>
                </div>
                <form className="mt-6" onSubmit={handleSubmit}>
                    {/* Grid Layout for Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="label">Patient Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Enter Patient Name" />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="label">Phone Number</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="input-field" placeholder="Enter Phone Number" />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="label">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="Enter Email" />
                        </div>

                        {/* Gender Dropdown */}
                        <div>
                            <label className="label">Gender</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Blood Group Dropdown */}
                        <div>
                            <label className="label">Blood Group</label>
                            <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input-field">
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

                        {/* Date of Birth */}
                        <div>
                            <label className="label">Date of Birth</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="input-field" />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="label">Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" placeholder="Enter Age" />
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="label">Weight (kg)</label>
                            <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="input-field" placeholder="Enter Weight" />
                        </div>
                    </div>

                    {/* Profile Image Upload */}
                    <div className="mt-6 flex flex-col">
                        <div className="relative w-24 h-24">
                            <img src={profilePhoto} alt="Profile" className="rounded-full border shadow-md" />
                            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                                <FaEdit />
                                <input type="file" className="hidden" onChange={handleProfilePhotoChange} />
                            </label>
                        </div>
                    </div>

                    {/* Submit & Discard Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition">Submit</button>
                        <button type="button" onClick={handleDiscard} className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition">Discard</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;
