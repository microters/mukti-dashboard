import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import JoditEditor from "jodit-react";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { saveData } from "../../../services/indexDb";
import slugify from "slugify";  // ✅ Import slugify for generating slugs

const AddDepartment = () => {
  const editor = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [icon, setIcon] = useState(null); // Stores file
  const [previewIcon, setPreviewIcon] = useState(null); // Stores image preview
  const [departmentData, setDepartmentData] = useState({
    translations: {
      en: { name: "", description: "", metaTitle: "", metaDescription: "" },
      bn: { name: "", description: "", metaTitle: "", metaDescription: "" },
    },
    slug: "", // Add slug field in state
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle language selection
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  // Automatically generate the slug when the department name in English is updated
  useEffect(() => {
    if (departmentData.translations.en.name) {
      const generatedSlug = slugify(departmentData.translations.en.name.trim(), { lower: true, strict: true });
      setDepartmentData((prev) => ({
        ...prev,
        slug: prev.slug || generatedSlug, // Only generate slug if it's empty
      }));
    }
  }, [departmentData.translations.en.name]); // Triggered when the name in English is updated
  
  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData((prev) => {
      const updatedTranslations = {
        ...prev.translations,
        [selectedLanguage]: {
          ...prev.translations[selectedLanguage],
          [name]: value,
        },
      };

      // Automatically generate slug from English title if not manually entered
      if (selectedLanguage === "en" && name === "name") {
        const generatedSlug = slugify(value, { lower: true, strict: true });
        return { ...prev, translations: updatedTranslations, slug: prev.slug || generatedSlug };
      }

      return { ...prev, translations: updatedTranslations };
    });
  };

  // Handle slug change (if the user manually edits the slug)
  const handleSlugChange = (e) => {
    const slugValue = e.target.value;
    const customSlug = slugValue.replace(/\s+/g, ''); // স্পেস বাদ দিয়ে
    setDepartmentData((prev) => ({
      ...prev,
      slug: slugify(customSlug, { lower: true, strict: true }), // সঠিক স্লাগ
    }));
  };
  

  // Handle JoditEditor content changes
  const handleContentChange = (newContent) => {
    setDepartmentData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [selectedLanguage]: {
          ...prev.translations[selectedLanguage],
          description: newContent,
        },
      },
    }));
  };

  // Handle file selection for icon
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIcon(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewIcon(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save department data to IndexedDB before submitting to the backend
      await saveData("addDepartment", departmentData);

      // Prepare form data for API submission
      const formData = new FormData();
      formData.append("translations", JSON.stringify(departmentData.translations));
      formData.append("slug", departmentData.slug); // Append slug to form data
      if (icon) {
        formData.append("icon", icon); // Append file if selected
      }

      const response = await axios.post("https://api.muktihospital.com/api/department", formData, {
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
          slug: "", // Reset slug
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

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-10xl bg-white shadow-lg rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Add Department</h2>

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

        {/* Department Form */}
        <form onSubmit={handleSubmit}>
          {/* Department Name */}
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

          {/* Slug Field */}
          <div className="mb-4">
            <label className="label">Slug</label>
            <input
              type="text"
              name="slug"
              className="input-field"
              placeholder="Enter Slug"
              value={departmentData.slug}
              onChange={handleSlugChange} // Allow manual slug editing
            />
          </div>

          {/* Department Description */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Department Description</label>
            {isSubmitting ? (
              <Skeleton height={35} />
            ) : (
              <JoditEditor
                ref={editor}
                value={departmentData.translations[selectedLanguage].description}
                onChange={handleContentChange}
              />
            )}
          </div>

          {/* Meta Title */}
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

          {/* Meta Description */}
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

          {/* File Upload */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Upload Icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
            {previewIcon && <img src={previewIcon} alt="Icon Preview" className="mt-2 w-24 h-24 rounded-lg shadow" />}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
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
