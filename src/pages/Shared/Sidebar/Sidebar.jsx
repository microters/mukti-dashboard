import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HiOutlineBookOpen, HiOutlineTrash, HiLogout } from "react-icons/hi";
import {
  FaHome,
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaEnvelope,
  FaTools,
  FaTag,
} from "react-icons/fa";
import { RiArrowRightSLine } from "react-icons/ri";
import logo from "../../../assets/logo/MH-icon.png";
import whiteLogo from "../../../assets/logo/logo-white.png";

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [active, setActive] = useState(null);
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = useState({
    main: null,
    cms: null,
    settings: null,
    others: null,
  });

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
  const sidebarSections = [
    {
      title: "Main Menu",
      sectionKey: "main",
      menus: [
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
            { name: "Add New Review", link: "/add-reviews" },
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
      ],
    },
    {
      title: "CMS & Blogs",
      sectionKey: "cms",
      menus: [
        {
          name: "Manage Blogs",
          icon: FaUserMd,
          link: "/manage-blogs",
          isSubmenu: true,
          submenus: [
            { name: "All Blogs", link: "/all-blog" },
            { name: "Add New Blog", link: "/add-blog" },
            { name: "Add New Category", link: "/add-category" },
            { name: "All Category", link: "/all-category" },
          ],
        },
        {
          name: "Manage Pages",
          icon: FaUserInjured,
          link: "/manage-page",
          isSubmenu: true,
          submenus: [
            { name: "All Pages", link: "/all-page" },
            { name: "Add New Page", link: "/add-page" },
          ],
        },
        {
          name: "Manage Sections",
          icon: FaCalendarCheck,
          link: "/manage-appointments",
          isSubmenu: true,
          submenus: [
            { name: "Homepage Section", link: "/home-page" },
            { name: "About us", link: "/about-page" },
            { name: "Header", link: "/header" },
            { name: "Footer", link: "/footer" },
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
      ],
    },
    {
      title: "Settings & Config",
      sectionKey: "settings",
      menus: [
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
      ],
    },
    {
      title: "Others",
      sectionKey: "others",
      menus: [
        {
          name: "Cache Clear",
          icon: HiOutlineTrash,
          link: "/cache-clear",
          isSubmenu: false,
        },
        {
          name: "Logout",
          icon: HiLogout,
          link: "/logout",
          isSubmenu: false,
        },
      ],
    },
  ];

  // Toggle Submenu
  const toggleSubMenu = (index, sectionKey) => {
    setExpandedMenu((prev) => {
      const isAlreadyOpen = prev[sectionKey] === index;

      return {
        main: null,
        cms: null,
        settings: null,
        others: null,
        [sectionKey]: isAlreadyOpen ? null : index, // open or close current
      };
    });
  };

  return (
    <div
      className={`h-full bg-M-heading-color text-white min-h-screen transition-all duration-300 hover:w-72 group ${
        isSidebarOpen ? "w-72" : "w-16"
      }`}
    >
      {/* Header Section */}
      <div className="relative">
        <div
          className={`gap-2  py-[17px] border-b border-M-section-bg/10 flex ${
            isSidebarOpen ? "px-8" : "px-2 group-hover:px-8"
          }`}
        >
          {/* Profile Logo Area */}
          <NavLink to="/profile" title="User Profile">
            <div className="flex items-center justify-between">
              <div className="group mx-auto w-full flex items-center gap-3">
                {/* White Logo */}
                <img
                  src={whiteLogo}
                  alt="White Logo"
                  title="White Logo"
                  className={` duration-0 max-w-48
                    ${isSidebarOpen ? "w-48" : "hidden group-hover:block w-48"}
                  `}
                />

                {/* Round Logo */}
                <img
                  src={logo}
                  alt="Logo"
                  title="Logo"
                  className={` duration-0 rounded-full shrink-0 mx-auto
                    ${isSidebarOpen ? "hidden" : "w-9 group-hover:hidden"}
                  `}
                />
              </div>
            </div>
          </NavLink>
        </div>

        {/* Toggle Button with Conditional Border Radius */}
        <span
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className={`size-5 border-2 border-white rounded-full absolute right-3 top-1/2 -translate-y-1/2 hidden  ${
            isSidebarOpen
              ? "lg:flex items-center justify-center"
              : "hidden group-hover:lg:flex"
          }`}
        >
          <span
            className={`size-2 bg-white rounded-full ${
              isSidebarOpen ? "block" : "hidden"
            }`}
          ></span>
        </span>
      </div>

      {/* Sidebar Menu */}
      <div
        className={`menu-bar hide-scrollbar ${
          isSidebarOpen ? "px-8" : "px-2 group-hover:px-8"
        } h-[calc(100vh-80px)] overflow-y-auto`}
      >
        {sidebarSections.map((items, index) => {
          <p className="text-white" key={index}>
            {items.title}
          </p>;
        })}

        {sidebarSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4
              className={`pb-2 mt-6 border-b border-M-text-color/30 text-white text-sm ${
                isSidebarOpen
                  ? ""
                  : "text-center hidden group-hover:block group-hover:text-left text-nowrap"
              }`}
            >
              {section.title}
            </h4>
            <ul
              className={`flex flex-col font-inter mt-5 pl-3 ${
                isSidebarOpen ? "gap-2" : "gap-5 group-hover:gap-2"
              } `}
            >
              {section.menus.map((menuItem, menuIndex) => {
                const isExpanded =
                  expandedMenu[section.sectionKey] === menuIndex;

                return (
                  <React.Fragment key={`${section.sectionKey}-${menuIndex}`}>
                    {/* Menu Item */}
                    <li>
                      <div
                        className="flex items-center justify-between gap-2 cursor-pointer"
                        onClick={() =>
                          menuItem.isSubmenu &&
                          toggleSubMenu(menuIndex, section.sectionKey)
                        }
                      >
                        {menuItem.isSubmenu ? (
                          <span className="flex items-center gap-2 text-sm text-[#e2eeff]">
                            <menuItem.icon />{" "}
                            <span
                              className={`${
                                isSidebarOpen
                                  ? ""
                                  : "hidden group-hover:block text-nowrap"
                              } `}
                            >
                              {menuItem.name}
                            </span>
                          </span>
                        ) : (
                          <NavLink
                            to={menuItem.link}
                            className="flex items-center gap-2 text-sm text-[#e2eeff]"
                          >
                            <menuItem.icon />{" "}
                            <span
                              className={`${
                                isSidebarOpen
                                  ? ""
                                  : "hidden group-hover:block text-nowrap"
                              } `}
                            >
                              {menuItem.name}
                            </span>
                          </NavLink>
                        )}

                        {menuItem.isSubmenu && (
                          <RiArrowRightSLine
                            className={`transform transition-transform duration-300 ${
                              isExpanded ? "rotate-90" : ""
                            } ${
                              isSidebarOpen
                                ? ""
                                : "hidden group-hover:block text-nowrap"
                            }`}
                          />
                        )}
                      </div>
                    </li>

                    {/* Submenu Items */}
                    <ul
                      className={`transition-all duration-500 overflow-hidden pl-6 text-sm text-gray-400 ${
                        isExpanded
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      } ${isSidebarOpen ? "" : "hidden group-hover:block"}`}
                    >
                      {menuItem.submenus?.map((subMenuItem, subIndex) => (
                        <li
                          key={`${section.sectionKey}-submenu-${menuIndex}-${subIndex}`}
                          className="py-1"
                        >
                          <NavLink
                            to={subMenuItem.link}
                            // hrefLang={subMenuItem.link}
                            className="text-sm hover:text-white transition-all duration-300 relative pl-5 before:w-2 before:h-2 before:absolute before:bg-M-text-color before:rounded-full before:left-0 before:top-1/2 before:-translate-y-1/2 block hover:before:bg-white before:transition-all before:duration-300"
                          >
                            {subMenuItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
