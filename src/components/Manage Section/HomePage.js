import React, { useState, useEffect } from "react";
import axios from "axios";

const HomepageForm = () => {
  // Language Selection (default: English)
  const [language, setLanguage] = useState("en");

  // Homepage existence state
  const [homepageExists, setHomepageExists] = useState(false);

  // Text data for each section (for specific language)
  const [heroData, setHeroData] = useState({ prefix: "", title: "" });
  const [featuresData, setFeaturesData] = useState({
    subtitle: "",
    title: "",
    icon: "",
  });
  const [aboutData, setAboutData] = useState({
    title: "",
    subtitle: "",
    description: "",
    experience: "",
    serviceTitle: "",
    serviceIcon: "",
  });
  const [whyChooseData, setWhyChooseData] = useState({
    title: "",
    subtitle: "",
    description: "",
    serviceTitle: "",
    serviceDescription: "",
    serviceIcon: "",
  });
  const [downloadAppData, setDownloadAppData] = useState({
    title: "",
    subtitle: "",
    description: "",
  });
  const [appointmentProcessData, setAppointmentProcessData] = useState({
    icon: "",
    title: "",
  });
  const [appointmentData, setAppointmentData] = useState({}); // Only for file handling (not used in PUT)

  // File data (for POST requests)
  const [heroFile, setHeroFile] = useState(null);
  const [aboutFiles, setAboutFiles] = useState([]);
  const [appointmentFile, setAppointmentFile] = useState(null);
  const [downloadAppFile, setDownloadAppFile] = useState(null);
  const [whyChooseFile, setWhyChooseFile] = useState(null);

  // GET: Load homepage data
  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await axios.get("https://api.muktihospital.com/api/home");
        console.log(res.data);
        if (res.data) {
          setHomepageExists(true);
          const {
            heroSection,
            featuresSection,
            aboutSection,
            appointmentSection,
            whyChooseUsSection,
            downloadAppSection,
            appointmentProcess,
          } = res.data;

          // Set data based on selected language
          if (heroSection?.translations[language]) {
            setHeroData(heroSection.translations[language]);
          }
          if (featuresSection?.translations[language]) {
            setFeaturesData(featuresSection.translations[language]);
          }
          if (aboutSection?.translations[language]) {
            setAboutData(aboutSection.translations[language]);
          }
          if (appointmentSection?.translations[language]) {
            setAppointmentData(appointmentSection.translations[language]);
          }
          if (whyChooseUsSection?.translations[language]) {
            setWhyChooseData(whyChooseUsSection.translations[language]);
          }
          if (downloadAppSection?.translations[language]) {
            setDownloadAppData(downloadAppSection.translations[language]);
          }
          if (appointmentProcess?.translations[language]) {
            setAppointmentProcessData(
              appointmentProcess.translations[language]
            );
          }
        } else {
          setHomepageExists(false);
        }
      } catch (error) {
        console.error("Error fetching homepage:", error);
      }
    };

    fetchHomepage();
  }, [language]);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!homepageExists) {
      // POST: Create new homepage (default language: English)
      const formData = new FormData();
      // Data will be stored under "en" key by default
      formData.append(
        "heroSection",
        JSON.stringify({ ...heroData, backgroundImage: "" })
      );
      formData.append("featuresSection", JSON.stringify(featuresData));
      formData.append(
        "aboutSection",
        JSON.stringify({ ...aboutData, images: [] })
      );
      formData.append("appointmentSection", JSON.stringify(appointmentData));
      formData.append(
        "whyChooseUsSection",
        JSON.stringify({ ...whyChooseData, image: "" })
      );
      formData.append(
        "downloadAppSection",
        JSON.stringify({ ...downloadAppData, image: "" })
      );
      formData.append(
        "appointmentProcess",
        JSON.stringify(appointmentProcessData)
      );

      if (heroFile) formData.append("heroBackgroundImage", heroFile);
      if (aboutFiles.length > 0)
        aboutFiles.forEach((file) => formData.append("aboutImages", file));
      if (appointmentFile) formData.append("appointmentImage", appointmentFile);
      if (downloadAppFile) formData.append("downloadAppImage", downloadAppFile);
      if (whyChooseFile) formData.append("whyChooseUsImage", whyChooseFile);

      try {
        const res = await axios.post(
          "https://api.muktihospital.com/api/home",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(res.data);
        alert("Homepage created successfully!");
        setHomepageExists(true);
      } catch (err) {
        console.error("Error creating homepage:", err);
        alert("Error creating homepage");
      }
    } else {
      // PUT: Update - based on selected language (excluding images)
      const sections = [
        { name: "heroSection", data: heroData },
        { name: "featuresSection", data: featuresData },
        { name: "aboutSection", data: aboutData },
        { name: "appointmentSection", data: appointmentData },
        { name: "whyChooseUsSection", data: whyChooseData },
        { name: "downloadAppSection", data: downloadAppData },
        { name: "appointmentProcess", data: appointmentProcessData },
      ];

      try {
        await Promise.all(
          sections.map(({ name, data }) => {
            const updatedData = { ...data };
            delete updatedData.backgroundImage;
            delete updatedData.image;
            delete updatedData.images;
            return axios.put(`https://api.muktihospital.com/api/home/${name}`, {
              language,
              translations: updatedData,
            });
          })
        );
        alert("Homepage updated successfully!");
      } catch (err) {
        console.error("Error updating homepage:", err);
        alert("Error updating homepage");
      }
    }
  };

  const handleFileChange = (e, setState, maxFiles = 4) => {
    const files = Array.from(e.target.files);
    if (files.length + setState.length <= maxFiles) {
      setState((prevFiles) => [...prevFiles, ...files]);
    } else {
      alert(`You can only select up to ${maxFiles} files.`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Create / Update Homepage</h1>
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Select Language:
          <select
            className="ml-2 p-2 border rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </label>
      </div>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-8"
      >
        {/* Hero Section */}
        <fieldset className="border p-4 rounded bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">
            Hero Section
          </legend>

          {/* Prefix Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="prefix"
            >
              Prefix
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="prefix"
              placeholder="Enter prefix"
              value={heroData.prefix}
              onChange={(e) =>
                setHeroData({ ...heroData, prefix: e.target.value })
              }
            />
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="title"
              placeholder="Enter title"
              value={heroData.title}
              onChange={(e) =>
                setHeroData({ ...heroData, title: e.target.value })
              }
            />
          </div>

          {/* Background Image Upload */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="heroImage"
            >
              Background Image
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="heroImage"
                onChange={(e) => setHeroFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="heroImage"
                className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Choose Image
              </label>
              {heroFile && (
                <span className="ml-4 text-sm text-gray-500">
                  {heroFile.name}
                </span>
              )}
            </div>
            {heroFile && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(heroFile)}
                  alt="Preview"
                  className="max-w-xs rounded-md border"
                />
              </div>
            )}
          </div>
        </fieldset>
        {/* Features Section */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">
            Features Section
          </legend>

          {/* Subtitle Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="subtitle"
            >
              Subtitle
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="subtitle"
              placeholder="Enter subtitle"
              value={featuresData.subtitle}
              onChange={(e) =>
                setFeaturesData({ ...featuresData, subtitle: e.target.value })
              }
            />
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="title"
              placeholder="Enter title"
              value={featuresData.title}
              onChange={(e) =>
                setFeaturesData({ ...featuresData, title: e.target.value })
              }
            />
          </div>

          {/* Icon Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="icon"
            >
              Icon
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="icon"
              placeholder="Enter icon class or URL"
              value={featuresData.icon}
              onChange={(e) =>
                setFeaturesData({ ...featuresData, icon: e.target.value })
              }
            />
          </div>
        </fieldset>
        {/* About Section with multiple images */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">
            About Section
          </legend>
          {/* Title Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="title"
              placeholder="Enter title"
              value={aboutData.title}
              onChange={(e) =>
                setAboutData({ ...aboutData, title: e.target.value })
              }
            />
          </div>
          {/* Subtitle Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="subtitle"
            >
              Subtitle
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="subtitle"
              placeholder="Enter subtitle"
              value={aboutData.subtitle}
              onChange={(e) =>
                setAboutData({ ...aboutData, subtitle: e.target.value })
              }
            />
          </div>
          {/* Description Textarea */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              id="description"
              placeholder="Enter description"
              value={aboutData.description}
              onChange={(e) =>
                setAboutData({ ...aboutData, description: e.target.value })
              }
            />
          </div>
          {/* Select up to 4 images */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="images"
            >
              Select up to 4 images:
            </label>
            <input
              type="file"
              id="images"
              multiple
              onChange={(e) => handleFileChange(e, setAboutFiles)}
              className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            />
            {aboutFiles.length > 0 && (
              <ul className="list-disc pl-5 mt-2">
                {aboutFiles.map((file, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Image Preview */}
          {aboutFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Image Previews:
              </h3>
              <div className="flex space-x-4">
                {aboutFiles.slice(0, 4).map((file, index) => (
                  <div
                    key={index}
                    className="w-24 h-24 overflow-hidden rounded-md border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Experience Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="experience"
            >
              Experience
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="experience"
              placeholder="Enter experience"
              value={aboutData.experience}
              onChange={(e) =>
                setAboutData({ ...aboutData, experience: e.target.value })
              }
            />
          </div>
          {/* Service Title Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="serviceTitle"
            >
              Service Title
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="serviceTitle"
              placeholder="Enter service title"
              value={aboutData.serviceTitle}
              onChange={(e) =>
                setAboutData({ ...aboutData, serviceTitle: e.target.value })
              }
            />
          </div>
          {/* Service Icon Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="serviceIcon"
            >
              Service Icon
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="serviceIcon"
              placeholder="Enter service icon"
              value={aboutData.serviceIcon}
              onChange={(e) =>
                setAboutData({ ...aboutData, serviceIcon: e.target.value })
              }
            />
          </div>
        </fieldset>

        {/* Appointment Section */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">
            Appointment Section
          </legend>

          {/* Image Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="appointmentImage"
            >
              Image
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="appointmentImage"
                onChange={(e) => setAppointmentFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="appointmentImage"
                className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Choose Image
              </label>
              {appointmentFile && (
                <span className="ml-4 text-sm text-gray-500">
                  {appointmentFile.name}
                </span>
              )}
            </div>
            {appointmentFile && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(appointmentFile)}
                  alt="Appointment Preview"
                  className="max-w-xs rounded-md border"
                />
              </div>
            )}
          </div>
        </fieldset>
        {/* Why Choose Us Section */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">
            Why Choose Us Section
          </legend>

          {/* Title Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="title"
              placeholder="Enter title"
              value={whyChooseData.title}
              onChange={(e) =>
                setWhyChooseData({ ...whyChooseData, title: e.target.value })
              }
            />
          </div>

          {/* Subtitle Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="subtitle"
            >
              Subtitle
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="subtitle"
              placeholder="Enter subtitle"
              value={whyChooseData.subtitle}
              onChange={(e) =>
                setWhyChooseData({ ...whyChooseData, subtitle: e.target.value })
              }
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              id="description"
              placeholder="Enter description"
              value={whyChooseData.description}
              onChange={(e) =>
                setWhyChooseData({
                  ...whyChooseData,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* Service Title Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="serviceTitle"
            >
              Service Title
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="serviceTitle"
              placeholder="Enter service title"
              value={whyChooseData.serviceTitle}
              onChange={(e) =>
                setWhyChooseData({
                  ...whyChooseData,
                  serviceTitle: e.target.value,
                })
              }
            />
          </div>

          {/* Service Description Textarea */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="serviceDescription"
            >
              Service Description
            </label>
            <textarea
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              id="serviceDescription"
              placeholder="Enter service description"
              value={whyChooseData.serviceDescription}
              onChange={(e) =>
                setWhyChooseData({
                  ...whyChooseData,
                  serviceDescription: e.target.value,
                })
              }
            />
          </div>

          {/* Service Icon Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="serviceIcon"
            >
              Service Icon
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="serviceIcon"
              placeholder="Enter service icon"
              value={whyChooseData.serviceIcon}
              onChange={(e) =>
                setWhyChooseData({
                  ...whyChooseData,
                  serviceIcon: e.target.value,
                })
              }
            />
          </div>

          {/* Image Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="whyChooseImage"
            >
              Image
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="whyChooseImage"
                onChange={(e) => setWhyChooseFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="whyChooseImage"
                className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Choose Image
              </label>
              {whyChooseFile && (
                <span className="ml-4 text-sm text-gray-500">
                  {whyChooseFile.name}
                </span>
              )}
            </div>
            {whyChooseFile && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(whyChooseFile)}
                  alt="Why Choose Us Preview"
                  className="max-w-xs rounded-md border"
                />
              </div>
            )}
          </div>
        </fieldset>
        {/* Download App Section */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">
            Download App Section
          </legend>

          {/* Title Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="title"
              placeholder="Enter title"
              value={downloadAppData.title}
              onChange={(e) =>
                setDownloadAppData({
                  ...downloadAppData,
                  title: e.target.value,
                })
              }
            />
          </div>

          {/* Subtitle Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="subtitle"
            >
              Subtitle
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="subtitle"
              placeholder="Enter subtitle"
              value={downloadAppData.subtitle}
              onChange={(e) =>
                setDownloadAppData({
                  ...downloadAppData,
                  subtitle: e.target.value,
                })
              }
            />
          </div>

          {/* Description Textarea */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              id="description"
              placeholder="Enter description"
              value={downloadAppData.description}
              onChange={(e) =>
                setDownloadAppData({
                  ...downloadAppData,
                  description: e.target.value,
                })
              }
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="downloadAppImage"
            >
              Image
            </label>
            <div className="flex items-center">
              <input
                type="file"
                id="downloadAppImage"
                onChange={(e) => setDownloadAppFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="downloadAppImage"
                className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Choose Image
              </label>
              {downloadAppFile && (
                <span className="ml-4 text-sm text-gray-500">
                  {downloadAppFile.name}
                </span>
              )}
            </div>
            {downloadAppFile && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(downloadAppFile)}
                  alt="Download App Preview"
                  className="max-w-xs rounded-md border"
                />
              </div>
            )}
          </div>
        </fieldset>
        {/* Appointment Process Section */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">
            Appointment Process Section
          </legend>

          {/* Icon Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="icon"
            >
              Icon
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="icon"
              placeholder="Enter icon"
              value={appointmentProcessData.icon}
              onChange={(e) =>
                setAppointmentProcessData({
                  ...appointmentProcessData,
                  icon: e.target.value,
                })
              }
            />
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              type="text"
              id="title"
              placeholder="Enter title"
              value={appointmentProcessData.title}
              onChange={(e) =>
                setAppointmentProcessData({
                  ...appointmentProcessData,
                  title: e.target.value,
                })
              }
            />
          </div>
        </fieldset>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {homepageExists ? "Update Homepage" : "Create Homepage"}
        </button>
      </form>
    </div>
  );
};

export default HomepageForm;
