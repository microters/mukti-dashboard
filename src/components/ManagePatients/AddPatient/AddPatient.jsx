import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaAsterisk } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PageHeading from "../../PageHeading";
import ImageUploader from "../../ImageUploader";

const AddPatient = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation(["addDoctor"]);
  const [profilePhoto, setProfilePhoto] = useState("https://placehold.co/100");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

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

  const breadcrumbs = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Manage Patients', url: '/patients' },
    { label: 'Add New Patient' }
  ];

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "https://api.muktihospital.com/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle input changes
  // Handle input changes
  const handleChange = (e) => {
    let { name, value } = e.target;

    // Special handling for phone number
    if (name === "phoneNumber") {
      // Remove any non-numeric characters
      value = value.replace(/\D/g, "");

      // If the number doesn't start with 88, prepend it
      if (!value.startsWith("88")) {
        value = "88" + value;
      }

      // Limit to 13 characters (88 + 11 digit number)
      value = value.slice(0, 13);
    }

    setFormData({ ...formData, [name]: value });
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
    if (formData.bloodGroup)
      formDataToSend.append("bloodGroup", formData.bloodGroup);
    if (formData.dateOfBirth)
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    if (formData.age) formDataToSend.append("age", formData.age);
    if (formData.weight) formDataToSend.append("weight", formData.weight);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      // Get authentication token
      const token = localStorage.getItem("authToken");

      // Make POST request to the backend API
      const response = await axios.post(
        "https://api.muktihospital.com/api/patient/add",
        formDataToSend,
        {
          headers: {
            "x-api-key":
              "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
        }
      );

      console.log(response.data);
      setLoading(false);
      alert("Patient added successfully!");

      // Reset form after successful submission
      handleDiscard();

      // Navigate to patients list or patient details
      navigate("/patients");
    } catch (error) {
      console.error("Error adding patient:", error);
      setLoading(false);

      // Handle specific error scenarios
      if (error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.error || "Invalid patient data");
        } else if (error.response.status === 401) {
          setError("Authentication failed. Please log in again.");
          navigate("/login");
        } else {
          setError(
            error.response.data.error ||
              "Error adding patient. Please try again."
          );
        }
      } else if (error.request) {
        setError(
          "No response from server. Please check your internet connection."
        );
      } else {
        setError("Error preparing patient data. Please try again.");
      }
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

  // If user is not loaded, show loading
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeading title="Add Patient" breadcrumbs={breadcrumbs} />
      <div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Heading Part */}
          <div className="grid grid-cols-2 gap-6 items-start">
            <div className="bg-white shadow-lg rounded-lg">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  Basic Information
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
                {/* Name - Required */}
                <div>
                  <label className="label">
                    Patient Name{" "}
                    <span className="ml-1 text-red-500 text-base">*</span>
                  </label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter Patient Name"
                      required
                    />
                  )}
                </div>

                {/* Phone Number - Required */}
                <div>
                  <label className="label">
                    Phone Number{" "}
                    <span className="ml-1 text-red-500 text-base">*</span>
                  </label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter Phone Number"
                      required
                    />
                  )}
                </div>

                {/* Email - Optional */}
                <div>
                  <label className="label">Email (Optional)</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter Email"
                    />
                  )}
                </div>

                {/* Gender Dropdown - Optional */}
                <div>
                  <label className="label">Gender (Optional)</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
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
                  )}
                </div>

                {/* Blood Group Dropdown - Optional */}
                <div>
                  <label className="label">Blood Group (Optional)</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
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
                  )}
                </div>

                {/* Date of Birth - Optional */}
                <div>
                  <label className="label">Date of Birth (Optional)</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="input-field"
                    />
                  )}
                </div>

                {/* Age - Optional */}
                <div>
                  <label className="label">Age (Optional)</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter Age"
                    />
                  )}
                </div>

                {/* Weight - Optional */}
                <div>
                  <label className="label">Weight (kg) (Optional)</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="Enter Weight"
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Image Uploader */}
            <div className="bg-white shadow-lg rounded-lg">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  Upload Profile Photo
                </h2>
              </div>

              <div className="p-5">
                {/* Profile Image Upload - Optional */}
                {/* <div className="mt-6 flex flex-col">
                    <label className="label mb-2">Profile Image (Optional) <span className="mr-1 text-red-500 text-base" >*</span></label>
                    <div className="relative w-24 h-24">
                      {loading ? (
                        <Skeleton circle height={100} width={100} />
                      ) : (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="rounded-full w-24 h-24 border shadow-md object-cover"
                        />
                      )}
                      <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                        <FaEdit />
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleProfilePhotoChange}
                        />
                      </label>
                    </div>
                  </div> */}

                <ImageUploader />
              </div>
            </div>
          </div>

          {/* Submit & Discard Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-M-primary-color/90 text-sm text-white py-2 px-6 rounded-md hover:bg-M-primary-color transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleDiscard}
              className="bg-[#E7633D]/90 text-sm text-white py-2 px-6 rounded-md hover:bg-[#E7633D] transition-all duration-300"
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
