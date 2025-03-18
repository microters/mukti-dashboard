import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const fetchCategories = async () => {
        try {
          setLoading(true);
          const response = await axios.get("https://api.muktihospital.com/api/category", {
            headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
          });
      
          if (!response.data || !Array.isArray(response.data)) {
            throw new Error("Invalid data format received");
          }
      
          console.log("✅ API Response:", response.data);
          setCategories(response.data);
          setFilteredCategories(response.data);
        } catch (error) {
          console.error("❌ Error fetching categories:", error);
          toast.error("Failed to load categories.");
          setCategories([]); // ✅ Prevents frontend from breaking if API fails
          setFilteredCategories([]);
        } finally {
          setLoading(false);
        }
      };
      
      

    fetchCategories();
  }, []);

  // 🔹 Handle search input
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterCategories(term, selectedLanguage);
  };

  // 🔹 Handle language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    filterCategories(searchTerm, newLang);
  };

  // 🔹 Filter categories based on search & language
  const filterCategories = (term, lang) => {
    const filtered = categories.filter((cat) => {
      const trans = cat.translations?.[lang] || {};
      return trans.name?.toLowerCase().includes(term) || trans.metaTitle?.toLowerCase().includes(term);
    });
    setFilteredCategories(filtered);
  };

  // 🔹 Handle category delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`https://api.muktihospital.com/api/category/${id}`, {
        headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
      });
      setCategories(categories.filter((cat) => cat.id !== id));
      setFilteredCategories(filteredCategories.filter((cat) => cat.id !== id));
      toast.success("Category deleted successfully.");
    } catch (error) {
      console.error("❌ Error deleting category:", error);
      toast.error("Failed to delete category.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Category List</h2>

      <div className="flex justify-between mb-4">
        {/* Language Selector */}
        <select className="p-2 border rounded-md" onChange={handleLanguageChange} value={selectedLanguage}>
          <option value="en">English</option>
          <option value="bn">Bangla</option>
        </select>

        {/* Search Input */}
        <input
          type="text"
          className="p-2 border rounded-md"
          placeholder="Search by name or meta title"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Category Name</th>
              <th className="border px-4 py-2">Meta Title</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5)
                .fill()
                .map((_, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">
                      <Skeleton />
                    </td>
                    <td className="border px-4 py-2">
                      <Skeleton />
                    </td>
                    <td className="border px-4 py-2">
                      <Skeleton />
                    </td>
                    <td className="border px-4 py-2">
                      <Skeleton />
                    </td>
                  </tr>
                ))
            ) : (
              filteredCategories.map((cat) => {
                console.log("⏳ Processing Category:", cat);
                // ✅ Ensure translations exist
                const trans =
                  cat.translations && typeof cat.translations === "object"
                    ? cat.translations[selectedLanguage] || cat.translations["en"] || {}
                    : {};

                console.log("🔍 Translations Data:", trans);

                return (
                  <tr key={cat.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{cat.id}</td>
                    <td className="border px-4 py-2">{trans.name ? trans.name : "N/A"}</td>
                    <td className="border px-4 py-2">{trans.metaTitle ? trans.metaTitle : "N/A"}</td>
                    <td className="border px-4 py-2 flex gap-3">
                      <Link to={`/edit-category/${cat.id}`} className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                        <FaEdit /> Edit
                      </Link>
                      <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryList;
