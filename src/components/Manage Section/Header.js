import React, { useState } from "react";
import { FaTrash, FaPlus, FaUpload, FaEdit } from "react-icons/fa";

const ImageUpload = ({ label, file, setFile }) => {
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const removeImage = () => {
    setFile(null);
  };

  return (
    <div className="flex flex-col items-start bg-white p-4 rounded-md border">
      <label className="text-gray-700 font-medium mb-2">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        id={`upload-${label}`}
      />
      <label
        htmlFor={`upload-${label}`}
        className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
      >
        <FaUpload /> Upload Image
      </label>
      {file && (
        <div className="mt-4 relative">
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded"
            className="border rounded-md w-40 h-32 object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
          >
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
};

const Header = () => {
    const [language, setLanguage] = useState("en");
    // State for the top header
    const [topHeader, setTopHeader] = useState({
      logo: null,
      contactIcon: null,
      phone: ""
    });
  
    // Main header menus
    const [mainMenus, setMainMenus] = useState([
      {
        title: "",
        link: "",
        openInNewTab: false,
        order: 1,
        parent: "",
        status: "active",
        buttonTitle: ""
      },
    ]);
  
    // *** New state for storing the submitted menus *** //
    const [submittedMenus, setSubmittedMenus] = useState([]);
  
    // Handler for updating a single menu item
    const handleMenuChange = (index, field, value) => {
      const updatedMenus = [...mainMenus];
      updatedMenus[index][field] = value;
      setMainMenus(updatedMenus);
    };
  
    // Add a new menu item
    const addMenu = () => {
      setMainMenus([
        ...mainMenus,
        {
          title: "",
          link: "",
          openInNewTab: false,
          order: mainMenus.length + 1,
          parent: "",
          status: "active",
          buttonTitle: ""
        },
      ]);
    };
  
    // Remove a menu item (from the form)
    const removeMenu = (index) => {
      const updatedMenus = mainMenus.filter((_, i) => i !== index);
      setMainMenus(updatedMenus);
    };
  
    // ** Delete from the submitted menus table **
    const handleDeleteSubmitted = (index) => {
      const updated = submittedMenus.filter((_, i) => i !== index);
      setSubmittedMenus(updated);
    };
  
    // ** Example "Edit" from the table to re-inject into the form **
    const handleEditSubmitted = (index) => {
      const menuToEdit = submittedMenus[index];
      setMainMenus([menuToEdit]); // or push it into mainMenus, or do something more advanced
    };
  
    // Submit handler
    const handleSubmit = (e) => {
      e.preventDefault();
  
      // Gather all data for the header
      const headerData = {
        topHeader,
        mainMenus,
      };
  
      console.log("Header data submitted:", headerData);
  
      // After logging or sending to server, save the current mainMenus for display
      setSubmittedMenus(mainMenus);
    };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Header</h1>
       {/* Language Selection */}
       <div className="mb-6">
        <label className="block text-gray-700 font-medium">
          Select Language:
          <select
            className="ml-2 p-2 border rounded focus:ring-blue-500 text-black"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="bn">Bangla</option>
          </select>
        </label>
      </div>
      <form onSubmit={handleSubmit}>
      {/* TOP HEADER SECTION */}
      <fieldset className="border p-6 rounded-md bg-white text-black mb-6">
        <legend className="text-lg font-semibold">Top Header</legend>

        {/* Logo */}
        <div className="mt-4">
          <ImageUpload
            label="Upload Logo"
            file={topHeader.logo}
            setFile={(file) => setTopHeader({ ...topHeader, logo: file })}
          />
        </div>

        {/* Contact Icon */}
        <div className="mt-4">
          <ImageUpload
            label="Upload Contact Icon"
            file={topHeader.contactIcon}
            setFile={(file) => setTopHeader({ ...topHeader, contactIcon: file })}
          />
        </div>

        {/* Phone Number */}
        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
          <input
            type="tel"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={topHeader.phone}
            onChange={(e) => setTopHeader({ ...topHeader, phone: e.target.value })}
            placeholder="Enter phone number"
          />
        </div>

        {/* Render contact icon & phone in the same link if phone is present */}
        {topHeader.phone && (
          <div className="mt-4">
            <a href={`tel:${topHeader.phone}`} className="flex items-center text-blue-500 gap-2">
              {topHeader.contactIcon && (
                <img
                  src={URL.createObjectURL(topHeader.contactIcon)}
                  alt="Contact Icon"
                  className="w-6 h-6 object-cover border rounded-md"
                />
              )}
              <span>{topHeader.phone}</span>
            </a>
          </div>
        )}
      </fieldset>

       {/* MAIN HEADER MENUS */}
       <fieldset className="border p-6 rounded-md bg-white text-black">
          <legend className="text-lg font-semibold">Main Header Menus</legend>
          {mainMenus.map((menu, index) => (
            <div key={index} className="mt-4 p-4 border rounded-md bg-gray-50">
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Menu Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={menu.title}
                    onChange={(e) =>
                      handleMenuChange(index, "title", e.target.value)
                    }
                    placeholder="Menu Title"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Menu Link
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={menu.link}
                    onChange={(e) =>
                      handleMenuChange(index, "link", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex gap-1">
                    <input
                      type="checkbox"
                      checked={menu.openInNewTab}
                      onChange={(e) =>
                        handleMenuChange(index, "openInNewTab", e.target.checked)
                      }
                    />
                    <label className="block text-gray-700 font-medium">
                      Open in New Tab?
                    </label>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Menu Order
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={menu.order}
                    onChange={(e) =>
                      handleMenuChange(
                        index,
                        "order",
                        parseInt(e.target.value) || 1
                      )
                    }
                    placeholder="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Parent Menu
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={menu.parent}
                    onChange={(e) =>
                      handleMenuChange(index, "parent", e.target.value)
                    }
                  >
                    <option value="">No Parent</option>
                    {mainMenus.map((m, i) => {
                      if (i !== index) {
                        return (
                          <option key={i} value={m.title}>
                            {m.title || `Menu ${i + 1}`}
                          </option>
                        );
                      }
                      return null;
                    })}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={menu.status}
                    onChange={(e) =>
                      handleMenuChange(index, "status", e.target.value)
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Button Title and Button Display */}
              <div className="mt-4">
                <label className="block text-gray-700 font-medium">
                  Button Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={menu.buttonTitle}
                  onChange={(e) =>
                    handleMenuChange(index, "buttonTitle", e.target.value)
                  }
                  placeholder="Button Title"
                />
              </div>

              <button
                type="button"
                onClick={() => removeMenu(index)}
                className="mt-2 text-red-500 flex items-center gap-1"
              >
                <FaTrash /> Remove Menu
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMenu}
            className="mt-4 text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus /> Add Menu
          </button>
        </fieldset>

        <button
          type="submit"
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Save Changes
        </button>
      </form>
    {/* ==== TABLE OF SUBMITTED MENUS ==== */}
    {submittedMenus.length > 0 && (
        <div className="mt-8 bg-white p-6 rounded-md text-black shadow-md">
          <h2 className="text-xl font-bold mb-4">Submitted Menus</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 text-gray-600 uppercase tracking-wider text-sm">
                    Title
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-gray-600 uppercase tracking-wider text-sm">
                    Link
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-gray-600 uppercase tracking-wider text-sm">
                    Order
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-gray-600 uppercase tracking-wider text-sm">
                    Status
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 text-gray-600 uppercase tracking-wider text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {submittedMenus.map((menu, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 ">{menu.title}</td>
                    <td className="py-3 px-4 ">{menu.link}</td>
                    <td className="py-3 px-4 ">{menu.order}</td>
                    <td className="py-3 px-4 ">{menu.status}</td>
                    <td className="py-3 px-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditSubmitted(i)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubmitted(i)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
  );
};

export default Header;
