import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

const AddCategory = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [categoryData, setCategoryData] = useState({
    translations: {
      en: { name: "", description: "", metaTitle: "", metaDescription: "" },
      bn: { name: "", description: "", metaTitle: "", metaDescription: "" },
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const convertedValue = convertBengaliToEnglish(value);

    setCategoryData((prev) => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const response = await axios.post("https://api.muktihospital.com/api/category", 
        { translations: categoryData.translations }, // Send JSON directly
        {
          headers: {
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 201) {
        toast.success("Category added successfully!");
        setCategoryData({
          translations: {
            en: { name: "", description: "", metaTitle: "", metaDescription: "" },
            bn: { name: "", description: "", metaTitle: "", metaDescription: "" },
          },
        });
      } else {
        toast.error("Failed to add category.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("An error occurred while adding the category.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>

        {/* Language dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Language:</label>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="border p-2 rounded w-full"
          >
            <option value="en">English</option>
            <option value="bn">Bangla</option>
          </select>
        </div>

        {/* Category Form */}
        <form onSubmit={handleSubmit}>
          {/* 1) Category Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Category Name</label>
            {isSubmitting ? (
              <Skeleton height={35} />
            ) : (
              <input
                type="text"
                name="name"
                placeholder="Enter Category Name"
                className="border p-2 rounded w-full"
                value={categoryData.translations[selectedLanguage].name}
                onChange={handleChange}
              />
            )}
          </div>

          {/* 2) Category Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Category Description</label>
            {isSubmitting ? (
              <Skeleton height={35} />
            ) : (
              <input
                type="text"
                name="description"
                placeholder="Enter Category Description"
                className="border p-2 rounded w-full"
                value={categoryData.translations[selectedLanguage].description}
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
                value={categoryData.translations[selectedLanguage].metaTitle}
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
                value={categoryData.translations[selectedLanguage].metaDescription}
                onChange={handleChange}
              />
            )}
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

export default AddCategory;
