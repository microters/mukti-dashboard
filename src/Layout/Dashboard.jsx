import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Shared/Sidebar/Sidebar";
import TopHeader from "../pages/Shared/TopHeader/TopHeader";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-50 transition-transform duration-300 bg-gray-900 text-white min-h-screen 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Right Side Content */}
      <div className="flex flex-col w-full">
        {/* Top Header */}
        <TopHeader setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <div className="p-4 hide-scrollbar overflow-y-auto flex-grow h-[calc(100vh-72px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
