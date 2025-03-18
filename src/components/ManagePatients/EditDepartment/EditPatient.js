import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { FaEdit } from "react-icons/fa";

/**
 * Example of converting Bengali digits to English digits
 * if you have numeric fields typed in Bangla.
 */
function convertBengaliToEnglish(str) {
  const map = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return str.replace(/[০-৯]/g, (digit) => map[digit]);
}

// Helper function to format date to 'YYYY-MM-DD'
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const EditPatient = () => {
  const { id } = useParams(); // patient id from URL
  const navigate = useNavigate();

  // Language selection for translations
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Patient data shape
  const [patientData, setPatientData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    gender: "",
    bloodGroup: "",
    dateOfBirth: "",
    age: "",
    weight: "",
    image: null, // existing image path from DB
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If a new image is chosen
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) Fetch existing patient data
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.muktihospital.com/api/patient/${id}`,
          {
            headers: {
              "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079", // Set your API key here
            },
          }
        );

        if (response.status === 200) {
          const patient = response.data;
          setPatientData({
            name: patient.name || "",
            phoneNumber: patient.phoneNumber || "",
            email: patient.email || "",
            gender: patient.gender || "",
            bloodGroup: patient.bloodGroup || "",
            dateOfBirth: patient.dateOfBirth ? formatDate(patient.dateOfBirth) : "", // Format the date
            age: patient.age || "",
            weight: patient.weight || "",
            image: patient.image || null,
          });
        } else {
          toast.error("Failed to load patient details.");
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        toast.error("Could not load patient.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) Handle language switch
  // ─────────────────────────────────────────────────────────────────────────────
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) Input field changes
  // ─────────────────────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert digits if needed
    const convertedValue = convertBengaliToEnglish(value);

    setPatientData((prev) => ({
      ...prev,
      [name]: convertedValue,
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) File input change
  // ─────────────────────────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      // Create a local preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) Submit form
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", patientData.name);
      formData.append("phoneNumber", patientData.phoneNumber);
      formData.append("email", patientData.email);
      formData.append("gender", patientData.gender);
      formData.append("bloodGroup", patientData.bloodGroup);
      formData.append("dateOfBirth", patientData.dateOfBirth);
      formData.append("age", patientData.age);
      formData.append("weight", patientData.weight);

      // Append image if it's provided
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.put(
        `https://api.muktihospital.com/api/patient/edit/${id}`,
        formData,
        {
          headers: {
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079", // Set your API key here
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Patient updated successfully!");
        navigate("/all-patient");  // Redirect to patient list page
      } else {
        toast.error("Failed to update patient.");
      }
    } catch (error) {
      console.error("❌ Error updating patient:", error);
      toast.error("An error occurred while updating the patient.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // If loading
  // ─────────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton height={30} count={6} />
      </div>
    );
  }
console.log(patientData.image);

  // ─────────────────────────────────────────────────────────────────────────────
  // Render form
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Patient</h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="label">Patient Name</label>
              {isLoading ? <Skeleton height={40} /> : 
                <input type="text" name="name" value={patientData.name} onChange={handleInputChange} className="input-field" placeholder="Enter Patient Name" />
              }
            </div>

            {/* Phone Number */}
            <div>
              <label className="label">Phone Number</label>
              {isLoading ? <Skeleton height={40} /> : 
                <input type="tel" name="phoneNumber" value={patientData.phoneNumber} onChange={handleInputChange} className="input-field" placeholder="Enter Phone Number" />
              }
            </div>

            {/* Email */}
            <div>
              <label className="label">Email</label>
              {isLoading ? <Skeleton height={40} /> : 
                <input type="email" name="email" value={patientData.email} onChange={handleInputChange} className="input-field" placeholder="Enter Email" />
              }
            </div>

            {/* Gender */}
            <div>
              <label className="label">Gender</label>
              {isLoading ? <Skeleton height={40} /> : 
                <select name="gender" value={patientData.gender} onChange={handleInputChange} className="input-field">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              }
            </div>

            {/* Blood Group */}
            <div>
              <label className="label">Blood Group</label>
              {isLoading ? <Skeleton height={40} /> : 
                <select name="bloodGroup" value={patientData.bloodGroup} onChange={handleInputChange} className="input-field">
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

            {/* Date of Birth */}
            <div>
              <label className="label">Date of Birth</label>
              {isLoading ? <Skeleton height={40} /> : 
                <input type="date" name="dateOfBirth" value={patientData.dateOfBirth} onChange={handleInputChange} className="input-field" />
              }
            </div>

            {/* Age */}
            <div>
              <label className="label">Age</label>
              {isLoading ? <Skeleton height={40} /> : 
                <input type="number" name="age" value={patientData.age} onChange={handleInputChange} className="input-field" placeholder="Enter Age" />
              }
            </div>

            {/* Weight */}
            <div>
              <label className="label">Weight (kg)</label>
              {isLoading ? <Skeleton height={40} /> : 
                <input type="number" name="weight" value={patientData.weight} onChange={handleInputChange} className="input-field" placeholder="Enter Weight" />
              }
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="mt-6 flex flex-col">
  <div className="relative w-24 h-24">
    {isLoading ? <Skeleton circle height={100} width={100} /> : 
      <img
        src={patientData.image ? `https://api.muktihospital.com/${patientData.image}` : '/default-image.jpg'} // Default image if none exists
        alt="Patient Image"
        className="w-20 h-20 object-cover rounded"
      />
    }
    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
      <FaEdit />
      <input type="file" className="hidden" onChange={handleFileChange} />
    </label>
  </div>
</div>


          {/* Submit & Discard Buttons */}
          <div className="mt-6 flex gap-4">
            <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={() => navigate("/all-patient")} className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition" disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatient;
