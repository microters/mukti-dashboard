import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/department", {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });

        console.log("✅ API Response:", response.data); // Debugging API Data
        setDepartments(response.data);
        setFilteredDepartments(response.data);
      } catch (error) {
        console.error("❌ Error fetching departments:", error);
        toast.error("Failed to load departments.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // 🔹 Handle search input
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterDepartments(term, selectedLanguage);
  };

  // 🔹 Handle language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    filterDepartments(searchTerm, newLang);
  };

  // 🔹 Filter departments based on search & language
  const filterDepartments = (term, lang) => {
    const filtered = departments.filter((dep) => {
      const trans = dep.translations?.[lang] || {};
      return trans.name?.toLowerCase().includes(term) || trans.metaTitle?.toLowerCase().includes(term);
    });
    setFilteredDepartments(filtered);
  };

  // 🔹 Handle department delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/department/${id}`, {
        headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
      });
      setDepartments(departments.filter((dep) => dep.id !== id));
      setFilteredDepartments(filteredDepartments.filter((dep) => dep.id !== id));
      toast.success("Department deleted successfully.");
    } catch (error) {
      console.error("❌ Error deleting department:", error);
      toast.error("Failed to delete department.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Department List</h2>

      <div className="flex justify-between mb-4">
        {/* Language Selector */}
        <select className="p-2 border rounded-md" onChange={handleLanguageChange} value={selectedLanguage}>
          <option value="en">English</option>
          <option value="bn">Bangla</option>
        </select>

        {/* Search Input */}
        <input type="text" className="p-2 border rounded-md" placeholder="Search by name or meta title" value={searchTerm} onChange={handleSearch} />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Department Name</th>
              <th className="border px-4 py-2">Meta Title</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredDepartments.map((dep) => {
    console.log("⏳ Processing Department:", dep); // Debug department object

    // ✅ Ensure translations exist
    const trans = dep.translations && typeof dep.translations === "object"
      ? dep.translations[selectedLanguage] || dep.translations["en"] || {}
      : {};

    console.log("🔍 Translations Data:", trans); // Debugging translation data

    return (
      <tr key={dep.id} className="hover:bg-gray-100">
        <td className="border px-4 py-2">{dep.id}</td>
        <td className="border px-4 py-2">{trans.name ? trans.name : "N/A"}</td>
        <td className="border px-4 py-2">{trans.metaTitle ? trans.metaTitle : "N/A"}</td>
        <td className="border px-4 py-2 flex gap-3">
          <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
          <Link to={`/edit-department/${dep.id}`} className="text-blue-500 hover:text-blue-700">
  <FaEdit /> Edit
</Link>

          </button>
          <button onClick={() => handleDelete(dep.id)} className="text-red-500 hover:text-red-700 flex items-center gap-1">
            <FaTrash /> Delete
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default DepartmentList;
