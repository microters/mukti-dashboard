import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";

const AddPage = () => {
  const editor = useRef(null);

  // ✅ State for form data
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    translations: {
      en: { metaTitle: "", metaDescription: "", content: "" },
      bn: { metaTitle: "", metaDescription: "",  content: "" },
    },
  });

  // ✅ Language state
  const [language, setLanguage] = useState("en");
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Auto-generate slug when name changes
  useEffect(() => {
    if (formData.name && !isSlugEditable) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, isSlugEditable]);

  const handleSlugEditToggle = () => {
    setIsSlugEditable((prev) => !prev);
  };

  // ✅ Handle input changes
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

  // ✅ Handle content change
  const handleContentChange = (newContent) => {
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: { ...prev.translations[language], content: newContent },
      },
    }));
  };

  // ✅ Handle language switch
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/page/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079", // Replace with actual API key
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create page");
      }

      setMessage("Page created successfully!");
      setFormData({
        name: "",
        slug: "",
        translations: {
          en: { metaTitle: "", metaDescription: "",  content: "" },
          bn: { metaTitle: "", metaDescription: "", content: "" },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add New Page</h1>

      {message && <p className="text-green-600 bg-green-100 p-3 rounded">{message}</p>}
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
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* ✅ Slug */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleSlugChange}
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

        {/* ✅ Meta Title & Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.translations[language].metaTitle}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.translations[language].metaDescription}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* ✅ Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <JoditEditor ref={editor} value={formData.translations[language].content} onChange={handleContentChange} />
        </div>

        {/* ✅ Submit Button */}
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700" disabled={loading}>
          {loading ? "Saving..." : "Add Page"}
        </button>
      </form>
    </div>
  );
};

export default AddPage;