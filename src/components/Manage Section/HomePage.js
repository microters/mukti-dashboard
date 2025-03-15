import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaSpinner, FaLanguage, FaCopy } from "react-icons/fa";

// confiq & constent
const API = "http://localhost:5000/api/home";
const DEFAULT_FEATURE = { subtitle: "", title: "", icon: "" };
const DEFAULT_SERVICE = { serviceTitle: "", serviceIcon: "" };
const DEFAULT_WHY_CHOOSE_SERVICE = { serviceTitle: "", serviceDescription: "", serviceIcon: "" };
const DEFAULT_PROCESS = { icon: "", title: "" };

// reusable components
const FormInput = ({ label, id, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>{label}</label>
    <input 
      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
      type="text" id={id} placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      value={value || ""} onChange={onChange}
    />
  </div>
);

const FormTextarea = ({ label, id, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>{label}</label>
    <textarea
      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
      id={id} placeholder={`Enter ${label.toLowerCase()}`}
      value={value || ""} onChange={onChange}
    />
  </div>
);

const IconUpload = ({ id, onChange, filename }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
    <div className="flex items-center gap-3">
      <input type="file" id={id} onChange={onChange} className="hidden" accept="image/*" />
      <label htmlFor={id} className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition duration-300 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-4 h-4 mr-1" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
        </svg>
        <span>Choose Icon</span>
      </label>
      {filename && <span className="text-sm text-gray-500">{filename}</span>}
    </div>
  </div>
);

const ImageUpload = ({ id, label, file, setFile, currentImage }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>{label}</label>
    <div className="flex items-center gap-3">
      <input type="file" id={id} onChange={(e) => setFile(e.target.files[0])} className="hidden" />
      <label htmlFor={id} className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md shadow-lg hover:bg-green-700 transition duration-300 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
        </svg>
        <span>Choose Image</span>
      </label>
      {file && <span className="text-sm text-gray-500">{file.name}</span>}
    </div>
    
    {file ? (
      <div className="mt-4 flex justify-left">
        <img src={URL.createObjectURL(file)} alt={`${label} Preview`} className="max-w-full max-h-48 object-cover rounded-lg shadow-xl border-2 border-gray-200" />
      </div>
    ) : currentImage && (
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
        <img src={getImageUrl(currentImage)} alt={`Current ${label}`} className="max-w-full max-h-48 object-cover rounded-lg shadow-xl border-2 border-gray-200" />
      </div>
    )}
  </div>
);

const IconPreview = ({file, icon}) => {
  if (!file && (!icon || icon === "icon-selected")) return null;
  
  return (
    <div className="mt-2 flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Icon Preview:</span>
      <div className="w-12 h-12 border rounded-md flex items-center justify-center overflow-hidden bg-white">
        {file ? (
          <img src={URL.createObjectURL(file)} alt="Icon Preview" className="max-w-full max-h-full object-contain" />
        ) : icon && icon !== "icon-selected" ? (
          <img src={getImageUrl(icon)} alt="Icon Preview" className="max-w-full max-h-full object-contain" />
        ) : null}
      </div>
    </div>
  );
};

// helper function
const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") {
    if (image === "icon-selected") return "";
    return image.startsWith("http") ? image : `http://localhost:5000/${image}`;
  }
  return URL.createObjectURL(image);
};

const ensureArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  
  // check array from object
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length > 0 && keys.every(key => !isNaN(parseInt(key)))) {
      return Object.values(data);
    }
    
    // nested property check
    for (const key in data) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }
  }
  
  return [data]; 
};

const parseData = (data) => {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("JSON parsing error:", error);
      return data;
    }
  }
  return data;
};

// main componnet
const HomepageForm = () => {
  // lamguage & loading state
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [homepageExists, setHomepageExists] = useState(false);

  // section data state
  const [heroData, setHeroData] = useState({ prefix: "", title: "" });
  const [featuresList, setFeaturesList] = useState([DEFAULT_FEATURE]);
  const [aboutData, setAboutData] = useState({ 
    title: "", subtitle: "", description: "", experience: "", services: [] 
  });
  const [whyChooseData, setWhyChooseData] = useState({ 
    title: "", subtitle: "", description: "", 
    services: [DEFAULT_WHY_CHOOSE_SERVICE] 
  });
  const [downloadAppData, setDownloadAppData] = useState({ title: "", subtitle: "", description: "" });
  const [appointmentProcessData, setAppointmentProcessData] = useState([DEFAULT_PROCESS]); 
  const [appointmentData, setAppointmentData] = useState({});

  //file state
  const [heroFile, setHeroFile] = useState(null);
  const [aboutFiles, setAboutFiles] = useState([]);
  const [appointmentFile, setAppointmentFile] = useState(null);
  const [downloadAppFile, setDownloadAppFile] = useState(null);
  const [whyChooseFile, setWhyChooseFile] = useState(null);
  
  //icon file state
  const [featureIconFiles, setFeatureIconFiles] = useState([]);
  const [serviceIconFiles, setServiceIconFiles] = useState([]);
  const [whyChooseServiceIconFiles, setWhyChooseServiceIconFiles] = useState([]);
  const [appointmentProcessIconFiles, setAppointmentProcessIconFiles] = useState([]);

  // message handeling function
  const showTemporaryMessage = (message, setterFn, timeout) => {
    setterFn(message);
    setTimeout(() => setterFn(null), timeout);
  };

  const showSuccessMessage = (message) => showTemporaryMessage(message, setSuccessMessage, 3000);
  const showErrorMessage = (message) => showTemporaryMessage(message, setError, 5000);

  // generic item handeler
  const handleItemChange = (items, setItems, index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // handelier function create
  const createItemHandler = (items, setItems) => 
    (index, field, value) => handleItemChange(items, setItems, index, field, value);

  // icon upload handelier
  const handleIconUpload = (files, setFiles, items, setItems, index, file, iconField = "icon") => {
    if (!file) return;
    
    const updatedIconFiles = [...files];
    updatedIconFiles[index] = file;
    setFiles(updatedIconFiles);
    
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [iconField]: "icon-selected" };
    setItems(updatedItems);
  };

  // General Handelar function
  const handleFeatureChange = createItemHandler(featuresList, setFeaturesList);
  const handleServiceChange = (index, field, value) => {
    const services = [...(aboutData.services || [])];
    while (services.length <= index) services.push(DEFAULT_SERVICE);
    handleItemChange(services, (newServices) => setAboutData({...aboutData, services: newServices}), index, field, value);
  };
  const handleWhyChooseChange = createItemHandler(whyChooseData.services, 
    (newServices) => setWhyChooseData({...whyChooseData, services: newServices}));
  const handleAppointmentProcessChange = createItemHandler(appointmentProcessData, setAppointmentProcessData);

  //icon upload handelar
  const handleFeatureIconUpload = (index, file) => 
    handleIconUpload(featureIconFiles, setFeatureIconFiles, featuresList, setFeaturesList, index, file);
  
  const handleServiceIconUpload = (index, file) => {
    if (!file) return;
    const services = [...(aboutData.services || [])];
    while (services.length <= index) services.push(DEFAULT_SERVICE);
    handleIconUpload(serviceIconFiles, setServiceIconFiles, services, 
      (newServices) => setAboutData({...aboutData, services: newServices}), index, file, "serviceIcon");
  };
  
  const handleWhyChooseServiceIconUpload = (index, file) => 
    handleIconUpload(whyChooseServiceIconFiles, setWhyChooseServiceIconFiles, 
      whyChooseData.services, (newServices) => setWhyChooseData({...whyChooseData, services: newServices}), 
      index, file, "serviceIcon");
  
  const handleAppointmentProcessIconUpload = (index, file) => 
    handleIconUpload(appointmentProcessIconFiles, setAppointmentProcessIconFiles, 
      appointmentProcessData, setAppointmentProcessData, index, file);

  // item add/remove function
  const addItem = (items, setItems, itemTemplate, files, setFiles) => {
    setItems([...items, itemTemplate]);
    setFiles([...files, null]);
  };
  
  const removeItem = (items, setItems, index, files, setFiles) => {
    setItems(items.filter((_, i) => i !== index));
    setFiles([...files].filter((_, i) => i !== index));
  };

  //specific item add/remove function
  const addFeature = () => addItem(featuresList, setFeaturesList, DEFAULT_FEATURE, featureIconFiles, setFeatureIconFiles);
  const removeFeature = (index) => removeItem(featuresList, setFeaturesList, index, featureIconFiles, setFeatureIconFiles);
  
  const addService = () => {
    const services = aboutData.services || [];
    setAboutData({...aboutData, services: [...services, DEFAULT_SERVICE]});
    setServiceIconFiles([...serviceIconFiles, null]);
  };
  
  const removeService = (index) => {
    const services = aboutData.services || [];
    setAboutData({...aboutData, services: services.filter((_, i) => i !== index)});
    setServiceIconFiles([...serviceIconFiles].filter((_, i) => i !== index));
  };
  
  const addChooseService = () => addItem(whyChooseData.services, 
    (newServices) => setWhyChooseData({...whyChooseData, services: newServices}), 
    DEFAULT_WHY_CHOOSE_SERVICE, whyChooseServiceIconFiles, setWhyChooseServiceIconFiles);
  
  const removeChooseService = (index) => removeItem(whyChooseData.services, 
    (newServices) => setWhyChooseData({...whyChooseData, services: newServices}), 
    index, whyChooseServiceIconFiles, setWhyChooseServiceIconFiles);
  
  const addAppointmentProcess = () => addItem(appointmentProcessData, setAppointmentProcessData, 
    DEFAULT_PROCESS, appointmentProcessIconFiles, setAppointmentProcessIconFiles);
  
  const removeAppointmentProcess = (index) => removeItem(appointmentProcessData, 
    setAppointmentProcessData, index, appointmentProcessIconFiles, setAppointmentProcessIconFiles);

  // file change handelar
  const handleFileChange = (e, setState, maxFiles = 4) => {
    const files = Array.from(e.target.files);
    if (files.length + (setState.length || 0) <= maxFiles) {
      setState(files);
    } else {
      alert(`You can only select up to ${maxFiles} files.`);
    }
  };

  // section data process handelar
  const processSection = useCallback((section, setter, transformer = (data) => data) => {
    if (section?.translations && section.translations[language]) {
      // নির্দিষ্ট ভাষায় ডেটা পাওয়া গেছে
      const data = parseData(section.translations[language]);
      setter(transformer(data));
    } else if (section?.translations?.en) {
      // নির্দিষ্ট ভাষায় ডেটা না পেলে ইংরেজি ডেটা দেখানো
      console.log(`No data found for language: ${language}, showing English data instead`);
      const data = parseData(section.translations.en);
      setter(transformer(data));
    } else {
      // কোন ডেটাই না পাওয়া গেলে ডিফল্ট ডেটা দেখানো
      console.log(`No data found for any language in section`);
      setter(transformer({}));
    }
  }, [language]);

  // একটি ভাষার ডেটা থেকে অন্য ভাষায় কপি করার ফাংশন
  const copyTranslations = async (sourceLanguage, targetLanguage) => {
    try {
      setIsCopying(true);
      const response = await axios.post(`${API}/copy-translations`, {
        sourceLanguage,
        targetLanguage
      });
      
      console.log("Copy response:", response.data);
      showSuccessMessage(`Content copied from ${sourceLanguage} to ${targetLanguage}`);
      
      // কপি করার পর রিলোড করে নতুন ডেটা দেখানো
      await fetchHomepage();
    } catch (error) {
      console.error("Error copying translations:", error);
      showErrorMessage("Error copying translations: " + (error.response?.data?.error || error.message));
    } finally {
      setIsCopying(false);
    }
  };

  // homepage data fetch handelar
  const fetchHomepage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // ভাষা প্যারামিটার এরিয়ায় যোগ করে API কল
      const res = await axios.get(`${API}?language=${language}`);
      
      if (res.data) {
        setHomepageExists(true);
        const {
          heroSection, featuresSection, aboutSection, appointmentSection,
          whyChooseUsSection, downloadAppSection, appointmentProcess,
        } = res.data;
        
        // hero section
        processSection(heroSection, setHeroData);
        
        // features section
        processSection(featuresSection, (data) => {
          const featuresArray = ensureArray(data);
          setFeaturesList(featuresArray.length > 0 ? featuresArray : [DEFAULT_FEATURE]);
          setFeatureIconFiles(new Array(featuresArray.length).fill(null));
        });
        
        // About section
        processSection(aboutSection, (data) => {
          if (data.services) {
            data.services = ensureArray(data.services);
            setServiceIconFiles(new Array(data.services.length).fill(null));
          } else {
            data.services = [];
            setServiceIconFiles([]);
          }
          setAboutData(data);
        });
        
        // Appointment section
        processSection(appointmentSection, setAppointmentData);
        
        // WHY CHOOSE US section
        processSection(whyChooseUsSection, (data) => {
          if (data.services) {
            data.services = ensureArray(data.services);
            setWhyChooseServiceIconFiles(new Array(data.services.length).fill(null));
          } else {
            data.services = [DEFAULT_WHY_CHOOSE_SERVICE];
            setWhyChooseServiceIconFiles([null]);
          }
          setWhyChooseData(data);
        });
        
        // Download App section
        processSection(downloadAppSection, setDownloadAppData);
        
        // Appointment Process
        processSection(appointmentProcess, (data) => {
          const processArray = ensureArray(data);
          setAppointmentProcessData(processArray.length > 0 ? processArray : [DEFAULT_PROCESS]);
          setAppointmentProcessIconFiles(new Array(processArray.length || 1).fill(null));
        });
      } else {
        setHomepageExists(false);
      }
    } catch (error) {
      console.error("Error fetching homepage:", error);
      showErrorMessage("Error loading homepage data: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  }, [language, processSection]);

  // ভাষা পরিবর্তন হলে ডেটা পুনরায় লোড করা
  useEffect(() => {
    fetchHomepage();
  }, [language, fetchHomepage]);

  // Homepage create handelar
  const handleCreateHomepage = async () => {
    try {
      const formData = new FormData();
      
      // ভাষা প্যারামিটার যোগ করা
      formData.append("language", language);
      
      // HERO SECTION
      formData.append("heroSection", JSON.stringify({ ...heroData, backgroundImage: "" }));
      if (heroFile) formData.append("heroBackgroundImage", heroFile);

      //  FEATURES SECTION
      formData.append("featuresSection", JSON.stringify(featuresList.map(feature => ({
        subtitle: feature.subtitle || "", title: feature.title || "", icon: ""
      }))));
      
      featureIconFiles.forEach((file, index) => {
        if (file) formData.append(`featureIcon_${index}`, file);
      });

      // ABOUT SECTION
      formData.append("aboutSection", JSON.stringify({
        ...aboutData,
        images: [],
        services: (aboutData.services || []).map(service => ({
          serviceTitle: service.serviceTitle || "", serviceIcon: ""
        }))
      }));
      
      serviceIconFiles.forEach((file, index) => {
        if (file) formData.append(`serviceIcon_${index}`, file);
      });
      
      if (aboutFiles.length > 0) {
        aboutFiles.forEach(file => formData.append("aboutImages", file));
      }
      
      // appointment section
      formData.append("appointmentSection", JSON.stringify(appointmentData));
      if (appointmentFile) formData.append("appointmentImage", appointmentFile);
      
      // why choose us section
      formData.append("whyChooseUsSection", JSON.stringify({
        title: whyChooseData.title || "",
        subtitle: whyChooseData.subtitle || "",
        description: whyChooseData.description || "",
        services: whyChooseData.services.map(service => ({
          serviceTitle: service.serviceTitle || "",
          serviceDescription: service.serviceDescription || "",
          serviceIcon: ""
        })),
        image: ""
      }));
      
      if (whyChooseFile) formData.append("whyChooseUsImage", whyChooseFile);
      whyChooseServiceIconFiles.forEach((file, index) => {
        if (file) formData.append(`whyChooseServiceIcon_${index}`, file);
      });
      
      // download app section
      formData.append("downloadAppSection", JSON.stringify({ ...downloadAppData, image: "" }));
      if (downloadAppFile) formData.append("downloadAppImage", downloadAppFile);
      
      // appointment process
      formData.append("appointmentProcess", JSON.stringify(
        appointmentProcessData.map(process => ({ title: process.title || "", icon: "" }))
      ));
      
      appointmentProcessIconFiles.forEach((file, index) => {
        if (file) formData.append(`appointmentProcessIcon_${index}`, file);
      });

      // ভাষা প্যারামিটার URL এ যোগ করা
      await axios.post(`${API}?language=${language}`, formData, { 
        headers: { "Content-Type": "multipart/form-data" } 
      });
      
      showSuccessMessage(`Homepage created successfully for ${language} language!`);
      setHomepageExists(true);
    } catch (err) {
      console.error("Error creating homepage:", err);
      showErrorMessage("Error creating homepage: " + (err.response?.data?.error || err.message));
    }
  };

  // homepage update handelar
  const handleUpdateHomepage = async () => {
    try {
      // টেক্সট কন্টেন্ট আপডেট
      const updatePromises = [
        axios.put(`${API}/heroSection`, { language, translations: heroData }),
        
        axios.put(`${API}/featuresSection`, { 
          language, 
          translations: featuresList.map(f => ({
            subtitle: f.subtitle || "", 
            title: f.title || "", 
            icon: f.icon !== "icon-selected" ? f.icon : ""
          }))
        }),
        
        axios.put(`${API}/aboutSection`, {
          language,
          translations: {
            ...aboutData,
            services: (aboutData.services || []).map(s => ({
              serviceTitle: s.serviceTitle || "",
              serviceIcon: s.serviceIcon !== "icon-selected" ? s.serviceIcon : ""
            }))
          }
        }),
        
        axios.put(`${API}/appointmentSection`, { language, translations: appointmentData }),
        
        axios.put(`${API}/whyChooseUsSection`, {
          language,
          translations: {
            ...whyChooseData,
            services: whyChooseData.services.map(s => ({
              serviceTitle: s.serviceTitle || "",
              serviceDescription: s.serviceDescription || "",
              serviceIcon: s.serviceIcon !== "icon-selected" ? s.serviceIcon : ""
            }))
          }
        }),
        
        axios.put(`${API}/downloadAppSection`, { language, translations: downloadAppData }),
        
        axios.put(`${API}/appointmentProcess`, {
          language,
          translations: appointmentProcessData.map(p => ({
            title: p.title || "",
            icon: p.icon !== "icon-selected" ? p.icon : ""
          }))
        })
      ];
      
      await Promise.all(updatePromises);
      
      // ইমেজ আপডেট
      const uploadImages = async () => {
        const uploadFile = async (file, endpoint, fieldName) => {
          if (!file) return;
          const formData = new FormData();
          formData.append(fieldName, file);
          formData.append("language", language);
          return axios.post(`${API}/${endpoint}?language=${language}`, formData, { 
            headers: { "Content-Type": "multipart/form-data" } 
          });
        };
        
        const uploadFiles = async (files, endpoint, fieldName) => {
          if (!files || !files.some(f => f !== null)) return;
          const formData = new FormData();
          
          formData.append("language", language);
          files.forEach((file, index) => {
            if (file) formData.append(`${fieldName}_${index}`, file);
          });
          
          return axios.post(`${API}/${endpoint}?language=${language}`, formData, { 
            headers: { "Content-Type": "multipart/form-data" } 
          });
        };
        
        const uploadMultiple = async (files, endpoint, fieldName) => {
          if (!files || !files.length) return;
          const formData = new FormData();
          formData.append("language", language);
          files.forEach(file => formData.append(fieldName, file));
          return axios.post(`${API}/${endpoint}?language=${language}`, formData, { 
            headers: { "Content-Type": "multipart/form-data" } 
          });
        };
        
        const imagePromises = [
          uploadFiles(featureIconFiles, "uploadFeatureIcons", "featureIcon"),
          uploadFiles(serviceIconFiles, "uploadServiceIcons", "serviceIcon"),
          uploadFiles(whyChooseServiceIconFiles, "uploadWhyChooseServiceIcons", "whyChooseServiceIcon"),
          uploadFiles(appointmentProcessIconFiles, "uploadAppointmentProcessIcons", "appointmentProcessIcon"),
          uploadFile(heroFile, "uploadHeroImage", "heroBackgroundImage"),
          uploadFile(appointmentFile, "uploadAppointmentImage", "appointmentImage"),
          uploadFile(whyChooseFile, "uploadWhyChooseImage", "whyChooseUsImage"),
          uploadFile(downloadAppFile, "uploadDownloadAppImage", "downloadAppImage"),
          uploadMultiple(aboutFiles, "uploadAboutImages", "aboutImages")
        ].filter(Boolean);
        
        if (imagePromises.length > 0) {
          await Promise.all(imagePromises);
        }
      };
      
      await uploadImages();
      
      showSuccessMessage(`Homepage updated successfully for ${language} language!`);
      
      // ফাইল সিলেকশন রিসেট
      setHeroFile(null);
      setAppointmentFile(null);
      setWhyChooseFile(null);
      setDownloadAppFile(null);
      setAboutFiles([]);
      setFeatureIconFiles(new Array(featuresList.length).fill(null));
      setServiceIconFiles(new Array((aboutData.services || []).length).fill(null));
      setWhyChooseServiceIconFiles(new Array(whyChooseData.services.length).fill(null));
      setAppointmentProcessIconFiles(new Array(appointmentProcessData.length).fill(null));
      
      // ডেটা রিফ্রেশ - পুনরায় আপডেটেড ডেটা লোড করা
      await fetchHomepage();
    } catch (err) {
      console.error("Error updating homepage:", err);
      showErrorMessage("Error updating homepage: " + (err.response?.data?.error || err.message));
    }
  };
  
  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      if (!homepageExists) {
        await handleCreateHomepage();
      } else {
        await handleUpdateHomepage();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // রিটার্ন লোডিং স্টেট
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin h-10 w-10 mx-auto text-blue-500" />
          <p className="mt-4 text-gray-600">Loading homepage data...</p>
        </div>
      </div>
    );
  }
  
  // আইটেম কম্পোনেন্ট
  const renderFeature = (feature, index) => (
    <div key={index} className="mb-4 border p-4 rounded-lg bg-white relative">
      <h3 className="font-medium mb-2">Feature #{index + 1}</h3>
      <FormInput
        label="Subtitle" id={`featureSubtitle_${index}`}
        value={feature.subtitle} placeholder="Enter subtitle"
        onChange={(e) => handleFeatureChange(index, "subtitle", e.target.value)}
      />
      <FormInput
        label="Title" id={`featureTitle_${index}`}
        value={feature.title} placeholder="Enter title"
        onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
      />
      <IconUpload
        id={`featureIcon_${index}`}
        onChange={(e) => handleFeatureIconUpload(index, e.target.files[0])}
        filename={featureIconFiles[index]?.name}
      />
      <IconPreview file={featureIconFiles[index]} icon={feature.icon} />
      
      {featuresList.length > 1 && (
        <button
          type="button"
          onClick={() => removeFeature(index)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      )}
    </div>
  );

  const renderService = (service, index) => (
    <div key={index} className="mb-4 border p-4 rounded-lg bg-white relative">
      <h3 className="font-medium mb-2">Service #{index + 1}</h3>
      <FormInput
        label="Service Title" id={`serviceTitle_${index}`}
        value={service.serviceTitle} placeholder="Enter service title"
        onChange={(e) => handleServiceChange(index, "serviceTitle", e.target.value)}
      />
      <IconUpload
        id={`serviceIcon_${index}`}
        onChange={(e) => handleServiceIconUpload(index, e.target.files[0])}
        filename={serviceIconFiles[index]?.name}
      />
      <IconPreview file={serviceIconFiles[index]} icon={service.serviceIcon} />
      
      {(aboutData.services || []).length > 1 && (
        <button
          type="button"
          onClick={() => removeService(index)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      )}
    </div>
  );

  const renderWhyChooseService = (service, index) => (
    <div key={index} className="mb-4 border p-4 rounded-lg bg-white relative">
      <h3 className="font-medium mb-2">Service #{index + 1}</h3>
      <FormInput
        label="Service Title" id={`whyChooseTitle_${index}`}
        value={service.serviceTitle} placeholder="Enter service title"
        onChange={(e) => handleWhyChooseChange(index, "serviceTitle", e.target.value)}
      />
      <FormTextarea
        label="Service Description" id={`whyChooseDesc_${index}`}
        value={service.serviceDescription}
        onChange={(e) => handleWhyChooseChange(index, "serviceDescription", e.target.value)}
      />
      <IconUpload
        id={`whyChooseServiceIcon_${index}`}
        onChange={(e) => handleWhyChooseServiceIconUpload(index, e.target.files[0])}
        filename={whyChooseServiceIconFiles[index]?.name}
      />
      <IconPreview file={whyChooseServiceIconFiles[index]} icon={service.serviceIcon} />
      
      {whyChooseData.services.length > 1 && (
        <button
          type="button"
          onClick={() => removeChooseService(index)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        >
          <FaTrash />
        </button>
      )}
    </div>
  );

  const renderAppointmentProcess = (process, index) => (
    <div key={index} className="mb-4 border p-4 rounded-lg bg-white relative">
      <h3 className="font-medium mb-2">Step #{index + 1}</h3>
      <FormInput
        label="Title" id={`processTitle_${index}`}
        value={process.title} placeholder="Enter title"
        onChange={(e) => handleAppointmentProcessChange(index, "title", e.target.value)}
      />
      <IconUpload
        id={`appointmentProcessIcon_${index}`}
        onChange={(e) => handleAppointmentProcessIconUpload(index, e.target.files[0])}
        filename={appointmentProcessIconFiles[index]?.name}
      />
      <IconPreview file={appointmentProcessIconFiles[index]} icon={process.icon} />
      
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
  );
  
  // রেন্ডার মূল কম্পোনেন্ট
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Create / Update Homepage</h1>
      
      {/* মেসেজ দেখানো */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* ভাষা সিলেক্ট এবং কপি বাটন */}
      <div className="mb-6 flex items-center justify-between">
        <div>
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
        
        {/* কন্টেন্ট কপি করার বাটন */}
        {homepageExists && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={isCopying || language === "en"}
              onClick={() => copyTranslations("en", language)}
              className={`flex items-center gap-1 px-4 py-2 rounded ${
                isCopying || language === "en" 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isCopying ? <FaSpinner className="animate-spin mr-1" /> : <FaCopy className="mr-1" />}
              Copy from English
            </button>
            
            <button
              type="button"
              disabled={isCopying || language === "bn"}
              onClick={() => copyTranslations("bn", language)}
              className={`flex items-center gap-1 px-4 py-2 rounded ${
                isCopying || language === "bn" 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isCopying ? <FaSpinner className="animate-spin mr-1" /> : <FaCopy className="mr-1" />}
              Copy from Bangla
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
        {/* হিরো সেকশন */}
        <fieldset className="border p-4 rounded bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">Hero Section</legend>
          <FormInput
            label="Prefix" id="prefix"
            value={heroData.prefix}
            onChange={(e) => setHeroData({ ...heroData, prefix: e.target.value })}
          />
          <FormInput
            label="Title" id="title"
            value={heroData.title}
            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
          />
          <ImageUpload
            id="heroImage"
            label="Background Image"
            file={heroFile}
            setFile={setHeroFile}
            currentImage={heroData.backgroundImage}
          />
        </fieldset>
        
        {/* ফিচার সেকশন */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">Features Section</legend>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Total Features: {featuresList.length}</p>
          </div>
          {featuresList.map(renderFeature)}
          <button
            type="button"
            onClick={addFeature}
            className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus /> Add Feature
          </button>
        </fieldset>
        
        {/* অ্যাবাউট সেকশন */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">About Section</legend>
          <FormInput
            label="Title" id="aboutTitle"
            value={aboutData.title}
            onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
          />
          <FormInput
            label="Subtitle" id="aboutSubtitle"
            value={aboutData.subtitle}
            onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
          />
          <FormTextarea
            label="Description" id="aboutDesc"
            value={aboutData.description}
            onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="images">
              Select About Images (up to 4):
            </label>
            <input
              type="file" id="images" multiple
              onChange={(e) => handleFileChange(e, setAboutFiles, 4)}
              className="w-full p-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {aboutFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">New Images Preview:</p>
              <div className="flex space-x-4">
                {aboutFiles.slice(0, 4).map((file, index) => (
                  <div key={index} className="w-24 h-24 overflow-hidden rounded-md border">
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
          
          {!aboutFiles.length && aboutData.images && aboutData.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Current Images:</p>
              <div className="flex space-x-4">
                {aboutData.images.map((image, index) => (
                  <div key={index} className="w-24 h-24 overflow-hidden rounded-md border">
                    <img
                      src={getImageUrl(image)}
                      alt={`about-image-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <FormInput
            label="Experience" id="experience"
            value={aboutData.experience}
            onChange={(e) => setAboutData({ ...aboutData, experience: e.target.value })}
          />
          
          {/* সার্ভিস */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Services</h3>
            <div className="mb-2">
              <p className="text-sm text-gray-500">Total Services: {aboutData.services?.length || 0}</p>
            </div>
            {(aboutData.services || []).map(renderService)}
            <button
              type="button"
              onClick={addService}
              className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <FaPlus /> Add Service
            </button>
          </div>
        </fieldset>
        
        {/* অ্যাপয়েন্টমেন্ট সেকশন */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">Appointment Section</legend>
          <ImageUpload
            id="appointmentImage"
            label="Appointment Image"
            file={appointmentFile}
            setFile={setAppointmentFile}
            currentImage={appointmentData.image}
          />
        </fieldset>
        
        {/* হোয়াই চুজ আস সেকশন */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">Why Choose Us Section</legend>
          <FormInput
            label="Title" id="whyChooseTitle"
            value={whyChooseData.title}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, title: e.target.value })}
          />
          <FormInput
            label="Subtitle" id="whyChooseSubtitle"
            value={whyChooseData.subtitle}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, subtitle: e.target.value })}
          />
          <FormTextarea
            label="Description" id="whyChooseDesc"
            value={whyChooseData.description}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, description: e.target.value })}
          />
          <ImageUpload
            id="whyChooseImage"
            label="Why Choose Us Image"
            file={whyChooseFile}
            setFile={setWhyChooseFile}
            currentImage={whyChooseData.image}
          />
          
          {/* সার্ভিস */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Why Choose Us Services</h3>
            <div className="mb-2">
              <p className="text-sm text-gray-500">Total Services: {whyChooseData.services.length}</p>
            </div>
            {whyChooseData.services.map(renderWhyChooseService)}
            <button
              type="button"
              onClick={addChooseService}
              className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <FaPlus /> Add Service
            </button>
          </div>
        </fieldset>
        
        {/* ডাউনলোড অ্যাপ সেকশন */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">Download App Section</legend>
          <FormInput
            label="Title" id="downloadTitle"
            value={downloadAppData.title}
            onChange={(e) => setDownloadAppData({ ...downloadAppData, title: e.target.value })}
          />
          <FormInput
            label="Subtitle" id="downloadSubtitle"
            value={downloadAppData.subtitle}
            onChange={(e) => setDownloadAppData({ ...downloadAppData, subtitle: e.target.value })}
          />
          <FormTextarea
            label="Description" id="downloadDesc"
            value={downloadAppData.description}
            onChange={(e) => setDownloadAppData({ ...downloadAppData, description: e.target.value })}
          />
          <ImageUpload
            id="downloadAppImage"
            label="App Image"
            file={downloadAppFile}
            setFile={setDownloadAppFile}
            currentImage={downloadAppData.image}
          />
        </fieldset>
        
        {/* অ্যাপয়েন্টমেন্ট প্রসেস সেকশন */}
        <fieldset className="border p-6 rounded-lg bg-gray-50">
          <legend className="text-xl font-semibold mb-4 text-gray-700">Appointment Process Section</legend>
          <div className="mb-2">
            <p className="text-sm text-gray-500">Total Steps: {appointmentProcessData.length}</p>
          </div>
          {appointmentProcessData.map(renderAppointmentProcess)}
          <button
            type="button"
            onClick={addAppointmentProcess}
            className="mt-4 text-blue-500 hover:text-blue-700 flex items-center gap-1"
          >
            <FaPlus /> Add Appointment Process
          </button>
        </fieldset>
        
        {/* সাবমিট বাটন */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-md shadow-lg text-white flex items-center justify-center ${
            isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          } transition duration-300 text-lg font-medium`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              {homepageExists ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{homepageExists ? `Update ${language} Content` : `Create ${language} Content`}</>
          )}
        </button>
      </form>
    </div>
  );
};

export default HomepageForm;