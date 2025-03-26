import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import JoditEditor from "jodit-react";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import slugify from "slugify";

const AddDepartment = () => {
  const editor = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [icon, setIcon] = useState(null); // আপলোডের জন্য ফাইল
  const [previewIcon, setPreviewIcon] = useState(null); // আইকনের প্রিভিউ
  const [departmentData, setDepartmentData] = useState({
    // লক্ষ্য করুন: ইংরেজি শিরোনামের key হিসেবে "title" ব্যবহার করা হয়েছে
    translations: {
      en: { title: "", description: "", metaTitle: "", metaDescription: "" },
      bn: { title: "", description: "", metaTitle: "", metaDescription: "" },
    },
    slug: "", // slug state
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ইংরেজি শিরোনাম পরিবর্তিত হলে স্বয়ংক্রিয়ভাবে slug generate হবে
  useEffect(() => {
    if (departmentData.translations.en.title) {
      const generatedSlug = slugify(
        departmentData.translations.en.title.trim(),
        { lower: true, strict: true }
      );
      setDepartmentData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  }, [departmentData.translations.en.title]);

  // ভাষা নির্বাচন হ্যান্ডল
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  // ইনপুট ফিল্ড পরিবর্তনের হ্যান্ডলার
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
      // যদি ইংরেজি ভাষায় "title" পরিবর্তিত হয়, তাহলে slug update করুন
      if (selectedLanguage === "en" && name === "title") {
        const generatedSlug = slugify(value, { lower: true, strict: true });
        return { ...prev, translations: updatedTranslations, slug: generatedSlug };
      }
      return { ...prev, translations: updatedTranslations };
    });
  };

  // ম্যানুয়ালভাবে slug পরিবর্তনের হ্যান্ডলার
  const handleSlugChange = (e) => {
    const slugValue = e.target.value;
    const customSlug = slugValue.replace(/\s+/g, ""); // স্পেস বাদ দিন
    setDepartmentData((prev) => ({
      ...prev,
      slug: slugify(customSlug, { lower: true, strict: true }),
    }));
  };

  // JoditEditor এর কন্টেন্ট পরিবর্তন হ্যান্ডলার
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

  // ফাইল আপলোড হ্যান্ডলার
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIcon(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewIcon(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // ফর্ম সাবমিশনের হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // IndexedDB-তে ডাটা সেভ করার জন্য (যদি দরকার হয়)
     

      const formData = new FormData();
      formData.append("translations", JSON.stringify(departmentData.translations));
      formData.append("slug", departmentData.slug);
      if (icon) {
        formData.append("icon", icon);
      }

      const response = await axios.post(
        "https://api.muktihospital.com/api/department",
        formData,
        {
          headers: {
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Department added successfully!");
        setDepartmentData({
          translations: {
            en: { title: "", description: "", metaTitle: "", metaDescription: "" },
            bn: { title: "", description: "", metaTitle: "", metaDescription: "" },
          },
          slug: "",
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
        {/* ভাষা নির্বাচন */}
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

        {/* Department ফর্ম */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Department Name */}
          <div className="mb-4">
            <label className="block mb-1 font-inter font-medium text-sm">Department Name</label>
            {isSubmitting ? (
              <Skeleton height={35} />
            ) : (
              <input
                type="text"
                name="title"
                placeholder="Enter Department Name"
                className="border border-M-text-color font-inter w-full outline-none ring-0 py-2 px-5 rounded-md"
                value={departmentData.translations[selectedLanguage].title}
                onChange={handleChange}
              />
            )}
          </div>

          {/* Slug Field */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Slug</label>
            <input
              type="text"
              name="slug"
              className="border p-2 rounded w-full"
              placeholder="Enter Slug"
              value={departmentData.slug}
              onChange={handleSlugChange}
            />
          </div>

          {/* Department Description */}
          <div className="mb-4 col-span-2">
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
            {previewIcon && (
              <img
                src={previewIcon}
                alt="Icon Preview"
                className="mt-2 w-24 h-24 rounded-lg shadow"
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

export default AddDepartment;
