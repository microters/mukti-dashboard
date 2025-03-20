import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";

/**
 * @function sanitizeContent
 * Removes only <script> tags for security purposes.
 * Keeps other HTML tags (like <b>, <i>, <img>, etc.) so that formatting remains intact.
 */
function sanitizeContent(html) {
  // Remove <script> tags globally
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}

const EditBlog = () => {
  // Retrieve the blog ID from URL (e.g., /edit-blog/:id)
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
    // We'll store only the selected category ID in "categories",
    // but also keep track of translations if needed.
    categories: "",
    image: null, // New image file to upload
  });

  // We'll store the translations object if your API returns it,
  // so we can merge other languages. This is optional based on your needs.
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
      slug: "",
      description: "",
      content: "",
      category: { id: "", name: "" },
    },
  });

  // For language switching if your blog has multiple translations
  const [language, setLanguage] = useState("en");

  // Slug editing toggle
  const [isSlugEditable, setIsSlugEditable] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(false); // For submit button
  const [fetching, setFetching] = useState(true); // For initial data load

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
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
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
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch blog");
        }

        // The API returns data with a "translations" field
        // We'll store it so we can switch languages.
        setTranslations(data.translations || { en: {}, bn: {} });

        // Extract the fields for the currently selected language
        const langData = data.translations?.[language] || {};
        const selectedCategory = langData.category || { id: "", name: "" };

        // Populate our formData state
        setFormData({
          metaTitle: langData.metaTitle || "",
          metaDescription: langData.metaDescription || "",
          title: langData.title || "",
          slug: langData.slug || "",
          description: langData.description || "",
          content: langData.content || "",
          categories: selectedCategory.id, // store category ID
          image: null, // we only set a File here if the user chooses a new image
        });

        // If the API returns an existing image path, show a preview
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
  // 3) Auto-generate slug if it's empty when the user enters a title
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
  // 4) Handle input changes (for metaTitle, metaDescription, title, etc.)
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

    // Update the translations state to store the selected category
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

    // Also update the formData (just storing the category ID here)
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

    // Retrieve the corresponding language data from translations
    const langData = translations[selectedLang] || {};
    const selectedCategory = langData.category || { id: "", name: "" };

    // Update formData with the chosen language’s fields
    setFormData({
      metaTitle: langData.metaTitle || "",
      metaDescription: langData.metaDescription || "",
      title: langData.title || "",
      slug: langData.slug || "",
      description: langData.description || "",
      content: langData.content || "",
      categories: selectedCategory.id,
      image: null, // we only set a new file if user selects one
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
      // Merge old translations with new fields for the current language
      const updatedTranslations = {
        ...translations, // keep existing translations
        [language]: {
          ...translations[language], // keep old data for this language
          metaTitle: formData.metaTitle,
          metaDescription: formData.metaDescription,
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          // sanitize the HTML content to remove only <script> tags
          content: sanitizeContent(formData.content),
          category: {
            id: formData.categories,
            name:
              categoriesList.find((cat) => cat.id === formData.categories)
                ?.name || "",
          },
        },
      };

      // Prepare form data for PUT request
      const data = new FormData();
      data.append("translations", JSON.stringify(updatedTranslations));

      if (formData.image) {
        data.append("image", formData.image);
      }

      // Make the PUT request to update the blog
      const response = await fetch(
        `https://api.muktihospital.com/api/blogs/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "x-api-key":
              "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
          body: data,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update blog");
      }

      // If successful
      setMessage(result.message || "Blog updated successfully!");
      toast.success(result.message || "Blog updated successfully!");
      // Optionally, navigate to a different page
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

      {/* Show success or error messages */}
      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Language Switcher */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Language
          </label>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Meta Title
          </label>
          {loading ? (
            <Skeleton height={40} />
          ) : (
            <input
              type="text"
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
          <label className="block text-sm font-medium text-gray-700">
            Meta Description
          </label>
          {loading ? (
            <Skeleton height={80} />
          ) : (
            <textarea
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
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          {loading ? (
            <Skeleton height={40} />
          ) : (
            <input
              type="text"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug
          </label>
          {loading ? (
            <Skeleton height={40} />
          ) : (
            <>
              <input
                type="text"
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
                  isSlugEditable
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSlugEditable ? "Save" : "Edit"}
              </button>
            </>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          {loading ? (
            <Skeleton height={80} />
          ) : (
            <textarea
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
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          {loading ? (
            <Skeleton height={300} />
          ) : (
            <JoditEditor
              ref={editor}
              value={formData.content}
              onChange={handleContentChange}
              // Example config that preserves inline styles and images
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
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categories
          </label>
          {loadingCategories ? (
            <Skeleton height={40} />
          ) : (
            <select
              name="categories"
              value={formData.categories}
              onChange={handleCategoryChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categoriesList.map((category) => (
                <option key={category.id} value={category.id}>
                  {/* Show either the category's name in the current language or fallback */}
                  {category.translations?.[language]?.name || category.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
          />
          {/* Preview the selected image or the existing one */}
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded-md border"
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
