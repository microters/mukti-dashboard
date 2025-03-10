
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

const EditBlog = () => {
  const { id } = useParams();
  const editor = useRef(null);

  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    image: null,
  });

  const [translations, setTranslations] = useState({
    en: { metaTitle: "", metaDescription: "", title: "", slug: "", description: "", content: "", category: { id: "", name: "" } },
    bn: { metaTitle: "", metaDescription: "", title: "", slug: "", description: "", content: "", category: { id: "", name: "" } },
  });

  const [language, setLanguage] = useState("en");
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ✅ Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch("https://api.muktihospital.com/api/category", {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });
        const data = await response.json();
        setCategoriesList(data);
      } catch (error) {
        console.error("❌ Error fetching categories:", error);
        setError("Failed to load categories.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch blog data when component mounts
  useEffect(() => {
    const fetchBlog = async () => {
      setFetching(true);
      try {
        const res = await fetch(`https://api.muktihospital.com/api/blogs/${id}`, {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });
        const data = await res.json();
    
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch blog");
        }
    
        console.log("📌 Received Blog Data:", data);
    
        setTranslations(data.translations || { en: {}, bn: {} });
  
        const langData = data.translations?.[language] || {};
        const selectedCategory = langData.category || { id: "", name: "" };
  
        setFormData({
          metaTitle: langData.metaTitle || "",
          metaDescription: langData.metaDescription || "",
          title: langData.title || "",
          slug: langData.slug || "",
          description: langData.description || "",
          content: langData.content || "",
          categories: selectedCategory.id, // ✅ ক্যাটাগরি ঠিক রাখুন
          image: data.image || null,
        });
  
        if (data.image) {
          setPreviewImage(`https://api.muktihospital.com/uploads/${data.image}`);
        }
        
      } catch (err) {
        console.error("❌ Error fetching blog:", err);
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };
  
    fetchBlog();
  }, [id, language]);
  
  
  

  // ✅ Auto-generate slug if empty
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, formData.slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategoryName = e.target.options[e.target.selectedIndex].text;
  
    console.log("Selected Category:", { id: selectedCategoryId, name: selectedCategoryName });
  
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        category: { id: selectedCategoryId, name: selectedCategoryName }, // ✅ Save both ID & Name
      },
    }));
  
    // ✅ Update formData as well
    setFormData((prev) => ({ ...prev, categories: selectedCategoryId }));
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleSlugEditToggle = () => {
    setIsSlugEditable((prev) => !prev);
  };

  // ✅ Fix: Add missing `handleLanguageChange` function
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
  
    const langData = translations[selectedLang] || {};
    const selectedCategory = langData.category || { id: "", name: "" };
  
    console.log("🔄 Switched Language. Current Selected Category:", selectedCategory);
  
    setFormData((prev) => ({
      ...prev,
      metaTitle: langData.metaTitle || "",
      metaDescription: langData.metaDescription || "",
      title: langData.title || "",
      slug: langData.slug || "",
      description: langData.description || "",
      content: langData.content || "",
      categories: selectedCategory.id, // ✅ ক্যাটাগরি ঠিক রাখুন
    }));
  };
  

  // ✅ Fix: Add missing `handleSlugChange` function
  const handleSlugChange = (e) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
  
    try {
      // ✅ পুরাতন Translations রেখে শুধুমাত্র নতুন ভাষার ডাটা আপডেট করা হবে
      const updatedTranslations = {
        ...translations, // ✅ আগের ডাটাগুলো রেখে দিন
        [language]: {
          ...translations[language], // ✅ আগের ওই ভাষার ডাটাগুলো রেখে দিন
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          content: formData.content,
          category: {
            id: formData.categories,
            name: categoriesList.find(cat => cat.id === formData.categories)?.name || ""
          }
        }
      };
  
      console.log("📌 Final Translations Before Sending:", updatedTranslations);
  
      const data = new FormData();
      data.append("translations", JSON.stringify(updatedTranslations));
      if (formData.image) data.append("image", formData.image);
  
      const response = await fetch(`https://api.muktihospital.com/api/blogs/edit/${id}`, {
        method: "PUT",
        headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        body: data,
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update blog");
      }
  
      setMessage(result.message);
    } catch (err) {
      console.error("❌ Error updating blog:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  



  if (fetching) {
    return <div className="container mx-auto p-6">Loading blog data...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Blog</h1>
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
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
            Meta Title
          </label>
          {loading ? (
            <Skeleton height={40} />
          ) : (
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
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
            Meta Description
          </label>
          {loading ? (
            <Skeleton height={80} />
          ) : (
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
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          {loading ? (
            <Skeleton height={40} />
          ) : (
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
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            Slug
          </label>
          {loading ? (
            <Skeleton height={40} />
          ) : (
            <>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                className={`mt-1 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 ${
                  isSlugEditable ? "focus:ring-blue-500" : "bg-gray-100"
                }`}
                required
                readOnly={!isSlugEditable}
              />
              <button
                type="button"
                onClick={handleSlugEditToggle}
                className={`mt-3 py-2 px-4 rounded-md text-white font-medium shadow ${
                  isSlugEditable ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSlugEditable ? "Save" : "Edit"}
              </button>
            </>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          {loading ? (
            <Skeleton height={80} />
          ) : (
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

        {/* Content (JoditEditor) */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          {loading ? (
            <Skeleton height={300} />
          ) : (
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
          <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
            Categories
          </label>
          {loadingCategories ? (
            <Skeleton height={40} />
          ) : (
        
<select
  id="categories"
  name="categories"
  value={formData.categories} // ✅ Now it will show the existing category!
  onChange={handleCategoryChange}
  className="w-full p-3 border border-gray-300 rounded-md"
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
       {/* ✅ Image Upload */}
<div>
  <label htmlFor="image" className="block text-sm font-medium text-gray-700">
    Upload Image
  </label>
  <input
    type="file"
    id="image"
    name="image"
    onChange={handleImageChange}
    className="mt-1 p-3 w-full border border-gray-300 rounded-md"
  />
  
  {/* ✅ Show Existing Image Preview */}
  {previewImage && (
    <img src={previewImage} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-md border" />
  )}
</div>


        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
