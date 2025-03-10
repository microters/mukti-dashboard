
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";

const AddBlog = () => {
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    category: { id: "", name: "" }, // ✅ ক্যাটাগরি আইডি ও নাম সংরক্ষণ
    image: null,
  });

  const [language, setLanguage] = useState("en");
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ✅ ক্যাটাগরি লোড করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get("https://api.muktihospital.com/api/category", {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });
        setCategoriesList(response.data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        toast.error("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Slug অটোমেটিক জেনারেট করা
  useEffect(() => {
    if (formData.title && !isSlugEditable) {
      const generatedSlug = formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ ক্যাটাগরি নির্বাচন (আইডি ও নাম সংরক্ষণ)
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategoryName = e.target.options[e.target.selectedIndex].text;

    setFormData((prev) => ({
      ...prev,
      category: { id: selectedCategoryId, name: selectedCategoryName },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSlugEditToggle = () => {
    setIsSlugEditable((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const translations = {
      en: language === "en" ? { ...formData } : {},
      bn: language === "bn" ? { ...formData } : {},
    };

    const data = new FormData();
    data.append("translations", JSON.stringify(translations));
    data.append("category", JSON.stringify(formData.category)); // ✅ ক্যাটাগরি আইডি ও নাম পাঠানো হবে
    if (formData.image) data.append("image", formData.image);

    try {
      const response = await fetch("https://api.muktihospital.com/api/blogs/add", {
        method: "POST",
        headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to submit blog");

      setMessage(result.message);
      setFormData({
        metaTitle: "",
        metaDescription: "",
        title: "",
        slug: "",
        description: "",
        content: "",
        category: { id: "", name: "" },
        image: null,
      });
      setPreviewImage(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log("Form Data:", formData);

  return (
<div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add New Blog</h1>

      {message && <p className="text-green-600 bg-green-100 p-3 rounded">{message}</p>}
      {error && <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Switcher */}
        <div>
          <label className="text-gray-700">Language</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="en">English</option>
            <option value="bn">Bangla</option>
          </select>
        </div>

        {/* Meta Title */}
        <input
          type="text"
          name="metaTitle"
          placeholder="Meta Title"
          value={formData.metaTitle}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />

        {/* Meta Description */}
        <textarea
          name="metaDescription"
          placeholder="Meta Description"
          value={formData.metaDescription}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />

        {/* Slug */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            readOnly={!isSlugEditable}
          />
          <button
            type="button"
            onClick={handleSlugEditToggle}
            className="p-3 bg-blue-500 text-white rounded-md"
          >
            {isSlugEditable ? "Save" : "Edit"}
          </button>
        </div>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        />

        {/* Content Editor */}
        <JoditEditor ref={editor} value={formData.content} onChange={handleContentChange} />

        {/* Category Dropdown */}
        <select name="category" value={formData.category.id} onChange={handleCategoryChange} className="w-full p-3 border border-gray-300 rounded-md" required>
          <option value="">Select Category</option>
          {categoriesList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.translations[language]?.name || category.name}
            </option>
          ))}
        </select>


        {/* Image Upload */}
        <input type="file" name="image" onChange={handleImageChange} className="w-full p-3 border border-gray-300 rounded-md" />
        {previewImage && <img src={previewImage} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-md" />}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
