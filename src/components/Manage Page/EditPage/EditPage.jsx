import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

const API_URL = "https://api.muktihospital.com/api/page";

const EditPage = () => {
  const { id } = useParams(); // Get the page ID from URL
  const navigate = useNavigate();
  const editor = useRef(null);

  // ✅ State for form data
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    translations: {
      en: { metaTitle: "", metaDescription: "", content: "" },
      bn: { metaTitle: "", metaDescription: "", content: "" },
    },
  });

  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch existing page data
  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch page");

        console.log("✅ Existing Page Data:", data);
        setFormData(data);
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id]);

  // ✅ Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: { ...prev.translations[language], [name]: value },
      },
    }));
  };

  // ✅ Handle slug change manually
  const handleSlugChange = (e) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  // ✅ Handle language switch
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // ✅ Handle content change in Jodit Editor
  const handleContentChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: { ...prev.translations[language], content: newContent },
      },
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`${API_URL}/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to update page");

      toast.success("Page updated successfully!");
      navigate("/all-pages"); // Redirect to the pages list
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto p-6">Loading page data...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Edit Page</h1>

      {error && <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ Language Switcher */}
        <div>
          <label className="text-gray-700">Select Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>

        {/* ✅ Page Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Page Name</label>
          {loading ? <Skeleton height={40} /> : (
            <input
              type="text"
              name="name"
              value={formData.name}
              className="w-full p-3 border border-gray-300 rounded-md"
              disabled
            />
          )}
        </div>

        {/* ✅ Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          {loading ? <Skeleton height={40} /> : (
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          )}
        </div>

        {/* ✅ Meta Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Title</label>
          {loading ? <Skeleton height={40} /> : (
            <input
              type="text"
              name="metaTitle"
              value={formData.translations[language]?.metaTitle || ""}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          )}
        </div>

        {/* ✅ Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          {loading ? <Skeleton height={80} /> : (
            <textarea
              name="metaDescription"
              value={formData.translations[language]?.metaDescription || ""}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
          )}
        </div>

        {/* ✅ Content (JoditEditor) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          {loading ? <Skeleton height={300} /> : (
            <JoditEditor
              ref={editor}
              value={formData.translations[language]?.content || ""}
              onChange={handleContentChange}
              config={{ height: 500, placeholder: "Start writing..." }}
            />
          )}
        </div>

        {/* ✅ Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Page"}
        </button>
      </form>
    </div>
  );
};

export default EditPage;
