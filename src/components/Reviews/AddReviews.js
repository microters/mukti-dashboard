import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_KEY = "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079"; // Replace with your real API key

const AddReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    rating: 0,
    reviewText: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch existing reviews
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.muktihospital.com/api/reviews", {
        headers: { "x-api-key": API_KEY },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle clicking on stars for rating
  const handleStarClick = (starValue) => {
    setFormData({ ...formData, rating: starValue });
  };

  // Handle review submission (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`https://api.muktihospital.com/api/reviews/${editingId}`, formData, {
          headers: { "x-api-key": API_KEY },
        });
        toast.success("Review updated successfully!");
      } else {
        await axios.post("https://api.muktihospital.com/api/reviews", formData, {
          headers: { "x-api-key": API_KEY },
        });
        toast.success("Review added successfully!");
      }

      fetchReviews();
      setEditingId(null);
      setFormData({ name: "", role: "", image: "", rating: 0, reviewText: "" });

    } catch (error) {
      console.error("Error saving review:", error);
      toast.error("Error saving review");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete modal open
  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);
    setShowDeleteModal(false);

    try {
      await axios.delete(`https://api.muktihospital.com/api/reviews/${deleteId}`, {
        headers: { "x-api-key": API_KEY },
      });
      toast.success("Review deleted successfully!");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting review");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a review
  const handleEdit = (review) => {
    setEditingId(review.id);
    setFormData({
      name: review.name,
      role: review.role,
      image: review.image,
      rating: review.rating,
      reviewText: review.reviewText,
    });
  };

  // Generate star ratings dynamically
  const renderStars = (rating, clickable = false) => {
    return (
      <div className="flex space-x-1 text-yellow-500 cursor-pointer">
        {Array.from({ length: 5 }, (_, index) => (
          <FaStar
            key={index}
            onClick={clickable ? () => handleStarClick(index + 1) : null}
            className={index < rating ? "text-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{editingId ? "Edit Review" : "Add Review"}</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="p-2 border rounded" required />
          <input type="text" name="role" placeholder="Role (e.g., Patient)" value={formData.role} onChange={handleChange} className="p-2 border rounded" required />
          <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="p-2 border rounded" />
          
          {/* Clickable Star Rating */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Rating:</span>
            {renderStars(formData.rating, true)}
          </div>

          <textarea name="reviewText" placeholder="Review text" value={formData.reviewText} onChange={handleChange} className="p-2 border rounded col-span-2" required></textarea>
          
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2">
            {loading ? "Submitting..." : editingId ? "Update Review" : "Add Review"}
          </button>
        </form>
      </div>

      {/* Display Existing Reviews */}
      <div className="max-w-4xl mx-auto mt-6">
        <h2 className="text-xl font-bold mb-4">User Reviews</h2>

        {loading ? (
          <div className="text-center text-gray-600">Loading reviews...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-2">
                  <img src={review.image || "https://placehold.co/50"} alt={review.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <h3 className="font-bold">{review.name}</h3>
                    <p className="text-sm text-gray-600">{review.role}</p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="mt-2">{renderStars(review.rating)}</div>

                <p className="mt-2 text-sm">{review.reviewText}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(review)} className="bg-green-500 text-white px-3 py-1 rounded">
                    <FaEdit />
                  </button>
                  <button onClick={() => confirmDelete(review.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-bold">Are you sure you want to delete this review?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-400 rounded text-white">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 rounded text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddReviews;
