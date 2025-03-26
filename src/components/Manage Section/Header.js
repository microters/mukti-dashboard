import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus, FaUpload, FaEdit } from "react-icons/fa";
import axios from "axios";

const API_URL = "https://api.muktihospital.com";
const API_KEY = 'caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079';

// Configure axios with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

const ImageUpload = ({ label, file, setFile, imageUrl }) => {
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
      {!file && imageUrl && (
        <div className="mt-4 relative">
          <img
            src={`${API_URL}${imageUrl}`}
            alt="Current"
            className="border rounded-md w-40 h-32 object-cover"
          />
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  
  // State for the header with translations including menus
  const [headerData, setHeaderData] = useState({
    logo: null,
    contactIcon: null,
    translations: {
      en: { 
        phone: "",
        menus: [
          {
            title: "",
            buttonTitle: "",
            link: "",
            openInNewTab: false,
            order: 1,
            parent: "",
            status: "active",
            isParent: true
          }
        ]
      },
      bn: {
        phone: "",
        menus: [
          {
            title: "",
            buttonTitle: "",
            link: "",
            openInNewTab: false,
            order: 1,
            parent: "",
            status: "active",
            isParent: true
          }
        ]
      }
    }
  });

  // Store for existing header data from API
  const [existingHeaderData, setExistingHeaderData] = useState(null);

  // Fetch header data on component mount
  useEffect(() => {
    fetchHeaderData();
  }, []);

  // Fetch header data from API
  const fetchHeaderData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/header');
      setExistingHeaderData(response.data);
      
      // Initialize form with existing data
      if (response.data) {
        setIsEditing(true);
        
        // Add isParent flag to existing menu items
        let translationsWithParentFlag = { ...response.data.translations };
        
        // Process each language
        Object.keys(translationsWithParentFlag).forEach(lang => {
          if (translationsWithParentFlag[lang].menus) {
            translationsWithParentFlag[lang].menus = translationsWithParentFlag[lang].menus.map(menu => ({
              ...menu,
              isParent: !menu.parent || menu.parent === ""
            }));
          }
        });
        
        // Create a new headerData object with the processed data
        setHeaderData({
          logo: null, // We store the file object for uploads
          contactIcon: null, // We store the file object for uploads
          translations: translationsWithParentFlag || {
            en: { 
              phone: "",
              menus: [
                {
                  title: "",
                  buttonTitle: "",
                  link: "",
                  openInNewTab: false,
                  order: 1,
                  parent: "",
                  status: "active",
                  isParent: true
                }
              ]
            },
            bn: {
              phone: "",
              menus: [
                {
                  title: "",
                  buttonTitle: "",
                  link: "",
                  openInNewTab: false,
                  order: 1,
                  parent: "",
                  status: "active",
                  isParent: true
                }
              ]
            }
          }
        });
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // Header doesn't exist yet, leave form in "add" mode
        setIsEditing(false);
      } else {
        setError("Failed to fetch header data. Please try again later.");
        console.error("Error fetching header:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for updating translations
  const handleTranslationChange = (lang, field, value) => {
    setHeaderData({
      ...headerData,
      translations: {
        ...headerData.translations,
        [lang]: {
          ...headerData.translations[lang],
          [field]: value
        }
      }
    });
  };

  // Handler for updating a single menu item
  const handleMenuChange = (lang, index, field, value) => {
    const updatedTranslations = { ...headerData.translations };
    const updatedMenus = [...updatedTranslations[lang].menus];
    
    updatedMenus[index] = {
      ...updatedMenus[index],
      [field]: value
    };
    
    // If parent field is changing, update isParent flag
    if (field === 'parent') {
      updatedMenus[index].isParent = !value || value === "";
    }
    
    updatedTranslations[lang] = {
      ...updatedTranslations[lang],
      menus: updatedMenus
    };
    
    setHeaderData({
      ...headerData,
      translations: updatedTranslations
    });
  };

  // Add a new menu item to the current language
  const addMenu = () => {
    const updatedTranslations = { ...headerData.translations };
    const currentMenus = [...updatedTranslations[language].menus];
    
    currentMenus.push({
      title: "",
      buttonTitle: "",
      link: "",
      openInNewTab: false,
      order: currentMenus.length + 1,
      parent: "",
      status: "active",
      isParent: true
    });
    
    updatedTranslations[language] = {
      ...updatedTranslations[language],
      menus: currentMenus
    };
    
    // Ensure the other language has the same number of menu items
    const otherLang = language === 'en' ? 'bn' : 'en';
    while (updatedTranslations[otherLang].menus.length < currentMenus.length) {
      updatedTranslations[otherLang].menus.push({
        title: "",
        buttonTitle: "",
        link: "",
        openInNewTab: false,
        order: updatedTranslations[otherLang].menus.length + 1,
        parent: "",
        status: "active",
        isParent: true
      });
    }
    
    setHeaderData({
      ...headerData,
      translations: updatedTranslations
    });
  };

  // Remove a menu item
  const removeMenu = (index) => {
    const updatedTranslations = { ...headerData.translations };
    
    // Get the menu title that's being removed (needed to update child references)
    const removedMenuTitle = updatedTranslations[language].menus[index].title;
    
    // Remove the menu item from all languages to keep them in sync
    Object.keys(updatedTranslations).forEach(lang => {
      // First, update any child menus that reference this menu as parent
      if (removedMenuTitle) {
        updatedTranslations[lang].menus = updatedTranslations[lang].menus.map(menu => {
          if (menu.parent === removedMenuTitle) {
            return {
              ...menu,
              parent: "",
              isParent: true
            };
          }
          return menu;
        });
      }
      
      // Then remove the menu
      updatedTranslations[lang].menus = updatedTranslations[lang].menus.filter((_, i) => i !== index);
      
      // Update the order of remaining menu items
      updatedTranslations[lang].menus = updatedTranslations[lang].menus.map((menu, i) => ({
        ...menu,
        order: i + 1
      }));
    });
    
    setHeaderData({
      ...headerData,
      translations: updatedTranslations
    });
  };

  // Submit handler - Create or Update header based on isEditing state
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create a clean copy of the headerData without UI-specific properties
      const cleanTranslations = {};
      
      Object.keys(headerData.translations).forEach(lang => {
        cleanTranslations[lang] = {
          ...headerData.translations[lang],
          menus: headerData.translations[lang].menus.map(menu => {
            // Exclude the isParent field which is just for UI
            const { isParent, ...cleanMenu } = menu;
            return cleanMenu;
          })
        };
      });
      
      // Create FormData object to handle file uploads
      const formData = new FormData();
      
      // Add translations (which now include menus)
      formData.append('data', JSON.stringify({ translations: cleanTranslations }));
      
      // Add files if they exist
      if (headerData.logo) {
        formData.append('logo', headerData.logo);
      }
      
      if (headerData.contactIcon) {
        formData.append('contactIcon', headerData.contactIcon);
      }
      
      // Use the appropriate API endpoint based on whether we're creating or updating
      let response;
      if (isEditing) {
        // Update existing header
        response = await axios.put(
          `${API_URL}/api/header`, 
          formData, 
          { 
            headers: { 
              'x-api-key': API_KEY,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        // Create new header
        response = await axios.post(
          `${API_URL}/api/header/add`, 
          formData, 
          { 
            headers: { 
              'x-api-key': API_KEY,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }
      
      // Update local state with the response
      setExistingHeaderData(response.data);
      setIsEditing(true);
      
      // Success notification or redirection could be added here
      alert(isEditing ? "Header updated successfully!" : "Header created successfully!");
      
    } catch (err) {
      console.error("Error saving header:", err);
      setError(err.response?.data?.error || "Failed to save header. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading header data...</div>;
  }

  // Get only parent menus for the dropdown
  const getParentMenus = (lang, currentIndex) => {
    return headerData.translations[lang]?.menus?.filter((menu, index) => 
      index !== currentIndex && menu.isParent && menu.title
    ) || [];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Header</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
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
              file={headerData.logo}
              setFile={(file) => setHeaderData({ ...headerData, logo: file })}
              imageUrl={existingHeaderData?.logo}
            />
          </div>

          {/* Contact Icon */}
          <div className="mt-4">
            <ImageUpload
              label="Upload Contact Icon"
              file={headerData.contactIcon}
              setFile={(file) => setHeaderData({ ...headerData, contactIcon: file })}
              imageUrl={existingHeaderData?.contactIcon}
            />
          </div>

          {/* Phone Number */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">Phone Number ({language})</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={headerData.translations[language]?.phone || ''}
              onChange={(e) => handleTranslationChange(language, 'phone', e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          {/* Render contact icon & phone in the same link if phone is present */}
          {headerData.translations[language]?.phone && (
            <div className="mt-4">
              <a href={`tel:${headerData.translations[language].phone}`} className="flex items-center text-blue-500 gap-2">
                {existingHeaderData?.contactIcon && (
                  <img
                    src={`${API_URL}${existingHeaderData.contactIcon}`}
                    alt="Contact Icon"
                    className="w-6 h-6 object-cover border rounded-md"
                  />
                )}
                {headerData.contactIcon && (
                  <img
                    src={URL.createObjectURL(headerData.contactIcon)}
                    alt="Contact Icon"
                    className="w-6 h-6 object-cover border rounded-md"
                  />
                )}
                <span>{headerData.translations[language].phone}</span>
              </a>
            </div>
          )}
        </fieldset>

        {/* MAIN HEADER MENUS */}
        <fieldset className="border p-6 rounded-md bg-white text-black">
          <legend className="text-lg font-semibold">Main Header Menus ({language})</legend>
          
          {headerData.translations[language]?.menus?.map((menu, index) => (
            <div key={index} className="mt-4 p-4 border rounded-md bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-blue-700">
                  {menu.isParent ? "Parent Menu" : "Child Menu"}
                </span>
                {menu.parent && (
                  <span className="text-sm text-gray-600">
                    Child of: {menu.parent}
                  </span>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Menu Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={menu.title || ""}
                    onChange={(e) =>
                      handleMenuChange(language, index, "title", e.target.value)
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
                    value={menu.link || ""}
                    onChange={(e) =>
                      handleMenuChange(language, index, "link", e.target.value)
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
                      checked={menu.openInNewTab || false}
                      onChange={(e) =>
                        handleMenuChange(language, index, "openInNewTab", e.target.checked)
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
                    value={menu.order || 1}
                    onChange={(e) =>
                      handleMenuChange(
                        language,
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
                    value={menu.parent || ""}
                    onChange={(e) =>
                      handleMenuChange(language, index, "parent", e.target.value)
                    }
                  >
                    <option value="">No Parent (This is a parent menu)</option>
                    {getParentMenus(language, index).map((parentMenu, i) => (
                      <option key={i} value={parentMenu.title}>
                        {parentMenu.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-700 font-medium">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={menu.status || "active"}
                    onChange={(e) =>
                      handleMenuChange(language, index, "status", e.target.value)
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Button Title */}
              <div className="mt-4">
                <label className="block text-gray-700 font-medium">
                  Button Title
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={menu.buttonTitle || ""}
                  onChange={(e) =>
                    handleMenuChange(language, index, "buttonTitle", e.target.value)
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
          disabled={isLoading}
          className={`mt-6 px-6 py-3 ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded-md shadow-lg transition duration-300 flex items-center gap-2`}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Header' : 'Create Header'}
        </button>
      </form>
    </div>
  );
};

export default Header;