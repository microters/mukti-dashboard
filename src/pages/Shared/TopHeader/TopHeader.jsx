import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaHome, FaSearch, FaUserCircle, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import logo from "../../../assets/logo/MH-icon.png";

const TopHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/login");
  };

  return (
    <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
     <div className="flex gap-3">
       {/* Left Section - Hamburger Icon (For Mobile) */}
       <button className="lg:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <FaBars size={24} />
      </button>

      {/* Search Box */}
      <div className="relative w-72 md:flex hidden">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-800 text-white p-2 pl-10 rounded-md outline-none focus:ring focus:ring-gray-600"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
     </div>

      {/* Right Section - Icons & Profile */}
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Notifications */}
        <Link to="/notifications" className="relative text-gray-400 hover:text-white">
          <FaBell size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full">3</span>
        </Link>

        {/* Home Icon */}
        <Link to="/" className="text-gray-400 hover:text-white">
          <FaHome size={20} />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-3 p-2 rounded-md transition-all" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <img src={logo} alt="Admin" className="w-8 h-8 rounded-full" />
            <span className="text-sm">Mukti Hospital</span>
            {dropdownOpen ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[100%] bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-all">
                <FaUserCircle /> Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-700 transition-all">
                <FaCog /> Settings
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-400 hover:bg-red-600 hover:text-white transition-all">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
