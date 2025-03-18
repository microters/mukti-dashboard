import React, { useState } from "react";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";

// 🔹 Reusable Image Upload Component
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

const AboutPage = () => {
  const [language, setLanguage] = useState("en");
  const [heroImage, setHeroImage] = useState(null);
  const [callbackImage, setCallbackImage] = useState(null);
  const [whoWeAre, setWhoWeAre] = useState({
    title: "",
    subtitle: "",
    tabs: [{ title: "", description: "", image: null }],
  });

  // Handle changes for "Who We Are" section
  const handleWhoWeAreChange = (e) => {
    setWhoWeAre({ ...whoWeAre, [e.target.name]: e.target.value });
  };

  // Handle tab content changes
  const handleTabChange = (index, field, value) => {
    const updatedTabs = [...whoWeAre.tabs];
    updatedTabs[index][field] = value;
    setWhoWeAre({ ...whoWeAre, tabs: updatedTabs });
  };

  // Handle tab image upload
  const handleTabImageUpload = (index, file) => {
    const updatedTabs = [...whoWeAre.tabs];
    updatedTabs[index].image = file;
    setWhoWeAre({ ...whoWeAre, tabs: updatedTabs });
  };

  // Remove tab
  const removeTab = (index) => {
    const updatedTabs = whoWeAre.tabs.filter((_, i) => i !== index);
    setWhoWeAre({ ...whoWeAre, tabs: updatedTabs });
  };

  // Add a new tab
  const addTab = () => {
    setWhoWeAre({
      ...whoWeAre,
      tabs: [...whoWeAre.tabs, { title: "", description: "", image: null }],
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Data:", {
      language,
      heroImage,
      callbackImage,
      whoWeAre,
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage About Page</h1>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium">
          Select Language:
          <select
            className="ml-2 p-2 border rounded focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section */}
        <fieldset className="border p-6 rounded-md bg-white">
          <legend className="text-lg font-semibold">Hero Section</legend>
          <ImageUpload label="Upload Background Image" file={heroImage} setFile={setHeroImage} />
        </fieldset>

        {/* Request a Callback Section */}
        <fieldset className="border p-6 rounded-md bg-white">
          <legend className="text-lg font-semibold">Request a Callback Section</legend>
          <ImageUpload label="Upload Callback Image" file={callbackImage} setFile={setCallbackImage} />
        </fieldset>

        {/* Who We Are Section */}
        <fieldset className="border p-6 rounded-md bg-white">
          <legend className="text-lg font-semibold">Who We Are</legend>

          {/* Title & Subtitle */}
          <input
            type="text"
            name="title"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={whoWeAre.title}
            onChange={handleWhoWeAreChange}
            placeholder="Enter section title"
          />
          <input
            type="text"
            name="subtitle"
            className="w-full px-4 py-2 border rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
            value={whoWeAre.subtitle}
            onChange={handleWhoWeAreChange}
            placeholder="Enter section subtitle"
          />

          {/* Tabs */}
          {whoWeAre.tabs.map((tab, index) => (
            <div key={index} className="border p-4 rounded mt-4 bg-gray-100">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">Tab {index + 1}</h4>
                {whoWeAre.tabs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTab(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 mt-2"
                value={tab.title}
                onChange={(e) => handleTabChange(index, "title", e.target.value)}
                placeholder="Enter tab title"
              />
              <textarea
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 mt-2"
                value={tab.description}
                onChange={(e) => handleTabChange(index, "description", e.target.value)}
                placeholder="Enter tab description"
              />

              {/* Image Upload */}
              <ImageUpload label={`Upload Tab ${index + 1} Image`} file={tab.image} setFile={(file) => handleTabImageUpload(index, file)} />
            </div>
          ))}

          <button
            type="button"
            onClick={addTab}
            className="mt-3 text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus /> Add More Tabs
          </button>
        </fieldset>

        <button
          type="submit"
          className="px-6 py-3 rounded-md shadow-lg text-white flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition duration-300 text-lg font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AboutPage;
