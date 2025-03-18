import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Converts Bengali digits to English digits
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

const EditCategory = () => {
  const { id } = useParams(); // Get category ID from URL
  const navigate = useNavigate();

  // Language selection for translations
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Category data shape
  const [categoryData, setCategoryData] = useState({
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

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) Fetch existing category data
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/category/${id}?lang=${selectedLanguage}`,
          {
            headers: {
              "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            },
          }
        );

        if (response.status === 200) {
          const cat = response.data;
          // Merge fetched fields into the current state for the selected language
          setCategoryData((prev) => ({
            ...prev,
            translations: {
              ...prev.translations,
              [selectedLanguage]: {
                name: cat.translations.name || "",
                description: cat.translations.description || "",
                metaTitle: cat.translations.metaTitle || "",
                metaDescription: cat.translations.metaDescription || "",
              },
            },
          }));
        } else {
          toast.error("Failed to load category details.");
        }
      } catch (error) {
        console.error("❌ Error fetching category:", error);
        toast.error("Could not load category.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [id, selectedLanguage]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) Handle language switch
  // ─────────────────────────────────────────────────────────────────────────────
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) Handle input changes for category fields
  // ─────────────────────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const convertedValue = convertBengaliToEnglish(value);
  
    setCategoryData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [selectedLanguage]: {
          ...prev.translations[selectedLanguage], // ✅ আগের ডাটা হারিয়ে না যায়
          [name]: convertedValue,
        },
      },
    }));
  
    console.log("🔹 Updated Input:", categoryData.translations);
  };
  

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) Submit the updated category data
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const dataToSend = { translations: categoryData.translations };
  
      console.log("🔹 Sending Data:", JSON.stringify(dataToSend, null, 2));
  
      const response = await axios.put(
        `http://localhost:5000/api/category/${id}`,
        dataToSend, // ✅ JSON হিসেবে পাঠাচ্ছি
        {
          headers: {
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            "Content-Type": "application/json", // ✅ JSON হিসেবে পাঠাতে হবে
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("Category updated successfully!");
        navigate("/all-category");
      } else {
        toast.error("Failed to update category.");
      }
    } catch (error) {
      console.error("❌ Error updating category:", error);
      toast.error("An error occurred while updating the category.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  
  
  

  // ─────────────────────────────────────────────────────────────────────────────
  // If loading, show skeleton UI
  // ─────────────────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton height={30} count={6} />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Render the form
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>

        {/* Language dropdown */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Language:</label>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            disabled={isSubmitting}
            className="border p-2 rounded w-full"
          >
            <option value="en">English</option>
            <option value="bn">Bangla</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Category Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Category Name</label>
            <input
              type="text"
              name="name"
              className="border p-2 rounded w-full"
              disabled={isSubmitting}
              value={categoryData.translations[selectedLanguage]?.name || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Category Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Category Description</label>
            <textarea
              name="description"
              className="border p-2 rounded w-full h-20"
              disabled={isSubmitting}
              value={categoryData.translations[selectedLanguage]?.description || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Meta Title */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              className="border p-2 rounded w-full"
              disabled={isSubmitting}
              value={categoryData.translations[selectedLanguage]?.metaTitle || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Meta Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Meta Description</label>
            <textarea
              name="metaDescription"
              className="border p-2 rounded w-full h-20"
              disabled={isSubmitting}
              value={categoryData.translations[selectedLanguage]?.metaDescription || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
