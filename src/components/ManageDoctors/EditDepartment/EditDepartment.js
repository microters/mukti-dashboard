import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import JoditEditor from "jodit-react";
import slugify from "slugify"; // Importing slugify

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

const EditDepartment = () => {
  const { id } = useParams(); // department id from URL
  const navigate = useNavigate();
  const editor = useRef(null);
  // Language selection for translations
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // Department data shape
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
    icon: null, // existing icon path from DB
    slug: "", // Add slug to department data
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If a new icon is chosen
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) Fetch existing department data
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.muktihospital.com/api/department/${id}?lang=${selectedLanguage}`,
          {
            headers: {
              "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            },
          }
        );

        if (response.status === 200) {
          const dep = response.data;
          // Merges the fetched fields into the current state for the chosen language
          setDepartmentData((prev) => ({
            ...prev,
            translations: {
              ...prev.translations,
              [selectedLanguage]: {
                name: dep.translations.name || "",
                description: dep.translations.description || "",
                metaTitle: dep.translations.metaTitle || "",
                metaDescription: dep.translations.metaDescription || "",
              },
            },
            icon: dep.icon || null,
            slug: dep.slug || "", // Set slug from response
          }));
        } else {
          toast.error("Failed to load department details.");
        }
      } catch (error) {
        console.error("Error fetching department:", error);
        toast.error("Could not load department.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [id, selectedLanguage]);

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

    // Auto-generate slug if the English department name is modified
    if (selectedLanguage === "en" && name === "name") {
      const generatedSlug = slugify(convertedValue, { lower: true, strict: true });
      setDepartmentData((prev) => ({
        ...prev,
        slug: prev.slug || generatedSlug, // Only generate slug if it's empty
      }));
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) Slug manual change
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSlugChange = (e) => {
    const slugValue = e.target.value;
    setDepartmentData((prev) => ({
      ...prev,
      slug: slugify(slugValue, { lower: true, strict: true }), // Slug will be formatted correctly
    }));
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) File input change
  // ─────────────────────────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIconFile(file);

    if (file) {
      // Create a local preview
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) Submit form
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // We only update the selected language's translations
      // If your backend merges automatically, that's fine;
      // otherwise, you need the full object to preserve other langs.
      formData.append(
        "translations",
        JSON.stringify({
          [selectedLanguage]: departmentData.translations[selectedLanguage],
        })
      );

      // If user selected a new icon, append it
      if (iconFile) {
        formData.append("icon", iconFile); // "icon" must match your backend field
      }

      formData.append("slug", departmentData.slug); // Append slug field

      const response = await axios.put(
        `https://api.muktihospital.com/api/department/${id}`,
        formData,
        {
          headers: {
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Department updated successfully!");
        navigate("/all-department");
      } else {
        toast.error("Failed to update department.");
      }
    } catch (error) {
      console.error("❌ Error updating department:", error);
      toast.error("An error occurred while updating the department.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (newContent) => {
    setDepartmentData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [selectedLanguage]: {
          ...prev.translations[selectedLanguage],
          description: newContent
        }
      }
    }));
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

  // ─────────────────────────────────────────────────────────────────────────────
  // Render form
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-10xl bg-white shadow-lg rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Department</h2>

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
          {/* Department Name */}
          <div>
            <label className="block mb-1 font-medium">Department Name</label>
            <input
              type="text"
              name="name"
              className="border p-2 rounded w-full"
              disabled={isSubmitting}
              value={departmentData.translations[selectedLanguage]?.name || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Slug Field */}
          <div>
            <label className="label">Slug</label>
            <input
              type="text"
              name="slug"
              className="input-field"
              placeholder="Enter Slug"
              value={departmentData.slug}
              onChange={handleSlugChange}
            />
          </div>

          {/* Meta Title */}
          <div>
            <label className="block mb-1 font-medium">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              className="border p-2 rounded w-full"
              disabled={isSubmitting}
              value={departmentData.translations[selectedLanguage]?.metaTitle || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Department Description</label>
            <JoditEditor
              ref={editor}
              value={departmentData.translations[selectedLanguage]?.description || ""}
              onChange={handleContentChange}
            />
          </div>

          {/* Existing icon preview (if any and not replaced yet) */}
          {departmentData.icon && !iconPreview && (
            <div className="mt-6">
              <label className="block mb-1 font-medium">Current Icon</label>
              <img
                src={`https://api.muktihospital.com${departmentData.icon}`}
                alt="Dept Icon"
                className="w-20 h-20 object-cover rounded"
              />
            </div>
          )}

          {/* If user selects a new icon file, show local preview */}
          {iconPreview && (
            <div className="mt-6">
              <label className="block mb-1 font-medium">New Icon Preview</label>
              <img
                src={iconPreview}
                alt="New Icon"
                className="w-20 h-20 object-cover rounded"
              />
            </div>
          )}

          {/* File input */}
          <div className="mt-4">
            <label className="block mb-1 font-medium">Change Icon</label>
            <input
              type="file"
              accept="image/*"
              className="border p-2 rounded w-full"
              disabled={isSubmitting}
              onChange={handleFileChange}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDepartment;
