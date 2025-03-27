import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "../pages/Shared/Sidebar/Sidebar";
import TopHeader from "../pages/Shared/TopHeader/TopHeader";
import { HiChevronLeft } from "react-icons/hi";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  console.log(user);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");

      if (urlToken) {
        localStorage.setItem("authToken", urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const token = localStorage.getItem("authToken");

      if (!token) {
        window.location.href = "https://mukti-frontend.vercel.app/signin";
        return;
      }

      try {
        const response = await fetch("https://api.muktihospital.com/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          console.warn("Server error:", data.error);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-50 transition-transform duration-300 bg-gray-900 text-white min-h-screen p-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Component */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Close Arrow Button Inside Sidebar (ONLY for Mobile) */}
        {isSidebarOpen && isMobile && (
          <button
            className="absolute top-5 right-5 bg-orange-500 text-white rounded-md p-2 shadow-md transition-all"
            onClick={() => setIsSidebarOpen(false)}
          >
            <HiChevronLeft size={24} />
          </button>
        )}
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Right Side Content */}
      <div className="flex flex-col w-full">
        {/* Top Header */}
        <TopHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}  user={user} />

        {/* Main Content */}
        <div className="px-5 py-4 hide-scrollbar overflow-y-auto bg-[#F5F9FD] flex-grow h-[calc(100vh-73px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
