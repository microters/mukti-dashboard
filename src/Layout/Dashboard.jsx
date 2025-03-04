import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Shared/Sidebar/Sidebar";
import TopHeader from "../pages/Shared/TopHeader/TopHeader";
import { HiChevronLeft } from "react-icons/hi";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle window resize to update `isMobile`
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <TopHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <div className="p-4 hide-scrollbar overflow-y-auto flex-grow h-[calc(100vh-72px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
