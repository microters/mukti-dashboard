import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

/**
 * sanitizeContent
 * Removes only <script> tags for security purposes.
 * Keeps other HTML tags (such as <b>, <i>, <img>, etc.) so that formatting remains intact.
 */
function sanitizeContent(html) {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

// Define constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CONTENT_LENGTH = 100000; // 100,000 characters

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);

  // Main form data for the blog
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    // We'll store the category ID here as a string
    categories: "",
    image: null, // New image file to upload
  });

  // Translations for English and Bangla
  const [translations, setTranslations] = useState({
    en: {
      metaTitle: "",
      metaDescription: "",
      title: "",
      slug: "",
      description: "",
      content: "",
      category: { id: "", name: "" },
    },
    bn: {
      metaTitle: "",
      metaDescription: "",
      title: "",
      slug: "", // This slug will always remain English.
      description: "",
      content: "",
      category: { id: "", name: "" },
    },
  });

  // Current selected language (default "en")
  const [language, setLanguage] = useState("en");

  // Slug edit toggle
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  // Loading and fetching states
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Error and success messages
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Image preview
  const [previewImage, setPreviewImage] = useState(null);

  // Categories list
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // -------------------------------------------------------------------------
  // 1) Fetch categories from API when component mounts
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch("https://api.muktihospital.com/api/category", {
          headers: {
            "x-api-key":
              "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
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

  // -------------------------------------------------------------------------
  // 2) Fetch existing blog data (by ID) from the API
  // -------------------------------------------------------------------------
  useEffect(() => {
    const fetchBlog = async () => {
      setFetching(true);
      try {
        const res = await fetch(`https://api.muktihospital.com/api/blogs/${id}`, {
          headers: {
            "x-api-key":
              "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch blog");
        }
        // Store translations for language switching
        setTranslations(data.translations || { en: {}, bn: {} });
        const langData = data.translations?.[language] || {};
        const selectedCategory = langData.category || { id: "", name: "" };

        // Always use the English slug regardless of language
        setFormData({
          metaTitle: langData.metaTitle || "",
          metaDescription: langData.metaDescription || "",
          title: langData.title || "",
          slug: data.translations?.en?.slug || "",
          description: langData.description || "",
          content: langData.content || "",
          categories: selectedCategory.id,
          image: null, // Only set if user selects a new file
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

  // -------------------------------------------------------------------------
  // 3) Auto-generate slug if it's empty (for English only)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, formData.slug]);

  // -------------------------------------------------------------------------
  // 4) Handle input changes (metaTitle, metaDescription, title, etc.)
  // -------------------------------------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------------------------------------------------------
  // 5) Handle category dropdown changes
  // -------------------------------------------------------------------------
  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategoryName = e.target.options[e.target.selectedIndex].text;
    // Update translations state for the current language
    setTranslations((prev) => ({
      ...prev,
      [language]: {
        ...prev[language],
        category: {
          id: selectedCategoryId,
          name: selectedCategoryName,
        },
      },
    }));
    // Update formData (store the category id as a string)
    setFormData((prev) => ({ ...prev, categories: selectedCategoryId }));
  };

  // -------------------------------------------------------------------------
  // 6) Handle image file selection and create a local preview
  // -------------------------------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // -------------------------------------------------------------------------
  // 7) Handle JoditEditor content changes (HTML formatting)
  // -------------------------------------------------------------------------
  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  // -------------------------------------------------------------------------
  // 8) Toggle slug edit mode
  // -------------------------------------------------------------------------
  const handleSlugEditToggle = () => {
    setIsSlugEditable((prev) => !prev);
  };

  // -------------------------------------------------------------------------
  // 9) Handle manual slug input changes
  // -------------------------------------------------------------------------
  const handleSlugChange = (e) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  // -------------------------------------------------------------------------
  // 10) Handle language switch
  // -------------------------------------------------------------------------
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    // Retrieve corresponding language data from translations
    const langData = translations[selectedLang] || {};
    const selectedCategory = langData.category || { id: "", name: "" };
    // Always use the English slug
    const englishSlug = translations.en?.slug || "";
    setFormData({
      metaTitle: langData.metaTitle || "",
      metaDescription: langData.metaDescription || "",
      title: langData.title || "",
      slug: englishSlug, // Always use the English slug
      description: langData.description || "",
      content: langData.content || "",
      categories: selectedCategory.id,
      image: null, // Only update if user selects a new file
    });
  };

  // -------------------------------------------------------------------------
  // 11) Handle form submission (PUT request to update the blog)
  // -------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Merge updated fields for the current language (slug remains English)
      const updatedTranslations = {
        ...translations,
        [language]: {
          ...translations[language],
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          content: sanitizeContent(formData.content),
          category: {
            id: formData.categories,
            name:
              categoriesList.find((cat) => cat.id === formData.categories)?.name || "",
          },
        },
      };

      const data = new FormData();
      data.append("translations", JSON.stringify(updatedTranslations));
      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await fetch(`https://api.muktihospital.com/api/blogs/edit/${id}`, {
        method: "PUT",
        headers: {
          "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
        },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update blog");
      }

      setMessage(result.message || "Blog updated successfully!");
      toast.success(result.message || "Blog updated successfully!");
      // Optionally, navigate to another page:
      // navigate("/all-blogs");
    } catch (err) {
      console.error("❌ Error updating blog:", err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // 12) If still fetching the blog data, show a loading indicator
  // -------------------------------------------------------------------------
  if (fetching) {
    return (
      <div className="container mx-auto p-6">
        <p>Loading blog data...</p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render the Edit Blog form
  // -------------------------------------------------------------------------
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Blog</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Switcher */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="p-2 border rounded-md"
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
          maxLength={100}
        />
        {/* Meta Description */}
        <textarea
          name="metaDescription"
          placeholder="Meta Description"
          value={formData.metaDescription}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md"
          required
          maxLength={160}
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
          maxLength={100}
        />
        {/* Slug */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={formData.slug}
            onChange={handleSlugChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            readOnly={!isSlugEditable}
            maxLength={100}
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
          placeholder="Short Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md"
          required
          maxLength={300}
        />
        {/* Content Editor */}
        <div>
          <JoditEditor
            ref={editor}
            value={formData.content}
            onChange={handleContentChange}
            config={{
              minHeight: 400,
              placeholder: "Start writing your blog content here...",
              cleanHTML: {
                removeEmptyTags: false,
                removeEmptyNodes: false,
              },
            }}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
          />
          <p className="text-sm text-gray-600 mt-1">
            Maximum content length: {MAX_CONTENT_LENGTH} characters
          </p>
        </div>
        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.categories}
          onChange={handleCategoryChange}
          className="w-full p-3 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select Category</option>
          {categoriesList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.translations?.[language]?.name || category.name}
            </option>
          ))}
        </select>
        {/* Image Upload */}
        <div>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
            accept="image/jpeg, image/png, image/gif, image/webp"
          />
          <p className="text-sm text-gray-600 mt-1">
            Max file size: {MAX_FILE_SIZE / 1024 / 1024}MB. Allowed types: JPEG, PNG, GIF, WEBP
          </p>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-md"
            />
          )}
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
