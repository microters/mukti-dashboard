import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AllPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  const API_URL = "http://localhost:5000/api/page";

  // ✅ Fetch all pages
  useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}&search=${search}`, {
          headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch pages");

        console.log("✅ API Response:", data); // Debugging output

        setPages(data.pages); // ✅ Extract "pages" array only
        setTotalPages(data.totalPages); // ✅ Set correct pagination
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [page, search]);

  // ✅ Open Delete Modal
  const openDeleteModal = (page) => {
    setSelectedPage(page);
    setShowDeleteModal(true);
  };

  // ✅ Close Delete Modal
  const closeDeleteModal = () => {
    setSelectedPage(null);
    setShowDeleteModal(false);
  };

  // ✅ Delete Page Function
  const handleDelete = async () => {
    if (!selectedPage) return;

    try {
      const response = await fetch(`${API_URL}/delete/${selectedPage.id}`, {
        method: "DELETE",
        headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to delete page");

      toast.success("Page deleted successfully!");
      setPages((prevPages) => prevPages.filter((page) => page.id !== selectedPage.id)); // ✅ Remove from UI
      closeDeleteModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">All Pages</h1>

      {/* ✅ Search Bar */}
      <div className="mb-4">
        {loading ? (
          <Skeleton height={40} />
        ) : (
          <input
            type="text"
            placeholder="Search Pages..."
            className="w-full p-3 border border-gray-300 rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {/* ✅ Pages Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(10)].map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3"><Skeleton width={20} /></td>
                  <td className="p-3"><Skeleton width="100%" /></td>
                  <td className="p-3"><Skeleton width="80%" /></td>
                  <td className="p-3 flex gap-2">
                    <Skeleton width={60} height={30} />
                    <Skeleton width={60} height={30} />
                  </td>
                </tr>
              ))
            ) : pages.length > 0 ? (
              pages.map((page, index) => (
                <tr key={page.id} className="border-t">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{page.name || "N/A"}</td>
                  <td className="p-3">{page.slug}</td>
                  <td className="p-3 flex gap-2">
                    {/* ✅ Edit Page */}
                    <Link
                      to={`/edit-page/${page.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Edit
                    </Link>

                    {/* ✅ Open Delete Modal */}
                    <button
                      onClick={() => openDeleteModal(page)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-5">
                  No pages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 bg-gray-300 rounded-md ${page === 1 && "opacity-50 cursor-not-allowed"}`}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span className="text-gray-700">Page {page} of {totalPages}</span>

        <button
          className={`px-4 py-2 bg-gray-300 rounded-md ${page === totalPages && "opacity-50 cursor-not-allowed"}`}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && selectedPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Confirm Delete</h2>
            <p className="mt-2 text-gray-600">
              Are you sure you want to delete the page <strong>{selectedPage.name}</strong>?
            </p>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPages;
