import React, { useState } from "react";
import { FaUser, FaEdit, FaAsterisk } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

const AddPatient = () => {
    const { i18n } = useTranslation(["addDoctor"]);
    const [profilePhoto, setProfilePhoto] = useState("https://placehold.co/100");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        gender: "",
        bloodGroup: "",
        dateOfBirth: "",
        age: "",
        weight: "",
        image: null,
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
            setFormData((prev) => ({ ...prev, image: file }));
        }
    };

    // Validate form
    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Patient name is required");
            return false;
        }
        if (!formData.phoneNumber.trim()) {
            setError("Phone number is required");
            return false;
        }
        return true;
    };

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        // Validate required fields
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("phoneNumber", formData.phoneNumber);
        
        // Only append optional fields if they have values
        if (formData.email) formDataToSend.append("email", formData.email);
        if (formData.gender) formDataToSend.append("gender", formData.gender);
        if (formData.bloodGroup) formDataToSend.append("bloodGroup", formData.bloodGroup);
        if (formData.dateOfBirth) formDataToSend.append("dateOfBirth", formData.dateOfBirth);
        if (formData.age) formDataToSend.append("age", formData.age);
        if (formData.weight) formDataToSend.append("weight", formData.weight);
        if (formData.image) formDataToSend.append("image", formData.image);

        try {
            // Make POST request to the backend API
            const response = await axios.post("https://api.muktihospital.com/api/patient/add", formDataToSend, {
                headers: {
                    "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log(response.data);
            setLoading(false);
            alert("Patient added successfully!");
            // Reset form after successful submission
            handleDiscard();
        } catch (error) {
            console.error("Error adding patient:", error);
            setLoading(false);
            setError(error.response?.data?.error || "Error adding patient. Please try again.");
        }
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
            image: null,
        });
        setProfilePhoto("https://placehold.co/100");
        setError("");
    };

    // Required field label component
    const RequiredLabel = ({ text }) => (
        <label className="label flex items-center">
            {text} <FaAsterisk className="ml-1 text-red-500 text-xs" />
        </label>
    );

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
                </div>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
                        {error}
                    </div>
                )}
                
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name - Required */}
                        <div>
                            <RequiredLabel text="Patient Name" />
                            {loading ? <Skeleton height={40} /> :
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    className="input-field" 
                                    placeholder="Enter Patient Name" 
                                    required 
                                />
                            }
                        </div>

                        {/* Phone Number - Required */}
                        <div>
                            <RequiredLabel text="Phone Number" />
                            {loading ? <Skeleton height={40} /> :
                                <input 
                                    type="tel" 
                                    name="phoneNumber" 
                                    value={formData.phoneNumber} 
                                    onChange={handleChange} 
                                    className="input-field" 
                                    placeholder="Enter Phone Number" 
                                    required 
                                />
                            }
                        </div>

                        {/* Email - Optional */}
                        <div>
                            <label className="label">Email (Optional)</label>
                            {loading ? <Skeleton height={40} /> :
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className="input-field" 
                                    placeholder="Enter Email" 
                                />
                            }
                        </div>

                        {/* Gender Dropdown - Optional */}
                        <div>
                            <label className="label">Gender (Optional)</label>
                            {loading ? <Skeleton height={40} /> :
                                <select 
                                    name="gender" 
                                    value={formData.gender} 
                                    onChange={handleChange} 
                                    className="input-field"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            }
                        </div>

                        {/* Blood Group Dropdown - Optional */}
                        <div>
                            <label className="label">Blood Group (Optional)</label>
                            {loading ? <Skeleton height={40} /> :
                                <select 
                                    name="bloodGroup" 
                                    value={formData.bloodGroup} 
                                    onChange={handleChange} 
                                    className="input-field"
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
                            }
                        </div>

                        {/* Date of Birth - Optional */}
                        <div>
                            <label className="label">Date of Birth (Optional)</label>
                            {loading ? <Skeleton height={40} /> :
                                <input 
                                    type="date" 
                                    name="dateOfBirth" 
                                    value={formData.dateOfBirth} 
                                    onChange={handleChange} 
                                    className="input-field" 
                                />
                            }
                        </div>

                        {/* Age - Optional */}
                        <div>
                            <label className="label">Age (Optional)</label>
                            {loading ? <Skeleton height={40} /> :
                                <input 
                                    type="number" 
                                    name="age" 
                                    value={formData.age} 
                                    onChange={handleChange} 
                                    className="input-field" 
                                    placeholder="Enter Age" 
                                />
                            }
                        </div>

                        {/* Weight - Optional */}
                        <div>
                            <label className="label">Weight (kg) (Optional)</label>
                            {loading ? <Skeleton height={40} /> :
                                <input 
                                    type="number" 
                                    name="weight" 
                                    value={formData.weight} 
                                    onChange={handleChange} 
                                    className="input-field" 
                                    placeholder="Enter Weight" 
                                />
                            }
                        </div>
                    </div>

                    {/* Profile Image Upload - Optional */}
                    <div className="mt-6 flex flex-col">
                        <label className="label mb-2">Profile Image (Optional)</label>
                        <div className="relative w-24 h-24">
                            {loading ? <Skeleton circle height={100} width={100} /> :
                                <img src={profilePhoto} alt="Profile" className="rounded-full border shadow-md" />}
                            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                                <FaEdit />
                                <input type="file" className="hidden" onChange={handleProfilePhotoChange} />
                            </label>
                        </div>
                    </div>

                    {/* Legend for required fields */}
                    <div className="mt-4 text-sm text-gray-500 flex items-center">
                        <FaAsterisk className="mr-1 text-red-500 text-xs" /> Required fields
                    </div>

                    {/* Submit & Discard Buttons */}
                    <div className="mt-6 flex gap-4">
                        <button 
                            type="submit" 
                            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition" 
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                        <button 
                            type="button" 
                            onClick={handleDiscard} 
                            className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition" 
                            disabled={loading}
                        >
                            Discard
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPatient;