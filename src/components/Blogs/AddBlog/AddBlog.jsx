import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";

const AddBlog = () => {
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    metaTitle: "",
    metaDescription: "",
    title: "",
    slug: "",
    description: "",
    content: "",
    categories: "",
    image: null,
  });
  const [isSlugEditable, setIsSlugEditable] = useState(false); 

  const categoriesList = ["Technology", "Health", "Business", "Lifestyle", "Education"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleContentChange = (newContent) => {
    const strippedContent = newContent.replace(/<\/?p>/g, "");
    setFormData({ ...formData, content: strippedContent });
  };
  

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, categories: e.target.value });
  };

  const handleSlugChange = (e) => {
    setFormData({ ...formData, slug: e.target.value });
  };

  const handleSlugEditToggle = () => {
    setIsSlugEditable(!isSlugEditable);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Organize the form data into an object
    const blogData = {
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      content: formData.content,
      categories: formData.categories,
      image: formData.image.name,
    };

    console.log("Submitted Blog Data:", blogData);

  };

  // Automatically update the slug from the title (unless edited manually)
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Add New Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Meta Title */}
        <div>
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
            Meta Title
          </label>
          <input
            type="text"
            id="metaTitle"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Meta Description */}
        <div>
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

         {/* Slug */}
            <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug
            </label>
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
            </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <JoditEditor
            ref={editor}
            value={formData.content}
            onChange={handleContentChange}
            config={{
              placeholder: "Start writing your blog content here...",
            }}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
          />
        </div>

        {/* Categories Dropdown */}
        <div>
          <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
            Categories
          </label>
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
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="mt-1 p-3 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
          >
            Add Blog
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;
