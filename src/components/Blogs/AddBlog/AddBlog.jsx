import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AddBlog = () => {
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    category: { id: "", name: "" },
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

  // Constants for validation
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  const MAX_CONTENT_LENGTH = 100000; // 100,000 characters
  const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks

  // Sanitize content to prevent JSON serialization issues
  const sanitizeContent = (content) => {
    // Remove any problematic HTML and scripts
    const cleanContent = content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<\/?[^>]+(>|$)/g, '') // Remove HTML tags
      .replace(/&nbsp;/gi, ' ') // Replace non-breaking spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Limit content length
    if (cleanContent.length > MAX_CONTENT_LENGTH) {
      toast.warn(`Content truncated to ${MAX_CONTENT_LENGTH} characters`);
      return cleanContent.substring(0, MAX_CONTENT_LENGTH);
    }
    
    return cleanContent;
  };

  // Chunked file upload method
  const uploadFileInChunks = async (file) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedChunks = 0;

    for (let chunk = 0; chunk < totalChunks; chunk++) {
      const start = chunk * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkFile = file.slice(start, end);

      const chunkFormData = new FormData();
      chunkFormData.append('chunk', chunkFile);
      chunkFormData.append('chunkNumber', chunk);
      chunkFormData.append('totalChunks', totalChunks);
      chunkFormData.append('originalFileName', file.name);

      try {
        const response = await fetch('https://api.muktihospital.com/api/blogs/upload-chunk', {
          method: 'POST',
          headers: { 
            'x-api-key': 'caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079' 
          },
          body: chunkFormData
        });

        if (!response.ok) {
          throw new Error(`Chunk upload failed at chunk ${chunk}`);
        }

        uploadedChunks++;
        toast.info(`Uploading chunk ${uploadedChunks}/${totalChunks}`);
      } catch (error) {
        toast.error(`Upload failed at chunk ${chunk}`);
        return false;
      }
    }

    return true;
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await axios.get("https://api.muktihospital.com/api/category", {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
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

  // Auto-generate slug
  useEffect(() => {
    if (formData.title && !isSlugEditable) {
      const generatedSlug = formData.title.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, isSlugEditable]);

  // Input change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Reset previous state
    setPreviewImage(null);
    
    if (file) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
        e.target.value = null; // Clear the file input
        return;
      }

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error("Invalid file type. Allowed types: JPEG, PNG, GIF");
        e.target.value = null; // Clear the file input
        return;
      }

      // Set file and create preview
      setFormData((prev) => ({ ...prev, image: file }));
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    const selectedCategoryName = e.target.options[e.target.selectedIndex].text;

    setFormData((prev) => ({
      ...prev,
      category: { id: selectedCategoryId, name: selectedCategoryName },
    }));
  };

  const handleContentChange = (newContent) => {
    // Validate content length in real-time
    if (newContent.length > MAX_CONTENT_LENGTH) {
      toast.warn(`Content exceeds ${MAX_CONTENT_LENGTH} characters. Please reduce.`);
      // Optionally, truncate the content
      // newContent = newContent.substring(0, MAX_CONTENT_LENGTH);
    }

    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSlugEditToggle = () => {
    setIsSlugEditable((prev) => !prev);
  };

  // Validate form data before submission
  const validateFormData = (data) => {
    // Check required fields
    const requiredFields = [
      'metaTitle', 'metaDescription', 'title', 
      'slug', 'description', 'content', 
      'category'
    ];

    for (let field of requiredFields) {
      if (!data[field] || (field === 'category' && !data[field].id)) {
        toast.error(`Please fill in the ${field} field`);
        return false;
      }
    }

    // Additional content validation
    if (data.content.length < 10) {
      toast.error("Content is too short");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous states
    setLoading(true);
    setMessage(null);
    setError(null);

    // Validate form data
    if (!validateFormData(formData)) {
      setLoading(false);
      return;
    }

    try {
      // Sanitize content before submission
      const sanitizedFormData = {
        ...formData,
        content: sanitizeContent(formData.content)
      };

      // Prepare translations with sanitized content
      const translations = {
        en: language === "en" ? { ...sanitizedFormData } : {},
        bn: language === "bn" ? { ...sanitizedFormData } : {},
      };

      // Safe JSON stringification
      const safeTranslations = JSON.parse(JSON.stringify(translations), (key, value) => {
        // Remove any non-serializable or problematic content
        if (typeof value === 'string') {
          // Remove any remaining HTML tags or scripts
          return value.replace(/<\/?[^>]+(>|$)/g, '');
        }
        return value;
      });

      // Chunked upload for large images
      if (formData.image && formData.image.size > MAX_FILE_SIZE) {
        const chunkUploadSuccess = await uploadFileInChunks(formData.image);
        if (!chunkUploadSuccess) {
          throw new Error('Chunk upload failed');
        }
      }

      // Create form data for submission
      const data = new FormData();
      
      try {
        // Attempt to stringify translations
        data.append("translations", JSON.stringify(safeTranslations));
      } catch (stringifyError) {
        console.error("Translation stringify error:", stringifyError);
        toast.error("Error processing blog content. Please reduce content length.");
        setLoading(false);
        return;
      }

      data.append("category", JSON.stringify(formData.category));
      
      // Append image if exists
      if (formData.image) {
        data.append("image", formData.image);
      }

      // Submit to API
      const response = await fetch("https://api.muktihospital.com/api/blogs/add", {
        method: "POST",
        headers: { 
          "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" 
        },
        body: data,
      });

      const result = await response.json();

      // Handle response
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit blog");
      }

      // Success handling
      toast.success(result.message || "Blog added successfully");
      setMessage(result.message);

      // Reset form
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
      console.error("Submission error:", err);
      
      // Detailed error handling
      if (err.response) {
        const errorMessage = err.response.data.message || 'Submission failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err.request) {
        setError('No response from server. Check your network connection.');
        toast.error('Network error. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred');
        toast.error('Error processing content. Please check your input.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
      
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Add New Blog</h1>

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
            onChange={handleInputChange}
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
              height: 400,
              placeholder: 'Start typing your blog content...',
              maxlength: MAX_CONTENT_LENGTH
            }}
          />
          <p className="text-sm text-gray-600 mt-1">
            Maximum content length: {MAX_CONTENT_LENGTH} characters
          </p>
        </div>

        {/* Category Dropdown */}
        <select 
          name="category" 
          value={formData.category.id} 
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

        {/* Image Upload */}
        <div>
          <input 
            type="file" 
            name="image" 
            onChange={handleImageChange} 
            className="w-full p-3 border border-gray-300 rounded-md" 
            accept={ALLOWED_FILE_TYPES.join(',')}
          />
          <p className="text-sm text-gray-600 mt-1">
            Max file size: {MAX_FILE_SIZE / 1024 / 1024}MB. 
            Allowed types: JPEG, PNG, GIF, WEBP
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
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;