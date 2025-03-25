// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { FaBell, FaHome, FaSearch, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
// import { HiChevronLeft, HiChevronRight, HiChevronDown, HiChevronUp } from "react-icons/hi";
// import logo from "../../../assets/logo/MH-icon.png";

// const TopHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

//   // Update `isMobile` state on window resize
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth < 1024);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="bg-white text-gray-800 px-6 py-4 flex justify-between items-center shadow-md relative">
//       {/* Left Section: Show Arrow Button ONLY on Mobile */}
//       <div className="flex items-center gap-3">
//         {isMobile && (
//           <button
//             className="text-white transition-all p-2 bg-orange-500 rounded-md"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           >
//             {isSidebarOpen ? <HiChevronLeft size={24} /> : <HiChevronRight size={24} />}
//           </button>
//         )}

//         {/* Search Box (Hidden in Mobile) */}
//         <div className="relative w-72 md:flex hidden">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full bg-gray-100 text-gray-800 p-2 pl-10 rounded-md outline-none focus:ring focus:ring-gray-400"
//           />
//           <FaSearch className="absolute left-3 top-3 text-gray-600" />
//         </div>
//       </div>

//       {/* Right Section: Icons & Profile */}
//       <div className="flex items-center gap-3 lg:gap-6">
//         {/* Notifications */}
//         <Link to="/notifications" className="relative text-gray-600 hover:text-gray-800">
//           <FaBell size={20} />
//           <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full">3</span>
//         </Link>

//         {/* Home Icon */}
//         <Link to="/" className="text-gray-600 hover:text-gray-800">
//           <FaHome size={20} />
//         </Link>

//         {/* Profile Dropdown */}
//         <div className="relative">
//           <button className="flex items-center gap-3 p-2 rounded-md transition-all" onClick={() => setDropdownOpen(!dropdownOpen)}>
//             <img src={logo} alt="Admin" className="w-8 h-8 rounded-full" />
//             <span className="text-sm">Mukti Hospital</span>
//             {dropdownOpen ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
//           </button>

//           {/* Dropdown Menu */}
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-[100%] bg-gray-100 rounded-md shadow-lg overflow-hidden z-50">
//               <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 transition-all">
//                 <FaUserCircle /> Profile
//               </Link>
//               <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 transition-all">
//                 <FaCog /> Settings
//               </Link>
//               <button
//                 onClick={() => alert("Logging out...")}
//                 className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-400 hover:bg-red-100 hover:text-red-600 transition-all"
//               >
//                 <FaSignOutAlt /> Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopHeader;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaHome,
  FaSearch,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  HiChevronLeft,
  HiChevronRight,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import logo from "../../../assets/logo/MH-icon.png";

const TopHeader = ({ isSidebarOpen, setIsSidebarOpen, user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Update `isMobile` state on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white text-gray-800 px-5 lg:px-10 py-4 flex justify-between items-center shadow relative">
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            className="text-black transition-all "
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <div><HiOutlineMenuAlt2 size={24} /></div>
            ) : (
              <div><HiOutlineMenuAlt2 size={24} /></div>
            )}
          </button>
        )}
        <div className="relative w-72 md:flex hidden">
          <input
            type="text"
            placeholder="Search..."
            className="w-full py-2 px-6 pl-9 border border-M-text-color/20 rounded-md ring-0 focus:ring-1 focus:ring-M-primary-color outline-none duration-300 font-jost text-base"
          />
          <IoSearchOutline  className="absolute left-3 top-[14px] text-M-text-color" />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <Link
          to="/notifications"
          className="relative text-gray-600 hover:text-gray-800"
        >
          <FaBell size={20} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </Link>

        <Link to="/" className="text-gray-600 hover:text-gray-800">
          <FaHome size={20} />
        </Link>

        <div className="relative">
          <button
            className="flex items-center gap-3 p-2 rounded-md transition-all font-jost "
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user && user.profilePhoto ? (
        <img 
        src={`https://api.muktihospital.com${user.profilePhoto}`} 
        alt="User Profile" 
        className="w-8 h-8 rounded-full" 
      />
      
            ) : (
              <FaUserCircle size={24} />
            )}
            <span className="text-sm text-left capitalize font-medium truncate text-ellipsis w-16">{user ? user.name : "Loading..."}</span>
            {dropdownOpen ? (
              <HiChevronUp size={18} />
            ) : (
              <HiChevronDown size={18} />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[100%] bg-gray-100 rounded-md shadow-lg overflow-hidden z-50">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 transition-all"
              >
                <FaUserCircle /> Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 transition-all"
              >
                <FaCog /> Settings
              </Link>
              <button
                onClick={() => alert("Logging out...")}
                className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-400 hover:bg-red-100 hover:text-red-600 transition-all"
              >
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
