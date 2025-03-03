import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

// AddBlog Component
const AddBlog = () => {
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    categories: [], // This should hold the category ID(s)
    image: null,
  });

  const [language, setLanguage] = useState("en");
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Categories from the API
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get("http://localhost:5000/api/category", {
          headers: {
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
        });
        setCategoriesList(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle slug change manually
  const handleSlugChange = (e) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  // Toggle slug edit mode
  const handleSlugEditToggle = () => {
    setIsSlugEditable((prev) => !prev);
  };

  // Handle content change (editor)
  const handleContentChange = (newContent) => {
    const strippedContent = newContent.replace(/<\/?p>/g, "");
    setFormData((prev) => ({ ...prev, content: strippedContent }));
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value; // category ID
    setFormData((prev) => ({ ...prev, categories: [selectedCategoryId] }));
  };

  // Handle image file change
  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value === "bn" ? "bn" : "en";
    setLanguage(selectedLang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
  
    // Prepare translations for both languages
    const emptyTranslation = {
      metaTitle: "",
      metaDescription: "",
      title: "",
      description: "",
      content: "",
    };
  
    const translations = {
      en: language === "en" ? {
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        title: formData.title,
        description: formData.description,
        content: formData.content,
      } : { ...emptyTranslation },
      bn: language === "bn" ? {
        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        title: formData.title,
        description: formData.description,
        content: formData.content,
      } : { ...emptyTranslation },
    };
  
    console.log("Translations object being sent: ", translations);  // Add this log
  
    // Prepare FormData for submission
    const data = new FormData();
    data.append("translations", JSON.stringify(translations));  // Serialize translations
    data.append("categories", JSON.stringify(formData.categories)); // Pass category IDs as array
    if (formData.image) {
      data.append("image", formData.image);
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/blogs/add", {
        method: "POST",
        headers: {
          "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
        },
        body: data,
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit blog");
      }
  
      setMessage(result.message);
      setFormData({
        metaTitle: "",
        metaDescription: "",
        title: "",
        slug: "",
        description: "",
        content: "",
        categories: [], // Reset categories to empty array
        image: null,
      });
    } catch (err) {
      console.error("Error submitting blog:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Blog</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Switcher */}
        <div className="mb-4">
          <select value={language} onChange={handleLanguageChange} className="p-2 border rounded-md">
            <option value="en">English</option>
            <option value="bn">Bangla</option>
          </select>
        </div>

        {/* Meta Title */}
        <div>
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">Meta Title</label>
          {loading ? <Skeleton height={40} /> : (
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              required
            />
          )}
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">Meta Description</label>
          {loading ? <Skeleton height={80} /> : (
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              required
            />
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          {loading ? <Skeleton height={40} /> : (
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              required
            />
          )}
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          {loading ? <Skeleton height={40} /> : (
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              className={`mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${isSlugEditable ? "focus:ring-blue-500" : "bg-gray-100"}`}
              required
              readOnly={!isSlugEditable}
            />
          )}
          <button
            type="button"
            onClick={handleSlugEditToggle}
            className={`mt-3 py-2 px-4 rounded-md text-white font-medium shadow ${isSlugEditable ? "bg-green-500" : "bg-blue-500"}`}
          >
            {isSlugEditable ? "Save" : "Edit"}
          </button>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          {loading ? <Skeleton height={80} /> : (
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              required
            />
          )}
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          {loading ? <Skeleton height={300} /> : (
            <JoditEditor
              ref={editor}
              value={formData.content}
              onChange={handleContentChange}
              config={{
                placeholder: "Start writing your blog content here...",
                minHeight: 500,
              }}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          )}
        </div>

        {/* Categories Dropdown */}
        <div>
          <label htmlFor="categories" className="block text-sm font-medium text-gray-700">Categories</label>
          {loadingCategories ? <Skeleton height={40} /> : (
            <select
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleCategoryChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categoriesList.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.translations[language]?.name || category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          {loading ? <Skeleton height={40} /> : (
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
