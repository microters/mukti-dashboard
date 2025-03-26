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
  FaHome,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";
import { LuSearch } from "react-icons/lu";
import { MdOutlineNotificationsNone, MdOutlineDarkMode } from "react-icons/md";
import { TbApps } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

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
    <div className="bg-white text-gray-800 px-5 lg:px-8 flex justify-between items-center shadow-[#6886b126] relative h-[73px]">
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
            placeholder="Search something.."
            className="w-60 px-3 py-[10px] pl-9 rounded-md ring-0 focus:ring-1 focus:ring-M-primary-color outline-none duration-300 font-inter text-[14px] bg-[#f0f3f8]"
          />
          <LuSearch size={18} className="absolute left-3 top-[12px] text-[#9ba6b7]" />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-6">
        <Link to="/" cursor="pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 24"><g fill="none"><path fill="#f7fcff" fill-rule="evenodd" d="M0 0h32v24H0z" clip-rule="evenodd"/><path fill="#e31d1c" fill-rule="evenodd" d="M0 14.667v2h32v-2zm0 3.666v2h32v-2zm0-11v2h32v-2zM0 22v2h32v-2zm0-11v2h32v-2zM0 0v2h32V0zm0 3.667v2h32v-2z" clip-rule="evenodd"/><path fill="#2e42a5" d="M0 0h20v13H0z"/><path fill="#f7fcff" fill-rule="evenodd" d="m1.722 2.939l-.726.509l.245-.906l-.645-.574h.843l.282-.74l.331.74h.718l-.564.574l.218.906zm4 0l-.726.509l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zm3.274.509l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.842l.644.574zm4.726-.51l-.726.51l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zM.996 7.449l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74H.596l.645.574zm4.726-.51l-.726.51l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zm3.274.51l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.842l.644.574zm4.726-.51l-.726.51l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zM.996 11.449l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74H.596l.645.574zm4.726-.51l-.726.51l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zm3.274.51l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.842l.644.574zm4.726-.51l-.726.51l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zm3.274-7.49l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.843l.645.574zm.726 3.49l-.726.51l.245-.906l-.645-.574h.843l.282-.74l.331.74h.718l-.564.574l.218.906zm-.726 4.51l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.843l.645.574zM3.722 4.938l-.726.51l.245-.906l-.645-.574h.843l.282-.74l.331.74h.718l-.564.574l.218.906zm3.274.51l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.843l.645.574zm4.726-.51l-.726.51l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zm-8.726 4.51l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.843l.645.574zm4.726-.51l-.726.51l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zm3.274.51l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.842l.644.574zm4.726-4.51l-.726.51l.245-.906l-.644-.574h.842l.282-.74l.331.74h.718l-.564.574l.218.906zm-.726 4.51l.726-.51l.702.51l-.218-.906l.564-.574h-.718l-.331-.74l-.282.74h-.842l.644.574z" clip-rule="evenodd"/></g></svg>
        </Link>
        <Link
          to="/notifications"
          className="relative text-[#6c757d] hover:text-M-primary-color"
        >
          <MdOutlineNotificationsNone  size={22}/>
        </Link>
        <Link
          to="/"
          className=" text-[#6c757d] hover:text-M-primary-color"
        >
          <TbApps size={22}/>
        </Link>
        <Link
          to="/"
          className="text-[#6c757d] hover:text-M-primary-color"
        >
          <IoSettingsOutline size={22}/>
        </Link>
        <Link
          to="/"
          className="text-[#6c757d] hover:text-M-primary-color"
        >
          <MdOutlineDarkMode size={22}/>
        </Link>

        <div className="relative h-[73px] flex bg-[#fafafd] border-x-[#eef2f7]">
          <button
            className="flex items-center gap-3 transition-all font-inter px-3 py-0 border-x border-[#eef2f7] group"
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
            <span className="text-sm text-left capitalize font-medium truncate text-ellipsis group-hover:text-M-primary-color w-16">{user ? user.name : "Loading..."}</span>
            {dropdownOpen ? (
              <HiChevronUp className="group-hover:text-M-primary-color" size={18} />
            ) : (
              <HiChevronDown className="group-hover:text-M-primary-color" size={18} />
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute top-16 right-0 mt-2 w-[100%] bg-white rounded-[5px] border border-[#e7e9eb] shadow-md p-1 overflow-hidden z-50">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 transition-all rounded-[5px] text-[14px]"
              >
                <FaUserCircle /> Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-200 transition-all rounded-[5px] text-[14px]"
              >
                <FaCog /> Settings
              </Link>
              <button
                onClick={() => alert("Logging out...")}
                className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-400 hover:bg-red-100 hover:text-red-600 transition-all rounded-[5px] text-[14px]"
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
