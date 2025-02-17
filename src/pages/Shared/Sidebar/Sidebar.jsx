import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  HiChevronDown,
  HiOutlineBookOpen,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineTrash,
  HiLogout,
} from "react-icons/hi";
import { FaHome, FaUserMd, FaUserInjured, FaCalendarCheck, FaCog, FaEnvelope, FaTools, FaTag } from "react-icons/fa";
import logo from "../../../assets/logo/MH-icon.png"; 

const Sidebar = () => {
  const [expandedMainMenu, setExpandedMainMenu] = useState(null);
  const [expandedCmsMenu, setExpandedCmsMenu] = useState(null);
  const [expandedSettingsMenu, setExpandedSettingsMenu] = useState(null);
  const [expandedOtherMenu, setExpandedOtherMenu] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeMainMenu, setActiveMainMenu] = useState(null);  
  const [activeCmsMenu, setActiveCmsMenu] = useState(null); 
  const [activeSettingsMenu, setActiveSettingsMenu] = useState(null);
  const [activeOtherMenu, setActiveOtherMenu] = useState(null);
  const location = useLocation();

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

  // Define the sections and submenus
  const mainMenu = [
    {
      name: "Dashboard",
      icon: FaHome,
      link: "/dashboard",
      isSubmenu: false,
    },
    {
      name: "Manage Doctors",
      icon: FaUserMd,
      link: "/manage-doctors",
      isSubmenu: true,
      submenus: [
        { name: "All Doctors", link: "/all-doctors" },
        { name: "Add New Doctor", link: "/add-doctor" },
        { name: "Add Department", link: "/add-department" },
        { name: "All Department", link: "/all-department" },
       
      ],
    },
    {
      name: "Manage Patients",
      icon: FaUserInjured,
      link: "/manage-patients",
      isSubmenu: true,
      submenus: [
        { name: "All Patients", link: "/all-patients" },
        { name: "Add New Patient", link: "/add-patient" },
      ],
    },
    {
      name: "Manage Appointments",
      icon: FaCalendarCheck,
      link: "/manage-appointments",
      isSubmenu: true,
      submenus: [
        { name: "All Appointments", link: "/all-appointments" },
        { name: "Upcoming Appointments", link: "/upcoming-appointments" },
        { name: "Today's Appointments", link: "/todays-appointments" },
        { name: "Add New Appointment", link: "/add-appointment" },
      ],
    },
  ];

  const cmsBlogs = [
    {
      name: "Manage Blogs",
      icon: FaUserMd,
      link: "/manage-blogs",
      isSubmenu: true,
      submenus: [
        { name: "All Blogs", link: "/all-blogs" },
        { name: "Add New Blog", link: "/add-blog" },
        { name: "Category List", link: "/category-list" },
      ],
    },
    {
      name: "Manage Pages",
      icon: FaUserInjured,
      link: "/manage-patients",
      isSubmenu: true,
      submenus: [
        { name: "All Pages", link: "/all-patients" },
        { name: "Add New Page", link: "/add-patient" },
      ],
    },
    {
      name: "Manage Sections",
      icon: FaCalendarCheck,
      link: "/manage-appointments",
      isSubmenu: true,
      submenus: [
        { name: "Homepage Section", link: "/all-appointments" },
        { name: "About us", link: "/upcoming-appointments" },
        { name: "Contact Us", link: "/todays-appointments" },
      ],
    },
    {
      name: "Website Setup",
      icon: HiOutlineBookOpen,
      isSubmenu: true,
      submenus: [
        { name: "Cookie Consent", link: "/cookie-consent" },
        { name: "Error Page Message", link: "/error-page-message" },
        { name: "Login Page", link: "/login-page" },
        { name: "Admin Page", link: "/admin-page" },
        { name: "Menu Management", link: "/menu-management" },
        { name: "Footer Management", link: "/footer-management" },
      ],
    },
  ];
  
  const settingsConfig = [
    {
      name: "Settings",
      icon: FaTools,
      isSubmenu: true,
      submenus: [
        { name: "Site Name", link: "/site-name" },
        { name: "Logo & Favicon", link: "/logo-favicon" },
      ],
    },
    {
      name: "Email Configuration",
      icon: FaEnvelope,
      isSubmenu: true,
      submenus: [
        { name: "Email Config", link: "/email-config" },
        { name: "Email Template", link: "/email-template" },
      ],
    },
    {
      name: "Promo Code",
      icon: FaTag,
      link: "/promo-code",
      isSubmenu: false,
    },
  ];

  const others = [
    {
      name: "Cache Clear",
      icon: HiOutlineTrash,
      link: "/cache-clear",
    },
    {
      name: "Logout",
      icon: HiLogout,
      link: "/logout",
    },
  ];

  // Toggle expanded state for each section
  const toggleMenu = (index, section) => {
    if (section === "main") {
      setExpandedMainMenu(expandedMainMenu === index ? null : index);
      setActiveMainMenu(expandedMainMenu === index ? null : index);
    } else if (section === "cms") {
      setExpandedCmsMenu(expandedCmsMenu === index ? null : index);
      setActiveCmsMenu(expandedCmsMenu === index ? null : index);
    } else if (section === "settings") {
      setExpandedSettingsMenu(expandedSettingsMenu === index ? null : index);
      setActiveSettingsMenu(expandedSettingsMenu === index ? null : index);
    } else if (section === "others") {
      setExpandedOtherMenu(expandedOtherMenu === index ? null : index);
      setActiveOtherMenu(expandedOtherMenu === index ? null : index);
    }
  };

  return (
    <div className={`h-full bg-gray-900 text-white min-h-screen transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-28"}`}>
      {/* Header Section */}
      <div className="relative">
      <div className="gap-2 bg-gray-900 px-8 py-4 border-b border-[#2a2d3b] flex">
      {/* Sidebar Profile Section */}
      <Link to="/profile" title="User Profile">
        <div className="flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="rounded-full ring ring-white ring-offset-base-100 w-14 duration-300 mx-auto">
              <img src={logo} alt="User Profile" title="User Profile" className="rounded-full" />
           </div>
          ) : (
            <div className="rounded-full ring ring-white ring-offset-base-100 w-14 duration-300 mx-auto">
              <img src={logo} alt="User Profile" title="User Profile" className="rounded-full" />
            </div>
          )}
        </div>
      </Link>
      </div>
     
        {/* Toggle Button with Conditional Border Radius */}
        <span
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={`hidden lg:block bg-orange-500 text-white px-1 py-4 transition-all duration-300 absolute top-1/2 transform translate-y-[-50%] 
            ${isSidebarOpen ? "rounded-l-[10px] left-[262px]" : "rounded-r-[10px] left-full"}`}
        >
          {isSidebarOpen ? <HiChevronLeft size={18} /> : <HiChevronRight size={18} />}
        </span>
      </div>

      {/* Sidebar Menu */}
      <div className="menu-bar hide-scrollbar mt-6 px-8 h-[calc(100vh-164px)] overflow-y-auto">
        {/* Main Menu Section */}
        <h4 className={`pb-2 border-b border-[#2a2d3b] text-red-500 ${isSidebarOpen ? "" : "text-center"}`}>Main Menu</h4>
        <ul className="flex flex-col">
          {mainMenu.map((menu, i) => {
            const isActive = activeMainMenu === i;
            return (
              <li key={i}>
                {/* Main Menu Item */}
                <div
                  className={`flex items-center text-base font-medium py-4 rounded-md cursor-pointer transition-all duration-300 ${
                    isActive ? "text-red-500" : "text-white"
                  } ${isSidebarOpen ? "" : "justify-center"}`}
                  onClick={() => {
                    if (menu.isSubmenu) {
                      toggleMenu(i, "main");
                    }
                  }}
                >
                  <div>{React.createElement(menu.icon, { size: 16 })}</div>

                  {isSidebarOpen && !menu.isSubmenu && (
                    <NavLink
                      to={menu.link}
                      className={`ml-3 text-base ${
                        location.pathname === menu.link ? "text-red-500" : "text-white"
                      }`}
                    >
                      {menu.name}
                    </NavLink>
                  )}

                  {isSidebarOpen && menu.isSubmenu && (
                    <h2 className="ml-3 text-base">{menu.name}</h2>
                  )}

                  {/* Show submenu indicator if the menu has submenus */}
                  {isSidebarOpen && menu.isSubmenu && (
                    <div className="ml-auto transition-transform duration-300">
                      {expandedMainMenu === i ? (
                        <HiChevronDown className="w-6 h-6" />
                      ) : (
                        <HiChevronRight className="w-6 h-6" />
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu Items */}
                {menu.isSubmenu && isSidebarOpen && (
                  <ul
                    className={`transition-all duration-500 overflow-hidden ${
                      expandedMainMenu === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } ml-6 border-l border-gray-500 pl-4`}
                  >
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        {/* Submenu Item */}
                        <NavLink
                          to={submenu.link}
                          className={`block text-gray-400 text-base py-2 transition-all duration-300 hover:text-white ${
                            location.pathname === submenu.link ? "text-white" : ""
                          }`}
                        >
                          {submenu.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        {/* CMS & Blogs Section */}
        <h4 className={`pb-2 mt-6 border-b border-[#2a2d3b] text-red-500 ${isSidebarOpen ? "" : "text-center"}`}>CMS & Blogs</h4>
        <ul className="flex flex-col">
          {cmsBlogs.map((menu, i) => {
            const isActive = activeCmsMenu === i;

            return (
              <li key={i}>
                {/* Main Menu Item */}
                <div
                  className={`flex items-center text-base font-medium py-4 rounded-md cursor-pointer transition-all duration-300 ${
                    isActive ? "text-red-500" : "text-white"
                  } ${isSidebarOpen ? "" : "justify-center"}`}
                  onClick={() => {
                    if (menu.isSubmenu) {
                      toggleMenu(i, "cms");
                    }
                  }}
                >
                  <div>{React.createElement(menu.icon, { size: 16 })}</div>
                  {isSidebarOpen && !menu.isSubmenu && (
                    <NavLink
                      to={menu.link}
                      className={`ml-3 text-base ${
                        location.pathname === menu.link ? "text-red-500" : "text-white"
                      }`}
                    >
                      {menu.name}
                    </NavLink>
                  )}

                  {/* If the menu has a submenu, display it as a non-linkable h2 */}
                  {isSidebarOpen && menu.isSubmenu && (
                    <h2 className={"ml-3 text-base"}>{menu.name}</h2>
                  )}

                  {/* Show submenu indicator if the menu has submenus */}
                  {isSidebarOpen && menu.isSubmenu && (
                    <div className="ml-auto transition-transform duration-300">
                      {expandedCmsMenu === i ? (
                        <HiChevronDown className="w-6 h-6" />
                      ) : (
                        <HiChevronRight className="w-6 h-6" />
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu Items */}
                {menu.isSubmenu && isSidebarOpen && (
                  <ul
                    className={`transition-all duration-500 overflow-hidden ${
                      expandedCmsMenu === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } ml-6 border-l border-gray-500 pl-4`}
                  >
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        {/* Submenu Item */}
                        <NavLink
                          to={submenu.link}
                          className={`block text-gray-400 text-base py-2 transition-all duration-300 hover:text-white ${
                            location.pathname === submenu.link ? "text-white" : ""
                          }`}
                        >
                          {submenu.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
       </ul>
        {/* Settings & Config Section */}
        <h4 className={`pb-2 mt-6 border-b border-[#2a2d3b] text-red-500 ${isSidebarOpen ? "" : "text-center"}`}>Settings & Config</h4>
        <ul className="flex flex-col">
          {settingsConfig.map((menu, i) => {
            const isActive = activeSettingsMenu === i;

            return (
              <li key={i}>
                {/* Main Menu Item */}
                <div
                  className={`flex items-center text-base font-medium py-4 rounded-md cursor-pointer transition-all duration-300 ${
                    isActive ? "text-red-500" : "text-white"
                  } ${isSidebarOpen ? "" : "justify-center"}`}
                  onClick={() => toggleMenu(i, "settings")}
                >
                  <div>{React.createElement(menu.icon, { size: 16 })}</div>

                  {/* If the menu has no submenu, make it a clickable NavLink */}
                  {isSidebarOpen && !menu.isSubmenu && (
                    <NavLink
                      to={menu.link}
                      className={`ml-3 text-base ${
                        location.pathname === menu.link ? "text-red-500" : "text-white"
                      }`}
                    >
                      {menu.name}
                    </NavLink>
                  )}

                  {/* If the menu has a submenu, display it as a non-linkable h2 */}
                  {isSidebarOpen && menu.isSubmenu && (
                    <h2 className="ml-3 text-base">{menu.name}</h2>
                  )}

                  {isSidebarOpen && (
                    <div className="ml-auto transition-transform duration-300">
                      {menu.isSubmenu && (
                        expandedSettingsMenu === i ? (
                          <HiChevronDown className="w-6 h-6" />
                        ) : (
                          <HiChevronRight className="w-6 h-6" />
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* Submenu Items (if needed) */}
                {menu.isSubmenu && isSidebarOpen && (
                  <ul
                    className={`transition-all duration-500 overflow-hidden ${
                      expandedSettingsMenu === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } ml-6 border-l border-gray-500 pl-4`}
                  >
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        <NavLink
                          to={submenu.link}
                          className={`block text-gray-400 text-base py-2 transition-all duration-300 hover:text-white ${
                            location.pathname === submenu.link ? "text-white" : ""
                          }`}
                        >
                          {submenu.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
       {/* Others Section */}
      <h4 className={`pb-2 mt-6 border-b border-[#2a2d3b] text-red-500 ${isSidebarOpen ? "" : "text-center"}`}>Others</h4>
      <ul className="flex flex-col">
          {others.map((menu, i) => {
            const isActive = activeOtherMenu === i;

            return (
              <li key={i}>
                {/* Main Menu Item */}
                <div
                  className={`flex items-center text-base font-medium py-4 rounded-md cursor-pointer transition-all duration-300 ${
                    isActive ? "text-red-500" : "text-white"
                  } ${isSidebarOpen ? "" : "justify-center"}`}
                  onClick={() => {
                    // Only toggle if the menu has a submenu
                    if (menu.isSubmenu) {
                      toggleMenu(i, "others");
                    }
                  }}
                >
                  <div>{React.createElement(menu.icon, { size: 16 })}</div>

                  {/* If the menu has no submenu, make it a clickable NavLink */}
                  {isSidebarOpen && !menu.isSubmenu && (
                    <NavLink
                      to={menu.link}
                      className={`ml-3 text-base ${
                        location.pathname === menu.link ? "text-red-500" : "text-white"
                      }`}
                    >
                      {menu.name}
                    </NavLink>
                  )}

                  {/* If the menu has a submenu, display it as a non-linkable h2 */}
                  {isSidebarOpen && menu.isSubmenu && (
                    <h2 className="ml-3 text-base">{menu.name}</h2>
                  )}
                </div>

                {/* Submenu Items (if needed) */}
                {menu.isSubmenu && isSidebarOpen && (
                  <ul
                    className={`transition-all duration-500 overflow-hidden ${
                      expandedOtherMenu === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } ml-6 border-l border-gray-500 pl-4`}
                  >
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        {/* Submenu Item */}
                        <NavLink
                          to={submenu.link}
                          className={`block text-gray-400 text-base py-2 transition-all duration-300 hover:text-white ${
                            location.pathname === submenu.link ? "text-white" : ""
                          }`}
                        >
                          {submenu.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
     </ul>
      </div>
    </div>
  );
};

export default Sidebar;