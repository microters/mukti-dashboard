import React, { useState, useEffect, useRef } from "react";
import { FiEdit2, FiSave } from "react-icons/fi";
import PageHeading from "../../PageHeading";
import LanguageSelect from "../../LanguageSelect";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import RichTextEditor from "../../RichTextEditor";

const AddPage = ({isSearchable }) => {

  // ✅ State for form data
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    translations: {
      en: { metaTitle: "", metaDescription: "", content: "" },
      bn: { metaTitle: "", metaDescription: "",  content: "" },
    },
  });

  // ✅ Language state
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("en");
  const [isSlugEditable, setIsSlugEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // ✅ Auto-generate slug when name changes
  useEffect(() => {
    if (!isSlugEditable) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");
  
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  }, [formData.name, isSlugEditable]);
  

  const handleSlugEditToggle = () => {
    setIsSlugEditable((prev) => !prev);
  };

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: { ...prev.translations[language], [name]: value },
      },
    }));
  };

  // ✅ Handle slug change manually
  const handleSlugChange = (e) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  // ✅ Handle content change
  const handleContentChange = (newContent) => {
    const cleanedContent = newContent.replace(/<!DOCTYPE[^>]*>/gi, "");
    setFormData((prev) => ({
      ...prev,
      translations: {
        ...prev.translations,
        [i18n.language]: {
          ...prev.translations[i18n.language],
          content: cleanedContent,
        },
      },
    }));
  };

  // ----------------------------------------------------------------
  //  B) Language Switch (English <-> Bangla)
  // ----------------------------------------------------------------
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'Bangla' },
  ];

  const handleLanguageChange = (selectedOption) => {
    i18n.changeLanguage(selectedOption.value);
  };

  const breadcrumbs = [
    { label: "Dashboard", url: "/dashboard" },
    { label: "Manage Pages", url: "/manage-pages" },
    { label: "Add New Page" },
  ];
  

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("https://api.muktihospital.com/api/page/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079", // Replace with actual API key
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create page");
      }

      setMessage("Page created successfully!");
      setFormData({
        name: "",
        slug: "",
        translations: {
          en: { metaTitle: "", metaDescription: "",  content: "" },
          bn: { metaTitle: "", metaDescription: "", content: "" },
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentTranslation = formData.translations[i18n.language] || { content: "" };

  return (
    <div>
      <PageHeading title="Add New Page" breadcrumbs={breadcrumbs} />

      {message && <p className="text-green-600 bg-green-100 p-3 rounded">{message}</p>}
      {error && <p className="text-red-600 bg-red-100 p-3 rounded">{error}</p>}

       {/* Language switcher */}
       <div className="mb-4 flex justify-end">
       <LanguageSelect
          options={languageOptions}
          onChange={handleLanguageChange}
          value={languageOptions.find(option => option.value === i18n.language)}
          isSearchable={isSearchable}
      />
          </div>

      <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-2 gap-6 items-start">
           <div className="bg-white shadow-sm rounded-lg">
           <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                  <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                    Basic Information
                  </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
              {/* ✅ Page Name */}
          <div>
            <label className="label">{t("pageName")}</label>
            {loading ? (
                <Skeleton height={40} />
              ) : (
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="Enter Page Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              )}
          </div>
          {/* ✅ Slug */}
          <div>
            <label className="label">{t("slug")} ({t("editable")})</label>
            <div className="flex items-center gap-2">
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              className="input-field flex-1"
              readOnly={!isSlugEditable}
            />
            <button
              type="button"
              onClick={handleSlugEditToggle}
              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
              title={isSlugEditable ? "Save Slug" : "Edit Slug"}
            >
              {isSlugEditable ? <FiSave className="w-5 h-5" /> : <FiEdit2 className="w-5 h-5" />}
            </button>
            </div>
          </div>
            </div>
             {/* ✅ Content Editor */}
            <div className="px-5 mb-5">
              <label className="label">{t("content")}</label>
              <RichTextEditor
                value={currentTranslation.content}
                onChange={handleContentChange}
              />
            </div>
           </div>
        <div>
            {/* SEO Configuration */}
         <div className="bg-white shadow-sm rounded-lg">
             <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  SEO Configuration
                </h2>
              </div>
            <div className="p-5 grid grid-cols-2 gap-6">
              {/* Meta Title */}
          <div>
            <label className="label">{t("metaTitle")}</label>
            <input
              type="text"
              name="metaTitle"
              className="input-field"
              placeholder="Enter Meta Title"
              value={formData.translations[i18n.language].metaTitle || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="label">{t("metaDescription")}</label>
            <input
              type="text"
              name="metaDescription"
              className="input-field"
              placeholder="Enter Meta Description"
              value={formData.translations[i18n.language].metaDescription || ""}
              onChange={handleInputChange}
            />
          </div>
            </div>
          </div>
              {/* Submit */}
         <div className="mt-6 flex gap-4 justify-end">
              <button
                type="submit"
                className="bg-M-primary-color/90 text-sm text-white py-2 px-6 rounded-md hover:bg-M-primary-color transition-all duration-200"
                disabled={loading}
              >
                Submit
              </button>
            </div>
        </div>
         </div>
      </form>
    </div>
  );
};

export default AddPage;