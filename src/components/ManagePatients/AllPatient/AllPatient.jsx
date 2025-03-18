import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const AllPatient = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of patients per page

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/patient", {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });

        console.log("✅ API Response:", response.data);
        setPatients(response.data);
        setFilteredPatients(response.data);
      } catch (error) {
        console.error("❌ Error fetching patients:", error);
        toast.error("Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // 🔹 **Search by Patient Name**
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredPatients(patients); // Reset to the full list when search is cleared
    } else {
      const filtered = patients.filter((patient) =>
        patient.name?.toLowerCase().includes(term) // Search based on name only
      );
      setFilteredPatients(filtered);
      setCurrentPage(1); // Reset to page 1 after searching
    }
  };

  // 🔹 **Handle Patient Deletion**
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      console.log("Deleting patient with ID:", id);

      await axios.delete(`http://localhost:5000/api/patient/delete/${id}`, {
        headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
      });

      const updatedPatients = patients.filter((patient) => patient.id !== id);
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);

      toast.success("Patient deleted successfully.");
    } catch (error) {
      console.error("❌ Error deleting patient:", error);
      toast.error("Failed to delete patient.");
    }
  };

  // 🔹 **Pagination Logic**
  const indexOfLastPatient = currentPage * itemsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  // 🔹 **Change Page**
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 🔹 **Calculate Page Numbers**
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Patient List</h2>

      {/* Search Input */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          className="p-2 border rounded-md w-full"
          placeholder="Search by Patient Name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          // 🔹 **Skeleton Loader when data is loading**
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2"><Skeleton width={50} /></th>
                <th className="border px-4 py-2"><Skeleton width={200} /></th>
                <th className="border px-4 py-2"><Skeleton width={150} /></th>
                <th className="border px-4 py-2"><Skeleton width={100} /></th>
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2"><Skeleton width={50} /></td>
                  <td className="border px-4 py-2"><Skeleton width={200} /></td>
                  <td className="border px-4 py-2"><Skeleton width={150} /></td>
                  <td className="border px-4 py-2"><Skeleton width={100} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // 🔹 **Patient Table**
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Patient Name</th>
                <th className="border px-4 py-2">Phone Number</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length > 0 ? (
                currentPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{patient.id}</td>
                    <td className="border px-4 py-2">{patient.name || "N/A"}</td>
                    <td className="border px-4 py-2">{patient.phoneNumber || "N/A"}</td>
                    <td className="border px-4 py-2 flex gap-3">
                      <Link to={`/edit-patient/${patient.id}`} className="text-blue-500 hover:text-blue-700">
                        <FaEdit /> Edit
                      </Link>
                      <button onClick={() => handleDelete(patient.id)} className="text-red-500 hover:text-red-700">
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">No patients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <nav>
            <ul className="flex list-style-none">
              {pageNumbers.map((number) => (
                <li key={number} className="mx-2">
                  <button
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 ${number === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                  >
                    {number}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default AllPatient;
