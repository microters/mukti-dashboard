import React, { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import axios from "axios";

// 🔹 Reusable Image Upload Component
const ImageUpload = ({ label, file, setFile }) => {
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const removeImage = () => {
    setFile(null);
  };

  const imageSrc =
    typeof file === "string"
      ? `http://localhost:5000${file.startsWith("/") ? file : `/${file}`}`
      : file
      ? URL.createObjectURL(file)
      : null;

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
      {imageSrc && (
        <div className="mt-4 relative">
          <img
            src={imageSrc}
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/about");
        const data = res.data?.data?.translations?.[language]; // ✅ ঠিক করলাম
  
        if (data) {
          setHeroImage(data.heroImage || null);
          setCallbackImage(data.callbackImage || null);
          setWhoWeAre({
            title: data.whoWeAre?.title || "",
            subtitle: data.whoWeAre?.subtitle || "",
            tabs: data.whoWeAre?.tabs || [{ title: "", description: "", image: null }],
          });
        }
      } catch (error) {
        console.error("Error loading data", error);
      }
    };
    fetchData();
  }, [language]);
  

  const handleWhoWeAreChange = (e) => {
    setWhoWeAre({ ...whoWeAre, [e.target.name]: e.target.value });
  };

  const handleTabChange = (index, field, value) => {
    const updatedTabs = [...whoWeAre.tabs];
    updatedTabs[index][field] = value;
    setWhoWeAre({ ...whoWeAre, tabs: updatedTabs });
  };

  const handleTabImageUpload = (index, file) => {
    const updatedTabs = [...whoWeAre.tabs];
    updatedTabs[index].image = file;
    setWhoWeAre({ ...whoWeAre, tabs: updatedTabs });
  };

  const removeTab = (index) => {
    const updatedTabs = whoWeAre.tabs.filter((_, i) => i !== index);
    setWhoWeAre({ ...whoWeAre, tabs: updatedTabs });
  };

  const addTab = () => {
    setWhoWeAre({
      ...whoWeAre,
      tabs: [...whoWeAre.tabs, { title: "", description: "", image: null }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("language", language);
    formData.append("title", whoWeAre.title);
    formData.append("subtitle", whoWeAre.subtitle);
    if (heroImage instanceof File) formData.append("heroImage", heroImage);
    if (callbackImage instanceof File) formData.append("callbackImage", callbackImage);

    const tabData = whoWeAre.tabs.map((tab) => ({
      title: tab.title,
      description: tab.description,
      image: null,
    }));
    formData.append("tabs", JSON.stringify(tabData));

    whoWeAre.tabs.forEach((tab) => {
      if (tab.image instanceof File) {
        formData.append("tabs", tab.image);
      }
    });

    try {
      await axios.post("http://localhost:5000/api/about", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ About Page Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage About Page</h1>

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
        <fieldset className="border p-6 rounded-md bg-white">
          <legend className="text-lg font-semibold">Hero Section</legend>
          <ImageUpload label="Upload Background Image" file={heroImage} setFile={setHeroImage} />
        </fieldset>

        <fieldset className="border p-6 rounded-md bg-white">
          <legend className="text-lg font-semibold">Request a Callback Section</legend>
          <ImageUpload label="Upload Callback Image" file={callbackImage} setFile={setCallbackImage} />
        </fieldset>

        <fieldset className="border p-6 rounded-md bg-white">
          <legend className="text-lg font-semibold">Who We Are</legend>

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
              <ImageUpload
                label={`Upload Tab ${index + 1} Image`}
                file={tab.image}
                setFile={(file) => handleTabImageUpload(index, file)}
              />
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
          disabled={loading}
          className="px-6 py-3 rounded-md shadow-lg text-white flex items-center justify-center bg-blue-600 hover:bg-blue-700 transition duration-300 text-lg font-medium"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default AboutPage;
