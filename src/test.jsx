import React from 'react';

const test = () => {
    return (
        <div>
                    {/* Main Menu Section */}
        <h4
          className={`pb-2 border-b border-[#2a2d3b] text-red-500 ${
            isSidebarOpen ? "" : "text-center hidden"
          }`}
        >
          Main Menu
        </h4>
        <ul className="flex flex-col font-jost">
          {mainMenu.map((menu, i) => {
            const isActive = activeMainMenu === i;

            return (
              <li key={i} className="relative">
                {/* If it's a direct link, wrap it in NavLink */}
                {!menu.isSubmenu ? (
                  <NavLink
                    to={menu.link}
                    className={`flex items-center text-base font-medium py-4 rounded-md cursor-pointer transition-all duration-300 ${
                      isActive ? "text-red-500" : "text-white"
                    } ${isSidebarOpen ? "" : "justify-center"}`}
                  >
                    {React.createElement(menu.icon, { size: 18 })}

                    {/* Show text only if sidebar is expanded */}
                    {isSidebarOpen && <span className="ml-3">{menu.name}</span>}
                  </NavLink>
                ) : (
                  /* If it has a submenu, clicking should toggle the submenu */
                  <div
                    className={`flex items-center text-base font-medium py-4 rounded-md cursor-pointer transition-all duration-300 ${
                      isActive ? "text-red-500" : "text-white"
                    } ${isSidebarOpen ? "" : "justify-center"}`}
                    onClick={() => toggleMenu(i, "main")}
                  >
                    {React.createElement(menu.icon, { size: 18 })}

                    {/* Show text only if sidebar is expanded */}
                    {isSidebarOpen && <span className="ml-3">{menu.name}</span>}

                    {/* Dropdown Indicator (Only When Sidebar is Expanded) */}
                    {isSidebarOpen && (
                      <div className="ml-auto transition-transform duration-300">
                        {expandedMainMenu === i ? (
                          <HiChevronDown className="w-6 h-6" />
                        ) : (
                          <HiChevronRight className="w-6 h-6" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Floating Submenu: Appears Next to Sidebar When Collapsed */}
                {menu.isSubmenu && expandedMainMenu === i && !isSidebarOpen && (
                  <ul className="absolute left-full top-0 ml-2 w-48 bg-white text-black shadow-lg rounded-md z-50">
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        <NavLink
                          to={submenu.link}
                          className="block text-gray-700 text-base py-2 px-4 transition-all duration-300 hover:bg-gray-200"
                        >
                          {submenu.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Normal Submenu: Only Visible When Sidebar is Expanded */}
                {menu.isSubmenu && isSidebarOpen && (
                  <ul
                    className={`transition-all duration-500 overflow-hidden ${
                      expandedMainMenu === i
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } ml-6 border-l border-gray-500 pl-4`}
                  >
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        <NavLink
                          to={submenu.link}
                          className="block text-gray-400 text-base py-2 transition-all duration-300 hover:text-white"
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
        <h4
          className={`pb-2 mt-6 border-b border-[#2a2d3b] text-red-500 ${
            isSidebarOpen ? "" : "text-center hidden"
          }`}
        >
          CMS & Blogs
        </h4>
        <ul className="flex flex-col font-jost">
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
                        location.pathname === menu.link
                          ? "text-red-500"
                          : "text-white"
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
                      expandedCmsMenu === i
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } ml-6 border-l border-gray-500 pl-4`}
                  >
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        {/* Submenu Item */}
                        <NavLink
                          to={submenu.link}
                          className={`block text-gray-400 text-base py-2 transition-all duration-300 hover:text-white ${
                            location.pathname === submenu.link
                              ? "text-white"
                              : ""
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
        <h4
          className={`pb-2 mt-6 border-b border-[#2a2d3b] text-red-500 ${
            isSidebarOpen ? "" : "text-center hidden"
          }`}
        >
          Settings & Config
        </h4>
        <ul className="flex flex-col font-jost">
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
                        location.pathname === menu.link
                          ? "text-red-500"
                          : "text-white"
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
                      {menu.isSubmenu &&
                        (expandedSettingsMenu === i ? (
                          <HiChevronDown className="w-6 h-6" />
                        ) : (
                          <HiChevronRight className="w-6 h-6" />
                        ))}
                    </div>
                  )}
                </div>

                {/* Submenu Items (if needed) */}
                {menu.isSubmenu && isSidebarOpen && (
                  <ul
                    className={`transition-all duration-500 overflow-hidden ${
                      expandedSettingsMenu === i
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } ml-6 border-l border-gray-500 pl-4`}
                  >
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        <NavLink
                          to={submenu.link}
                          className={`block text-gray-400 text-base py-2 transition-all duration-300 hover:text-white ${
                            location.pathname === submenu.link
                              ? "text-white"
                              : ""
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
        <h4
          className={`pb-2 mt-6 border-b border-[#2a2d3b] text-red-500 ${
            isSidebarOpen ? "" : "text-center hidden"
          }`}
        >
          Others
        </h4>
        <ul className="flex flex-col font-jost">
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
                        location.pathname === menu.link
                          ? "text-red-500"
                          : "text-white"
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
                      expandedOtherMenu === i
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    } ml-6 border-l border-gray-500 pl-4`}
                  >
                    {menu.submenus?.map((submenu, j) => (
                      <li key={j}>
                        {/* Submenu Item */}
                        <NavLink
                          to={submenu.link}
                          className={`block text-gray-400 text-base py-2 transition-all duration-300 hover:text-white ${
                            location.pathname === submenu.link
                              ? "text-white"
                              : ""
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
    );
};

export default test;