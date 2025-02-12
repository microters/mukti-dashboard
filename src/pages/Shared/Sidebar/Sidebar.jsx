import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  HiChevronDown,
  HiChevronUp,
  HiOutlineBookOpen,
  HiMenuAlt3,
  HiX,
} from "react-icons/hi";
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaCog, FaRegCircle, FaCircle } from "react-icons/fa";
import logo from "../../../assets/logo/MH-icon.png";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Function to handle window resize
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      name: "Manage Doctors",
      icon: FaUserMd,
      submenus: [
        { name: "All Doctors", link: "/all-doctors" },
        { name: "Add New Doctor", link: "/add-doctor" },
      ],
    },
    {
      name: "Manage Patients",
      icon: FaUserInjured,
      submenus: [
        { name: "All Patients", link: "/all-patients" },
        { name: "Add New Patient", link: "/add-patient" },
      ],
    },
    {
      name: "Manage Appointments",
      icon: FaCalendarCheck,
      submenus: [
        { name: "All Appointments", link: "/all-appointments" },
        { name: "Upcoming Appointments", link: "/upcoming-appointments" },
        { name: "Today's Appointments", link: "/todays-appointments" },
        { name: "Add New Appointment", link: "/add-appointment" },
      ],
    },
    {
      name: "CMS & Blogs",
      icon: HiOutlineBookOpen,
      submenus: [
        { name: "All Blogs", link: "/all-blogs" },
        { name: "Add New Blog", link: "/add-blog" },
        { name: "Category List", link: "/category-list" },
      ],
    },
    {
      name: "Settings & Config",
      icon: FaCog,
      submenus: [
        { name: "General Settings", link: "/settings" },
        { name: "Email Configuration", link: "/email-config" },
        { name: "Email Template", link: "/email-template" },
      ],
    },
  ];

  const toggleDropdown = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  return (
    <div
      className={`h-full bg-gray-900 text-white min-h-screen transition-all duration-300
        ${isSidebarOpen ? "w-64" : "w-16"}`}
    >
      {/* Sidebar Toggle Button */}
      <div className="py-3 justify-end lg:flex hidden">
        {isSidebarOpen ? (
          <HiX
            title="Close Sidebar"
            size={26}
            className="cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          />
        ) : (
          <HiMenuAlt3
            title="Open Sidebar"
            size={26}
            className="cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </div>

      {/* User Profile */}
      <Link to={`/profile`} title="User Profile" className="flex justify-center mt-6">
        <div
          className={`rounded-full ring ring-white ring-offset-base-100 ${isSidebarOpen ? "w-20" : "w-10"} duration-300`}
        >
          <img
            src={logo}
            alt="User Profile"
            title="User Profile"
            className="rounded-full"
          />
        </div>
      </Link>

      {/* User Info (Only Visible if Sidebar is Open) */}
      {isSidebarOpen && (
        <div className="text-center mt-4">
          <h4 className="text-lg font-semibold">Mukti Hospital</h4>
          <p className="text-xs text-gray-400">info@muktihospital.com</p>
        </div>
      )}

      {/* Sidebar Menu */}
      <div className="flex flex-col gap-3 mt-6 h-[calc(100vh-164px)] overflow-y-auto">
        {menuItems.map((menu, i) => {
          const isSubmenuActive = menu.submenus?.some((submenu) => location.pathname === submenu.link);

          return (
            <div key={i}>
              <div
                className={`flex items-center justify-center text-sm gap-3.5 font-medium p-2 w-full rounded-md cursor-pointer transition-all ${
                  isSubmenuActive || expanded === i ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
                onClick={() => toggleDropdown(i)}
              >
                <div>{React.createElement(menu.icon, { size: "20" })}</div>
                {isSidebarOpen && <h2>{menu.name}</h2>}
                {isSidebarOpen && (
                  <div className="ml-auto transition-transform duration-300">
                    {expanded === i ? <HiChevronUp /> : <HiChevronDown />}
                  </div>
                )}
              </div>

              {/* Submenu Items */}
              <div
                className={`transition-all duration-500 overflow-hidden ${
                  expanded === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {isSidebarOpen &&
                  menu.submenus.map((submenu, j) => (
                    <NavLink
                      key={j}
                      to={submenu.link}
                      className={`flex items-center gap-3 p-2 pl-6 rounded-md transition-colors duration-300`}
                    >
                      {location.pathname === submenu.link ? (
                        <FaCircle size={14} className="text-gray-400" />
                      ) : (
                        <FaRegCircle size={14} className="text-gray-400" />
                      )}
                      {submenu.name}
                    </NavLink>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
