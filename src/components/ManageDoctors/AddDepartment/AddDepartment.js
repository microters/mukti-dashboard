import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

const AddDepartment = () => {
  // Which language is currently being edited (e.g. "en", "bn", etc.):
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [icon, setIcon] = useState(null); // Stores file
  const [previewIcon, setPreviewIcon] = useState(null); // Stores image preview
  // All fields are placed inside "translations" by language:
  // translations.en = { name, description, metaTitle, metaDescription }
  // translations.bn = { name, description, metaTitle, metaDescription }
  const [departmentData, setDepartmentData] = useState({
    translations: {
      en: {
        name: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
      },
      bn: {
        name: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
      },
    },
  });

  // For showing a loader or disabling form while submitting:
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------------------------------------------------
  //  Helper to convert Bengali digits to English digits
  // ---------------------------------------------------------
  function convertBengaliToEnglish(str) {
    const mapDigits = {
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
    return str.replace(/[০-৯]/g, (digit) => mapDigits[digit]);
  }

  // ---------------------------------------------------------
  //  Handle language dropdown change
  // ---------------------------------------------------------
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  // ---------------------------------------------------------
  //  Handle input changes for each field in the translations
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    // convert digits if you want
    const convertedValue = convertBengaliToEnglish(value);

    // e.g. name could be "name", "description", "metaTitle", or "metaDescription".
    setDepartmentData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [selectedLanguage]: {
          ...prev.translations[selectedLanguage],
          [name]: convertedValue,
        },
      },
    }));
  };
// ✅ Handle file (icon) selection
const handleFileChange = (e) => {
  const file = e.target.files[0];
  setIcon(file);

  // Preview the selected image
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => setPreviewIcon(reader.result);
    reader.readAsDataURL(file);
  }
};
  // ---------------------------------------------------------
  //  Handle form submission
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("translations", JSON.stringify(departmentData.translations));
      if (icon) {
        formData.append("icon", icon); // Append file if selected
      }

      const response = await axios.post("http://localhost:5000/api/department", formData, {
        headers: {
          "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Department added successfully!");
        setDepartmentData({
          translations: {
            en: { name: "", description: "", metaTitle: "", metaDescription: "" },
            bn: { name: "", description: "", metaTitle: "", metaDescription: "" },
          },
        });
        setIcon(null);
        setPreviewIcon(null);
      } else {
        toast.error("Failed to add department.");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("An error occurred while adding the department.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // ---------------------------------------------------------
  //  Render form
  // ---------------------------------------------------------
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className=" bg-white shadow-lg rounded p-6">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-4">Add Department</h2>
          {/* Language dropdown */}
          <div className="mb-4">
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="border p-2 rounded w-full"
            >
              <option value="en">English</option>
              <option value="bn">Bangla</option>
              {/* Add more languages if needed */}
            </select>
          </div>
        </div>
        {/* Department Form */}
        <form onSubmit={handleSubmit}>
          {/* 1) Department Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Department Name</label>
            {isSubmitting ? (
              <Skeleton height={35} />
            ) : (
              <input
                type="text"
                name="name"
                placeholder="Enter Department Name"
                className="border p-2 rounded w-full"
                value={departmentData.translations[selectedLanguage].name}
                onChange={handleChange}
              />
            )}
          </div>

          {/* 2) Department Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Department Description</label>
            {isSubmitting ? (
              <Skeleton height={35} />
            ) : (
              <input
                type="text"
                name="description"
                placeholder="Enter Department Description"
                className="border p-2 rounded w-full"
                value={departmentData.translations[selectedLanguage].description}
                onChange={handleChange}
              />
            )}
          </div>

          {/* 3) Meta Title */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Meta Title</label>
            {isSubmitting ? (
              <Skeleton height={35} />
            ) : (
              <input
                type="text"
                name="metaTitle"
                placeholder="Enter Meta Title (SEO)"
                className="border p-2 rounded w-full"
                value={departmentData.translations[selectedLanguage].metaTitle}
                onChange={handleChange}
              />
            )}
          </div>

          {/* 4) Meta Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Meta Description</label>
            {isSubmitting ? (
              <Skeleton height={50} />
            ) : (
              <textarea
                name="metaDescription"
                placeholder="Enter Meta Description (SEO)"
                className="border p-2 rounded w-full h-20"
                value={departmentData.translations[selectedLanguage].metaDescription}
                onChange={handleChange}
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Upload Icon</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" />
            {previewIcon && <img src={previewIcon} alt="Icon Preview" className="mt-2 w-24 h-24 rounded-lg shadow" />}
          </div>
          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
