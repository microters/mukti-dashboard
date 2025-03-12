import axios from "axios";

const API_BASE_URL = "https://api.muktihospital.com/api/auth"; // Backend API URL

// ✅ Get User Profile (Authenticated Request)
export const getUser = async () => {
  const token = localStorage.getItem("authToken");
console.log(token);

  if (!token) {
    console.warn("⚠️ No auth token found. Redirecting to login...");
    return null;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZTQwMGY1ZS1mYjZlLTRkYzktYThiNi1jZDUwZjAzNDUyZmQiLCJtb2JpbGUiOiI4ODAxNjA5MTAxNTM3IiwiaWF0IjoxNzQxNTA3OTIxLCJleHAiOjE3NDIxMTI3MjF9.rpxTX79YuchLLfBub7J1PyIyTK0AX0T4-K4p2xikrD4` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error Fetching User Profile:", error.response?.data || error.message);
    return null;
  }
};

// ✅ Logout User
export const logout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
    localStorage.removeItem("authToken");
    window.location.href = "http://localhost:3000/login"; // Redirect to login
  } catch (error) {
    console.error("❌ Logout Error:", error.response?.data || error.message);
  }
};
