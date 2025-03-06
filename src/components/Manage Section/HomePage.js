import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash } from "react-icons/fa";

const HomepageForm = () => {
  // Language Selection (default: English)
  const [language, setLanguage] = useState("en");

  // Homepage existence state
  const [homepageExists, setHomepageExists] = useState(false);

  // Text data for each section (for specific language)
  const [heroData, setHeroData] = useState({ prefix: "", title: "" });
  const [featuresList, setFeaturesList] = useState([{ subtitle: "", title: "", icon: null }]);
  const [aboutData, setAboutData] = useState({ title: "", subtitle: "", description: "", experience: "", serviceTitle: "", serviceIcon: "" });
  const [servicesList, setServicesList] = useState([{ serviceTitle: "", serviceIcon: "" }]);
  const [whyChooseData, setWhyChooseData] = useState({ title: "", subtitle: "", description: "", services: [{ serviceTitle: "", serviceDescription: "", serviceIcon: "" }] });
  const [downloadAppData, setDownloadAppData] = useState({ title: "", subtitle: "", description: "" });
  const [appointmentProcessData, setAppointmentProcessData] = useState([{ icon: "", title: "" }]); 
  const [appointmentData, setAppointmentData] = useState({});

  // File data (for POST requests)
  const [heroFile, setHeroFile] = useState(null);
  const [aboutFiles, setAboutFiles] = useState([]);
  const [appointmentFile, setAppointmentFile] = useState(null);
  const [downloadAppFile, setDownloadAppFile] = useState(null);
  const [whyChooseFile, setWhyChooseFile] = useState(null);

   // Function to handle input change
   const handleFeatureChange = (index, field, value) => {
    const updatedFeatures = [...featuresList];
    updatedFeatures[index][field] = value;
    setFeaturesList(updatedFeatures);
  };

   // Handle service field changes
   const handleServiceChange = (index, field, value) => {
    const updatedServices = [...servicesList];
    updatedServices[index][field] = value;
    setServicesList(updatedServices);
  };

 // Handle service field changes
 const handleWhyChooseChange = (index, field, value) => {
  const updatedServices = [...whyChooseData.services];
  updatedServices[index][field] = value;
  setWhyChooseData({ ...whyChooseData, services: updatedServices });
};

// Handle input changes for appointment process
const handleAppointmentProcessChange = (index, field, value) => {
  const updatedProcesses = [...appointmentProcessData];
  updatedProcesses[index][field] = value;
  setAppointmentProcessData(updatedProcesses);
};

  // Handle file upload
  const handleIconUpload = (index, file) => {
    const updatedFeatures = [...featuresList];
    updatedFeatures[index].icon = file;
    setFeaturesList(updatedFeatures);
  };

  // Function to add a new feature section
  const addFeature = () => {
    setFeaturesList([...featuresList, { subtitle: "", title: "", icon: "" }]);
  };

  // Function to remove a feature section
  const removeFeature = (index) => {
    const updatedFeatures = featuresList.filter((_, i) => i !== index);
    setFeaturesList(updatedFeatures);
  };

  // Add a new service
  const addService = () => {
    setServicesList([...servicesList, { serviceTitle: "", serviceIcon: "" }]);
  };

  // Remove a service
  const removeService = (index) => {
    setServicesList(servicesList.filter((_, i) => i !== index));
  };

   // Add why choose service
   const addChooseService = () => {
    setWhyChooseData((prevData) => ({
      ...prevData,
      services: [...prevData.services, { serviceTitle: "", serviceDescription: "", serviceIcon: "" }],
    }));
  };

   // Remove why choose service
   const removeChooseService = (index) => {
    const updatedServices = whyChooseData.services.filter((_, i) => i !== index);
    setWhyChooseData({ ...whyChooseData, services: updatedServices });
  };

    // Add a new Appointment Process
    const addAppointmentProcess = () => {
      setAppointmentProcessData([...appointmentProcessData, { icon: "", title: "" }]);
    };
  
    // Remove an Appointment Process
    const removeAppointmentProcess = (index) => {
      setAppointmentProcessData(appointmentProcessData.filter((_, i) => i !== index));
    };
  

  // GET: Load homepage data
  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/home");
        console.log(res.data);
        if (res.data) {
          setHomepageExists(true);
          const {
            heroSection,
            featuresSection,
            servicesSection,
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
          if (featuresSection?.translations[language]) setFeaturesList(featuresSection.translations[language]);
          if (servicesSection?.translations[language]) setServicesList(servicesSection.translations[language]);
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
      const featuresData = featuresList.map((feature) => ({
        subtitle: feature.subtitle,
        title: feature.title,
        icon: feature.icon ? "" : feature.icon,
      }));
      formData.append("featuresSection", JSON.stringify(featuresData));
      const servicesData = servicesList.map((service) => ({
        subtitle: service.subtitle,
        serviceIcon: service.serviceIcon ? "" : service.serviceIcon,
      }));
      formData.append("servicesSection", JSON.stringify(servicesData));
      const whyServicesData = whyChooseData.services.map((service) => ({
        serviceTitle: service.serviceTitle,
        serviceDescription: service.serviceDescription,
        serviceIcon: service.serviceIcon,
      }));
      formData.append("whyChooseUsSection", JSON.stringify(whyServicesData));
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
      const appointmentData = appointmentProcessData.map((appointment) => ({
        icon: appointment.icon,
        title: appointment.title ? "" : appointment.title,
      }));
      formData.append(
        "appointmentProcess",
        JSON.stringify(appointmentData)
      );

      if (heroFile) formData.append("heroBackgroundImage", heroFile);
      if (aboutFiles.length > 0)
        aboutFiles.forEach((file) => formData.append("aboutImages", file));
      if (appointmentFile) formData.append("appointmentImage", appointmentFile);
      if (downloadAppFile) formData.append("downloadAppImage", downloadAppFile);
      if (whyChooseFile) formData.append("whyChooseUsImage", whyChooseFile);

       // Upload feature icons
    featuresList.forEach((feature, index) => {
      if (feature.icon instanceof File) {
        formData.append(`featureIcon_${index}`, feature.icon);
      }
    });

      try {
        const res = await axios.post(
          "http://localhost:5000/api/home",
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
        { name: "featuresSection", data: featuresList },
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
            return axios.put(`http://localhost:5000/api/home/${name}`, {
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
          <div className="mb-6">
          <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="heroImage"
            >
              Background Image
            </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="appointmentImage"
            onChange={(e) => setHeroFile(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="appointmentImage"
            className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14m7-7H5"
              />
            </svg>
            <span>Choose Image</span>
          </label>
          {heroFile && (
            <span className="text-sm text-gray-500">
              {heroFile.name}
            </span>
          )}
        </div>

        {heroFile && (
          <div className="mt-4 flex justify-left">
            <img
              src={URL.createObjectURL(heroFile)}
              alt="Why Choose Us Preview"
              className="max-w-full max-h-48 object-cover rounded-lg shadow-xl border-2 border-gray-200"
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
            {featuresList.map((feature, index) => (
                <div key={index} className="mb-4 border p-4 rounded-lg bg-white relative">
                      {/* Subtitle Input */}
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subtitle
                        </label>
                        <input
                          className="w-full p-2 border rounded-md"
                          type="text"
                          placeholder="Enter subtitle"
                          value={feature.subtitle}
                          onChange={(e) => handleFeatureChange(index, "subtitle", e.target.value)}
                        />
                      </div>
                      {/* Title Input */}
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          className="w-full p-2 border rounded-md"
                          type="text"
                          placeholder="Enter title"
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                        />
                      </div>

                      {/* Icon Upload */}
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Upload Icon
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full p-2 border rounded-md"
                          onChange={(e) => handleIconUpload(index, e.target.files[0])}
                        />
                      </div>

                      {/* Preview Uploaded Icon */}
                      {feature.icon && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(feature.icon)}
                            alt="Icon Preview"
                            className="max-w-16 max-h-16 rounded-md border"
                          />
                        </div>
                      )}
                      {/* Remove Button */}
                      {featuresList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                        >
                          <FaTrash/>
                        </button>
                      )}
                </div>
              ))}

          {/* Add New Feature Button */}
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus /> Add Feature
          </button>
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
          {/* Select 4 images */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="images"
            >
              Select 4 images:
            </label>
            <input
              type="file"
              id="images"
              multiple
              onChange={(e) => handleFileChange(e, setAboutFiles)}
              className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Image Preview */}
          {aboutFiles.length > 0 && (
            <div className="mt-4">
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
          {servicesList.map((service, index) => (
          <div key={index} className="mb-4 border p-4 rounded-lg bg-white relative">
            {/* Service Title Input */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
              <input
                className="w-full p-2 border rounded-md"
                type="text"
                placeholder="Enter service title"
                value={service.serviceTitle}
                onChange={(e) => handleServiceChange(index, "serviceTitle", e.target.value)}
              />
            </div>

            {/* Service Icon Upload */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Service Icon</label>
              <input
                type="file"
                accept="image/*"
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Preview Uploaded Icon */}
            {service.serviceIcon && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(service.serviceIcon)}
                  alt="Service Icon Preview"
                  className="max-w-16 max-h-16 rounded-md border"
                />
              </div>
            )}

            {/* Remove Service Button */}
            {servicesList.length > 1 && (
              <button type="button" onClick={() => removeService(index)} className="absolute top-2 right-2 text-red-600 hover:text-red-800">
                <FaTrash />
              </button>
            )}
          </div>
        ))}
           {/* Add New Service Button */}
        <button type="button" onClick={addService} className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1">
          <FaPlus /> Add Service
        </button>
        </fieldset>

        {/* Appointment Section */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">
            Appointment Section
          </legend>

          {/* Image Input */}
          <div className="mb-6">
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="appointmentImage"
            onChange={(e) => setAppointmentFile(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="appointmentImage"
            className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14m7-7H5"
              />
            </svg>
            <span>Choose Image</span>
          </label>
          {appointmentFile && (
            <span className="text-sm text-gray-500">
              {appointmentFile.name}
            </span>
          )}
        </div>

        {appointmentFile && (
          <div className="mt-4 flex justify-center">
            <img
              src={URL.createObjectURL(appointmentFile)}
              alt="Why Choose Us Preview"
              className="max-w-full max-h-48 object-cover rounded-lg shadow-xl border-2 border-gray-200"
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
             {/* Image Input */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="whyChooseImage"
            onChange={(e) => setWhyChooseFile(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="whyChooseImage"
            className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14m7-7H5"
              />
            </svg>
            <span>Choose Image</span>
          </label>
          {whyChooseFile && (
            <span className="text-sm text-gray-500">
              {whyChooseFile.name}
            </span>
          )}
        </div>

        {whyChooseFile && (
          <div className="mt-4 flex justify-left">
            <img
              src={URL.createObjectURL(whyChooseFile)}
              alt="Why Choose Us Preview"
              className="max-w-full max-h-48 object-cover rounded-lg shadow-xl border-2 border-gray-200"
            />
          </div>
        )}
      </div>

          {/* Services Fields */}
        {whyChooseData.services.map((service, index) => (
          <div key={index} className="mb-4 border p-4 rounded-lg bg-white relative">
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
              <input
                className="w-full p-2 border rounded-md"
                type="text"
                placeholder="Enter service title"
                value={service.serviceTitle}
                onChange={(e) => handleWhyChooseChange(index, "serviceTitle", e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Description</label>
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Enter service description"
                value={service.serviceDescription}
                onChange={(e) => handleWhyChooseChange(index, "serviceDescription", e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Icon</label>
              <input
                className="w-full p-2 border rounded-md"
                type="text"
                placeholder="Enter service icon"
                value={service.serviceIcon}
                onChange={(e) => handleWhyChooseChange(index, "serviceIcon", e.target.value)}
              />
            </div>

            {/* Remove Service Button */}
            <button
              type="button"
              onClick={() => removeChooseService(index)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        {/* Add Service Button */}
        <button
          type="button"
          onClick={addChooseService}
          className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
        >
          <FaPlus /> Add Service
        </button>

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
          <div className="mb-6">
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="downloadAppImage"
            onChange={(e) => setDownloadAppFile(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="downloadAppImage"
            className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 5v14m7-7H5"
              />
            </svg>
            <span>Choose Image</span>
          </label>
          {downloadAppFile && (
            <span className="text-sm text-gray-500">
              {downloadAppFile.name}
            </span>
          )}
        </div>

        {downloadAppFile && (
          <div className="mt-4 flex justify-left">
            <img
              src={URL.createObjectURL(downloadAppFile)}
              alt="Why Choose Us Preview"
              className="max-w-full max-h-48 object-cover rounded-lg shadow-xl border-2 border-gray-200"
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

            {appointmentProcessData.map((process, index) => (
              <div key={index} className="mb-4 border p-4 rounded-lg bg-white relative">
                {/* Icon Input */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor={`icon_${index}`}
                  >
                    Icon
                  </label>
                  <input
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                    type="text"
                    id={`icon_${index}`}
                    placeholder="Enter icon"
                    value={process.icon}
                    onChange={(e) =>
                      handleAppointmentProcessChange(index, "icon", e.target.value)
                    }
                  />
                </div>

                {/* Title Input */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2"
                    htmlFor={`title_${index}`}
                  >
                    Title
                  </label>
                  <input
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                    type="text"
                    id={`title_${index}`}
                    placeholder="Enter title"
                    value={process.title}
                    onChange={(e) =>
                      handleAppointmentProcessChange(index, "title", e.target.value)
                    }
                  />
                </div>

                {/* Remove Button */}
                {appointmentProcessData.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAppointmentProcess(index)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}

            {/* Add New Appointment Process Button */}
            <button
              type="button"
              onClick={addAppointmentProcess}
              className="mt-4 text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <FaPlus /> Add Appointment Process
            </button>
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
