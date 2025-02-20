import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// React Toastify for notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// React Skeleton for loading placeholders
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Example custom modal for confirm delete
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, doctorId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Are you sure?
        </h2>
        <p className="text-gray-600 mb-6">
          Do you really want to delete this doctor record?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(doctorId)}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  // For Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const navigate = useNavigate();

  // ------------------------------
  // 1. Fetch Doctors
  // ------------------------------
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);

        const response = await axios.get("http://localhost:5000/api/doctor", {
          headers: {
            "x-api-key":
              "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
        });

        setDoctors(response.data);
        console.log(response.data);
        
        setFilteredDoctors(response.data); // Initially, all doctors
        console.log(filteredDoctors);
        
      } catch (error) {
        console.error("Error fetching doctors:", error);
        toast.error("Failed to fetch doctor list");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // ------------------------------
  // 2. Handle Search
  // ------------------------------
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterDoctors(term, selectedLanguage);
  };

  // ------------------------------
  // 3. Language Change
  // ------------------------------
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    filterDoctors(searchTerm, lang);
  };

  // ------------------------------
  // 4. Filter
  // ------------------------------
  const filterDoctors = (term, language) => {
    const filtered = doctors.filter((doctor) => {
      const name =
        doctor.translations[language]?.name?.toLowerCase() || "";
      const department =
        doctor.translations[language]?.department?.toLowerCase() || "";
      const email = doctor.email?.toLowerCase() || "";

      return (
        name.includes(term) ||
        department.includes(term) ||
        email.includes(term)
      );
    });
    setFilteredDoctors(filtered);
  };

  // ------------------------------
  // 5. Delete Doctor
  // ------------------------------
  const openDeleteModal = (doctorId) => {
    setDoctorToDelete(doctorId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDoctorToDelete(null);
  };

  const handleConfirmDelete = async (id) => {
    // close modal first
    setDeleteModalOpen(false);

    try {
      await axios.delete(`http://localhost:5000/api/doctor/delete/${id}`, {
        headers: {
          "x-api-key":
            "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
        },
      });

      setDoctors((prev) => prev.filter((doctor) => doctor.id !== id));
      setFilteredDoctors((prev) => prev.filter((doctor) => doctor.id !== id));

      toast.success("Doctor deleted successfully!");
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Failed to delete doctor.");
    }
  };

  // ------------------------------
  // 6. Edit Doctor
  // ------------------------------
  const handleEdit = (id) => {
    navigate(`/edit-doctor/${id}`);
  };

  return (
    <div className="container mx-auto p-6">
      {/* Toastify container for notifications */}
      <ToastContainer position="top-right" />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        doctorId={doctorToDelete}
      />

      <h2 className="text-2xl font-bold mb-4 text-gray-700">Doctor List</h2>

      {/* Top controls: Language selector + search */}
      <div className="flex justify-between items-center mb-4">
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

      {/* Table */}
      {loading ? (
        /* Show skeleton placeholders while loading */
        <div className="mt-4">
          {/* Example: 5 skeleton rows */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 mb-2">
              <Skeleton width={600} height={25} />
              <Skeleton width={100} height={25} />
              <Skeleton width={200} height={25} />
              <Skeleton width={150} height={25} />
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2 text-gray-600">Doctor ID</th>
                <th className="border px-4 py-2 text-gray-600">Doctor Name</th>
                <th className="border px-4 py-2 text-gray-600">Department</th>
                <th className="border px-4 py-2 text-gray-600">Email</th>
                <th className="border px-4 py-2 text-gray-600">Languages</th>
                <th className="border px-4 py-2 text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{doctor.id}</td>
                  <td className="border px-4 py-2">
                    {doctor.translations[selectedLanguage]?.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    {doctor.translations[selectedLanguage]?.department ||
                      "N/A"}
                  </td>
                  <td className="border px-4 py-2">{doctor.email}</td>
                  <td className="border px-4 py-2">
                    {Object.keys(doctor.translations).join(", ")}
                  </td>
                  <td className="border px-4 py-2 flex gap-3 items-center">
                    <button
                      onClick={() => handleEdit(doctor.id)}
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(doctor.id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}

              {/* If no doctors found after filtering */}
              {filteredDoctors.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="border px-4 py-4 text-center text-gray-500"
                  >
                    No doctors found.
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

export default DoctorList;
