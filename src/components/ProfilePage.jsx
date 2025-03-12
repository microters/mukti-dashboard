import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/signin"); // Redirect to login if no token
    }

    // Fetch user profile information
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://api.muktihospital.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = response.data;
        setUser(userData);
        setName(userData.name);
        setMobile(userData.mobile);
        setUsername(userData.username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleImageChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("username", username);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);

    try {
      const response = await axios.put("https://api.muktihospital.com/api/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      alert("Profile updated successfully");
      setUser(response.data.user);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mobile</label>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full p-2 border rounded"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Profile Photo</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Show User Profile Image if Available */}
        {user.profilePhoto && (
          <div>
            <img 
              src={`http://localhost:5000${user.profilePhoto}`} 
              alt="User Profile"
              className="w-32 h-32 rounded-full object-cover mt-4"
            />
          </div>
        )}

        <div className="flex gap-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Changes</button>
          <button
            type="button"
            onClick={() => setProfilePhoto(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
