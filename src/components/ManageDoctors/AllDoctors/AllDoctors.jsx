import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default language to English
  const navigate = useNavigate();

  // 🔹 Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor", {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });
        setDoctors(response.data);
        setFilteredDoctors(response.data); // Initially set filtered doctors as all doctors
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // 🔹 Handle search input change
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterDoctors(term, selectedLanguage);
  };

  // 🔹 Handle language selection
  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    filterDoctors(searchTerm, e.target.value); // Filter doctors based on selected language
  };

  // 🔹 Filter doctors based on search term and language
  const filterDoctors = (term, language) => {
    const filtered = doctors.filter((doctor) => {
      const name = doctor.translations[language]?.name.toLowerCase() || "";
      const department = doctor.translations[language]?.department.toLowerCase() || "";
      const email = doctor.email.toLowerCase();
      
      return (
        name.includes(term) ||
        department.includes(term) ||
        email.includes(term)
      );
    });
    setFilteredDoctors(filtered);
  };

  // 🔹 Handle delete doctor
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this doctor?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/doctor/delete/${id}`, {
        headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
      });
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
      setFilteredDoctors(filteredDoctors.filter((doctor) => doctor.id !== id)); // Update filtered list
      alert("Doctor deleted successfully!");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor.");
    }
  };

  // 🔹 Handle edit doctor (Redirects to edit page)
  const handleEdit = (id) => {
    navigate(`/edit-doctor/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Doctor List</h2>

      <div className="flex justify-between mb-4">
        {/* Language selector */}
        <select
          className="p-2 border rounded-md"
          onChange={handleLanguageChange}
          value={selectedLanguage}
        >
          <option value="en">English</option>
          <option value="bn">Bangla</option>
        </select>

        {/* Search input */}
        <input
          type="text"
          className="p-2 border rounded-md"
          placeholder="Search by name, email, or department"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Loading doctors...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Doctor ID</th>
                <th className="border px-4 py-2">Doctor Name</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Languages</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{doctor.id}</td>
                  <td className="border px-4 py-2">
                    {doctor.translations[selectedLanguage]?.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {doctor.translations[selectedLanguage]?.department || "N/A"}
                  </td>
                  <td className="border px-4 py-2">{doctor.email}</td>
                  <td className="border px-4 py-2">
                    {Object.keys(doctor.translations).join(", ")}
                  </td>
                  <td className="border px-4 py-2 flex gap-3">
                    <button
                      onClick={() => handleEdit(doctor.id)}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
