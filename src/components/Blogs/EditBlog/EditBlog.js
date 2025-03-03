import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; // to read blog id from URL
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const EditBlog = () => {
  const { id } = useParams(); // blog ID from URL
  const editor = useRef(null);

  // State for blog data (form fields)
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    categories: "",
    image: null, // file input, not stored here on fetch
  });

  // State for the complete translations JSON from backend
  const [translations, setTranslations] = useState({
    en: { metaTitle: "", metaDescription: "", title: "", slug:"", description: "", content: "" },
    bn: { metaTitle: "", metaDescription: "", title: "", slug:"", description: "", content: "" },
  });

  // Selected language to edit (either "en" or "bn")
  const [language, setLanguage] = useState("en");

  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const categoriesList = ["Technology", "Health", "Business", "Lifestyle", "Education"];

  // Fetch the blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      setFetching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${id}`, {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch blog");
        }
        // Ensure both language keys exist
        setTranslations(data.translations || { en: {}, bn: {} });
        // Populate form with the selected language data
        const langData = data.translations?.[language] || {};
        setFormData({
          metaTitle: langData.metaTitle || "",
          metaDescription: langData.metaDescription || "",
          title: langData.title || "",
          slug: langData.slug || "",
          description: langData.description || "",
          content: langData.content || "",
          categories: data.categories ? data.categories[0]?.name || "" : "", // adjust if multiple
          image: null, // image file will be uploaded if changed
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, language]); // re-run if language changes so form gets updated

  // Auto-generate slug from title if slug is empty
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, formData.slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleContentChange = (newContent) => {
    const strippedContent = newContent.replace(/<\/?p>/g, "");
    setFormData(prev => ({ ...prev, content: strippedContent }));
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({ ...prev, categories: e.target.value }));
  };

  const handleSlugChange = (e) => {
    setFormData(prev => ({ ...prev, slug: e.target.value }));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // Update form data from translations state for the newly selected language
    const langData = translations[e.target.value] || {};
    setFormData(prev => ({
      ...prev,
      metaTitle: langData.metaTitle || "",
      metaDescription: langData.metaDescription || "",
      title: langData.title || "",
      slug: langData.slug || "",
      description: langData.description || "",
      content: langData.content || "",
    }));
  };

  const handleSlugEditToggle = () => {
    setIsSlugEditable(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Define an empty translation structure
      const emptyTranslation = {
        metaTitle: "",
        metaDescription: "",
        title: "",
        slug: "",
        description: "",
        content: "",
      };

      // Build updated translations: always include both keys
      const updatedTranslations = {
        en: language === "en"
          ? {
              metaTitle: formData.metaTitle,
              metaDescription: formData.metaDescription,
              title: formData.title,
              slug: formData.slug,
              description: formData.description,
              content: formData.content,
            }
          : { ...translations.en, ...emptyTranslation },
        bn: language === "bn"
          ? {
              metaTitle: formData.metaTitle,
              metaDescription: formData.metaDescription,
              title: formData.title,
              slug: formData.slug,
              description: formData.description,
              content: formData.content,
            }
          : { ...translations.bn, ...emptyTranslation },
      };

      // Prepare FormData for submission.
      const data = new FormData();
      data.append("translations", JSON.stringify(updatedTranslations));
      // Append categories as JSON array (adjust as needed)
      data.append("categories", JSON.stringify([formData.categories]));
      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch(`http://localhost:5000/api/blogs/edit/${id}`, {
        method: "PUT",
        headers: {
          "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079"
        },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update blog");
      }

      setMessage(result.message);
      // Optionally, update local state with the returned updated blog data
    } catch (err) {
      console.error("Error updating blog:", err);
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
          {loading ? (
            <Skeleton height={40} />
          ) : (
            <select
              id="categories"
              name="categories"
              value={formData.categories}
              onChange={handleCategoryChange}
              className="mt-1 p-3 w-full border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categoriesList.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          {loading ? (
            <Skeleton height={40} />
          ) : (
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
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;
