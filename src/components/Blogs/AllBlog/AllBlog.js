import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Custom modal to confirm deletion
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, blogId }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Are you sure?
        </h2>
        <p className="text-gray-600 mb-6">
          Do you really want to delete this blog record?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(blogId)}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // For delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const navigate = useNavigate();

  // 1. Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://api.muktihospital.com/api/blogs", {
          headers: {
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
        });
        // Expecting the API to return an array of blog records
        const blogsData = Array.isArray(response.data)
          ? response.data
          : response.data.blogs || [];
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Failed to fetch blog list");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
console.log(blogs);

  // 2. Handle search input
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterBlogs(term, selectedLanguage);
  };

  // 3. Handle language selection change
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    filterBlogs(searchTerm, lang);
  };

  // 4. Filter blogs based on search term and selected language
  const filterBlogs = (term, language) => {
    const filtered = blogs.filter((blog) => {
      const title = blog.translations[language]?.title?.toLowerCase() || "";
      const description = blog.translations[language]?.description?.toLowerCase() || "";
      return title.includes(term) || description.includes(term);
    });
    setFilteredBlogs(filtered);
  };

  // 5. Open delete modal
  const openDeleteModal = (blogId) => {
    setBlogToDelete(blogId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  // 6. Handle blog deletion
  const handleConfirmDelete = async (id) => {
    setDeleteModalOpen(false);
    try {
      await axios.delete(`https://api.muktihospital.com/api/blogs/delete/${id}`, {
        headers: {
          "x-api-key":
            "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
        },
      });

      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      setFilteredBlogs((prev) => prev.filter((blog) => blog.id !== id));
      toast.success("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog.");
    }
  };

  // 7. Navigate to edit blog page
  const handleEdit = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-right" />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        blogId={blogToDelete}
      />

      <h2 className="text-2xl font-bold mb-4 text-gray-700">Blog List</h2>

      {/* Top Controls: Language selector + search */}
      <div className="flex justify-between items-center mb-4">
        <select
          className="p-2 border rounded-md"
          onChange={handleLanguageChange}
          value={selectedLanguage}
        >
          <option value="en">English</option>
          <option value="bn">Bangla</option>
        </select>
        <input
          type="text"
          className="p-2 border rounded-md"
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Blogs Table */}
      {loading ? (
        <div className="mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 mb-2">
              <Skeleton width={150} height={25} />
              <Skeleton width={400} height={25} />
              <Skeleton width={150} height={25} />
              <Skeleton width={100} height={25} />
              <Skeleton width={150} height={25} />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-gray-600">Blog ID</th>
                <th className="border px-4 py-2 text-gray-600">Title</th>
                <th className="border px-4 py-2 text-gray-600">Description</th>
                <th className="border px-4 py-2 text-gray-600">Languages</th>
                <th className="border px-4 py-2 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{blog.id}</td>
                  <td className="border px-4 py-2">
                    {blog.translations[selectedLanguage]?.title || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {blog.translations[selectedLanguage]?.description || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {Object.keys(blog.translations).join(", ")}
                  </td>
                  <td className="border px-4 py-2 flex gap-3 items-center">
                    <button
                      onClick={() => handleEdit(blog.id)}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(blog.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="border px-4 py-4 text-center text-gray-500"
                  >
                    No blogs found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogList;
