import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash, FaUserMd } from "react-icons/fa";
import Select from 'react-select';
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { toast, ToastContainer } from "react-toastify";
import slugify from "slugify"; // ✅ Import slugify for generating slugs
import ImageUploader from "../../ImageUploader";
import PageHeading from "../../PageHeading";
// Example utility: Convert Bengali digits (০-৯) to English (0-9)
function convertBengaliToEnglish(str = "") {
  const map = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return str.replace(/[০-৯]/g, (digit) => map[digit]);
}

const AddDoctor = () => {
  const { t, i18n } = useTranslation(["addDoctor"]);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // 1) Profile photo state
  // -----------------------------
  const [profilePhoto, setProfilePhoto] = useState("https://placehold.co/100");
  const [selectedFile, setSelectedFile] = useState(null);

  // -----------------------------
  // 2) Department list from API
  // -----------------------------
  const [departments, setDepartments] = useState([]);

  // -----------------------------
  // 3) Multi-language form data
  // (Each field can be { en: "", bn: "" }) plus single-language fields
  // -----------------------------
  const [formData, setFormData] = useState({
    metaTitle: { en: "", bn: "" },
    metaDescription: { en: "", bn: "" },
    name: { en: "", bn: "" },
    slug: "",
    email: "",
    profilePhoto: "",
    contactNumber: { en: "", bn: "" },
    contactNumberSerial: { en: "", bn: "" },
    designation: { en: "", bn: "" },
    gender: { en: "", bn: "" },
    department: { en: "", bn: "" },
    shortBio: { en: "", bn: "" },
    academicQualification: { en: "", bn: "" },
    yearsOfExperience: { en: "", bn: "" },
    appointmentFee: { en: "", bn: "" },
    followUpFee: { en: "", bn: "" },
    patientAttended: { en: "", bn: "" },
    avgConsultationTime: { en: "", bn: "" },
  });

  // -----------------------------
  // 4) Dynamic fields
  // -----------------------------
  const [schedules, setSchedules] = useState([]);
  const [memberships, setMemberships] = useState([{ name: "" }]);
  const [awards, setAwards] = useState([{ title: "" }]);
  const [treatments, setTreatments] = useState([{ name: "" }]);
  const [conditions, setConditions] = useState([{ name: "" }]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  // ----------------------------------------------------------------
  //  A) Fetch departments list from backend whenever language changes
  // ----------------------------------------------------------------
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const lang = i18n.language; // "en" or "bn"
        const response = await axios.get(
          `https://api.muktihospital.com/api/department?lang=${lang}`,
          {
            headers: {
              "x-api-key":
                "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            },
          }
        );

        setDepartments(response.data);
      } catch (error) {
        console.error("❌ Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [i18n.language]);
  console.log(departments);

  // ----------------------------------------------------------------
  //  B) Language Switch (English <-> Bangla)
  // ----------------------------------------------------------------
  const handleLanguageChange = (selectedOption) => {
    i18n.changeLanguage(selectedOption.value);  // Update language based on selected value
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'bn', label: 'Bangla' }
  ];

  useEffect(() => {
    if (formData.name.en) {
      const generatedSlug = slugify(formData.name.en, {
        lower: true,
        strict: true,
      });
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  }, [formData.name.en]); // Auto-generate slug when English name is updated

  // ✅ Handle slug change (if user edits manually)
  const handleSlugChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      slug: slugify(e.target.value, { lower: true, strict: true }),
    }));
  };
  // ----------------------------------------------------------------
  //  C) Handle form input changes
  // ----------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    // If field is multi-language object, update the current language only
    if (formData[name] && typeof formData[name] === "object") {
      setFormData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          [i18n.language]: value,
        },
      }));
    } else {
      // Single-language
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // ----------------------------------------------------------------
  //  D) Profile photo
  // ----------------------------------------------------------------

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setProfilePhoto(fileURL);
      setSelectedFile(file);
    }
  };

  // ----------------------------------------------------------------
  //  E) Dynamic Fields (memberships, awards, treatments, conditions)
  // ----------------------------------------------------------------
  const handleFieldChange = (index, value, list, setList, key = "name") => {
    const updatedList = list.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setList(updatedList);
  };

  const handleAddField = (setList, type) => {
    // For "awards" => { title: "" }, else => { name: "" }
    setList((prev) => [
      ...prev,
      type === "awards" ? { title: "" } : { name: "" },
    ]);
  };

  const handleRemoveField = (index, list, setList) => {
    setList(list.filter((_, i) => i !== index));
  };

  // Schedules
  const handleAddSchedule = () => {
    setSchedules((prev) => [...prev, { day: "", startTime: "", endTime: "" }]);
  };
  const handleRemoveSchedule = (index) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };
  const handleScheduleChange = (index, field, value) => {
    const updated = schedules.map((sch, i) =>
      i === index ? { ...sch, [field]: value } : sch
    );
    setSchedules(updated);
  };

  // FAQs
  const handleFaqChange = (index, field, value) => {
    const updated = faqs.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setFaqs(updated);
  };
  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };
  const handleRemoveFaq = (index) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // ----------------------------------------------------------------
  //  F) Submit form
  // ----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convert Bengali digits to English for numeric fields
    const finalYearsEn = convertBengaliToEnglish(
      formData.yearsOfExperience.en || ""
    );
    const finalYearsBn = convertBengaliToEnglish(
      formData.yearsOfExperience.bn || ""
    );
    const finalAppFeeEn = convertBengaliToEnglish(
      formData.appointmentFee.en || ""
    );
    const finalAppFeeBn = convertBengaliToEnglish(
      formData.appointmentFee.bn || ""
    );
    const finalFollowUpEn = convertBengaliToEnglish(
      formData.followUpFee.en || ""
    );
    const finalFollowUpBn = convertBengaliToEnglish(
      formData.followUpFee.bn || ""
    );
    const finalPatientEn = convertBengaliToEnglish(
      formData.patientAttended.en || ""
    );
    const finalPatientBn = convertBengaliToEnglish(
      formData.patientAttended.bn || ""
    );
    const finalAvgEn = convertBengaliToEnglish(
      formData.avgConsultationTime.en || ""
    );
    const finalAvgBn = convertBengaliToEnglish(
      formData.avgConsultationTime.bn || ""
    );

    // 1. Create FormData object
    const formDataToSend = new FormData();

    // 2. Append icon if selected
    if (selectedFile) {
      formDataToSend.append("profilePhoto", selectedFile); // Sending `profilePhoto` key but it will be stored as `icon` in backend
    }

    // 3. Append other form data
    formDataToSend.append(
      "data",
      JSON.stringify({
        email: formData.email,
        slug: formData.slug, // ✅ Sending slug to backend
        translations: {
          en: {
            metaTitle: formData.metaTitle.en,
            metaDescription: formData.metaDescription.en,
            name: formData.name.en,
            contactNumber: formData.contactNumber.en,
            contactNumberSerial: formData.contactNumberSerial.en,
            designation: formData.designation.en,
            gender: formData.gender.en,
            department: formData.department.en,
            shortBio: formData.shortBio.en,
            yearsOfExperience: finalYearsEn,
            appointmentFee: finalAppFeeEn,
            followUpFee: finalFollowUpEn,
            patientAttended: finalPatientEn,
            avgConsultationTime: finalAvgEn,
            academicQualification: formData.academicQualification.en,
          },
          bn: {
            metaTitle: formData.metaTitle.bn,
            metaDescription: formData.metaDescription.bn,
            name: formData.name.bn,
            contactNumber: formData.contactNumber.bn,
            contactNumberSerial: formData.contactNumberSerial.bn,
            designation: formData.designation.bn,
            gender: formData.gender.bn,
            department: formData.department.bn,
            shortBio: formData.shortBio.bn,
            yearsOfExperience: finalYearsBn,
            appointmentFee: finalAppFeeBn,
            followUpFee: finalFollowUpBn,
            patientAttended: finalPatientBn,
            avgConsultationTime: finalAvgBn,
          },
        },
        memberships,
        awards,
        treatments,
        conditions,
        schedule: schedules,
        faqs,
      })
    );

    try {
      const response = await axios.post(
        "https://api.muktihospital.com/api/doctor/add",
        formDataToSend, // Sending FormData with `icon`
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct header for file uploads
            "x-api-key":
              "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079", // Your API key
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("✅ Doctor added successfully!"); // Show success message
        handleDiscard(); // Reset form after submission
      } else {
        toast.error(
          `❌ Failed to add doctor: ${response.data?.message || "Error"}`
        ); // Show error message
      }
    } catch (error) {
      console.error("❌ Error submitting doctor data:", error);
      toast.error("An error occurred while adding the doctor."); // Show error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // ----------------------------------------------------------------
  //  G) Discard form
  // ----------------------------------------------------------------
  const handleDiscard = () => {
    setFormData({
      metaTitle: { en: "", bn: "" },
      metaDescription: { en: "", bn: "" },
      name: { en: "", bn: "" },
      slug: "",
      email: "",
      contactNumber: { en: "", bn: "" },
      contactNumberSerial: { en: "", bn: "" },
      designation: { en: "", bn: "" },
      gender: { en: "", bn: "" },
      department: { en: "", bn: "" },
      shortBio: { en: "", bn: "" },
      academicQualification: { en: "", bn: "" },
      yearsOfExperience: { en: "", bn: "" },
      appointmentFee: { en: "", bn: "" },
      followUpFee: { en: "", bn: "" },
      patientAttended: { en: "", bn: "" },
      avgConsultationTime: { en: "", bn: "" },
    });
    setProfilePhoto("https://placehold.co/100");
    setSelectedFile(null);
    setSchedules([]);
    setMemberships([{ name: "" }]);
    setAwards([{ title: "" }]);
    setTreatments([{ name: "" }]);
    setConditions([{ name: "" }]);
    setFaqs([{ question: "", answer: "" }]);
  };

  // ----------------------------------------------------------------
  //  Render
  // ----------------------------------------------------------------

  const breadcrumbs = [
    { label: "Dashboard", url: "/dashboard" },
    { label: "Manage Doctors", url: "/doctors" },
    { label: "Add New Doctor" },
  ];
  return (
    <div>
      <PageHeading title="Add New Doctor" breadcrumbs={breadcrumbs} />
       {/* Language switcher */}
       <div className="mb-4 flex justify-end">
       <Select
          options={languageOptions}
          onChange={handleLanguageChange}
          value={languageOptions.find(option => option.value === i18n.language)}
          className="react-select-container"
          classNamePrefix="react-select"
          isSearchable={false}
          styles={{
            control: (provided) => ({
              ...provided,
              borderColor: '#e2e8f0',
              fontSize: '14px',
              backgroundColor: '#f7fafc',
            }),
            option: (provided, state) => ({
              ...provided,
              fontSize: '14px',
              backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#ebf8ff' : 'transparent',
              color: state.isSelected ? '#ffffff' : '#2d3748',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: "0px"
            }),
          }}
      />
          </div>
      <div className="min-h-screen">
        {/* Header */}
       
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 items-start">
            <div>
              <div className="bg-white shadow-sm rounded-lg">
                <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                  <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                    Basic Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
                  {/* Meta Title */}
                <div>
                  <label className="label">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    className="input-field"
                    placeholder="Enter Meta Title"
                    value={formData.metaTitle[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <label className="label">Meta Description</label>
                  <input
                    type="text"
                    name="metaDescription"
                    className="input-field"
                    placeholder="Enter Meta Description"
                    value={formData.metaDescription[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Doctor Name */}
                <div>
                  <label className="label">{t("doctorName")}</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="text"
                      name="name"
                      className="input-field"
                      placeholder="Enter Doctor Name"
                      value={formData.name[i18n.language] || ""}
                      onChange={handleChange}
                    />
                  )}
                </div>
                {/* Slug Field */}
                <div>
                  <label className="label">Slug (Editable)</label>
                  <input
                    type="text"
                    name="slug"
                    className="input-field"
                    placeholder="Enter Slug"
                    value={formData.slug}
                    onChange={handleSlugChange}
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="label">{t("email")}</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="email"
                      name="email"
                      className="input-field"
                      placeholder="Enter Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  )}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="label">{t("contactNumber")}</label>
                  <input
                    type="text"
                    name="contactNumber"
                    className="input-field"
                    placeholder="Enter Contact Number"
                    value={formData.contactNumber[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Contact Number Serial */}
                <div>
                  <label className="label">{t("contactNumberSerial")}</label>
                  <input
                    type="text"
                    name="contactNumberSerial"
                    className="input-field"
                    placeholder="Enter Serial Contact Number"
                    value={formData.contactNumberSerial[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="label">{t("designation")}</label>
                  <input
                    type="text"
                    name="designation"
                    className="input-field"
                    placeholder="Enter Designation"
                    value={formData.designation[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Gender (Dropdown) */}
                <div>
                  <label className="label">{t("gender")}</label>
                  <select
                    name="gender"
                    className="input-field"
                    value={formData.gender[i18n.language] || ""}
                    onChange={handleChange}
                  >
                    <option value="">{t("selectGender")}</option>
                    <option value={t("male")}>{t("male")}</option>
                    <option value={t("female")}>{t("female")}</option>
                    <option value={t("other")}>{t("other")}</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="label">{t("department")}</label>
                  <select
                    name="department"
                    className="input-field"
                    value={formData.department[i18n.language] || ""}
                    onChange={handleChange}
                  >
                    <option value="">{t("selectDepartment")}</option>
                    {departments.map((dep) => {
                      const depName =
                        dep.translations?.[i18n.language]?.name ||
                        dep.translations?.en?.name ||
                        "Unnamed Dept";

                      return (
                        <option key={dep.id} value={depName}>
                          {depName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Years of Experience */}
                <div>
                  <label className="label">{t("yearsOfExperience")}</label>
                  <input
                    type="text"
                    name="yearsOfExperience"
                    className="input-field"
                    placeholder="Enter years of experience"
                    value={formData.yearsOfExperience[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Appointment Fee */}
                <div>
                  <label className="label">{t("appointmentFee")}</label>
                  <input
                    type="text"
                    name="appointmentFee"
                    className="input-field"
                    value={formData.appointmentFee[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Follow-Up Fee */}
                <div>
                  <label className="label">{t("followUpFee")}</label>
                  <input
                    type="text"
                    name="followUpFee"
                    className="input-field"
                    placeholder="Enter Follow-Up Fee"
                    value={formData.followUpFee[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* patientAttended */}
                <div>
                  <label className="label">{t("patientAttended")}</label>
                  <input
                    type="text"
                    name="patientAttended"
                    className="input-field"
                    value={formData.patientAttended[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Short Bio */}
                <div>
                  <label className="label">{t("shortBio")}</label>
                  <textarea
                    name="shortBio"
                    className="input-field"
                    placeholder="Enter a short bio"
                    value={formData.shortBio[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* Academic Qualifications */}
                <div>
                  <label className="label">{t("academicQualification")}</label>
                  <textarea
                    name="academicQualification"
                    className="input-field"
                    placeholder="Enter academic qualifications"
                    value={formData.academicQualification[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>

                {/* avgConsultationTime */}
                <div>
                  <label className="label">{t("avgConsultationTime")}</label>
                  <input
                    type="text"
                    name="avgConsultationTime"
                    className="input-field"
                    value={formData.avgConsultationTime[i18n.language] || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            {/* FAQs */}
            <div className="bg-white shadow-sm rounded-lg mt-5">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  FAQs
                </h2>
              </div>
              <div className="p-5">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="relative border p-4 rounded-md shadow-sm mt-3 bg-white"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>

                    <label className="label">Question</label>
                    <input
                      type="text"
                      placeholder="Enter FAQ Question"
                      value={faq.question}
                      onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                      className="input-field"
                    />

                    <label className="label mt-3">Answer</label>
                    <textarea
                      placeholder="Enter FAQ Answer"
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                      className="input-field"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="add-button"
                >
                  <FaPlus /> Add FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          {/* <div className="mt-6 flex flex-col">
              <div className="relative w-24 h-24">
              <img
    src={formData.icon || "https://placehold.co/100"}  // Ensure 'icon' field is used
    alt="Profile"
    className="rounded-full border shadow-md"
  />

                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                  <FaEdit />
                  <input type="file" className="hidden" onChange={handleProfilePhotoChange} />
                </label>
              </div>
            </div> */}
          <div>
            {/* Treatments List */}
            <div className="bg-white shadow-sm rounded-lg">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  Treatments
                </h2>
              </div>
              <div className="p-5">
                {treatments.map((treatment, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={treatment.name}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          e.target.value,
                          treatments,
                          setTreatments
                        )
                      }
                      className="input-field"
                      placeholder="Enter Treatment Name"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveField(index, treatments, setTreatments)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField(setTreatments, "treatments")}
                  className="add-button"
                >
                  <FaPlus /> Add Treatment
                </button>
              </div>
            </div>

            {/* Memberships List */}
            <div className="bg-white shadow-sm rounded-lg mt-5">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  Memberships
                </h2>
              </div>
              <div className="p-5">
                {memberships.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          e.target.value,
                          memberships,
                          setMemberships
                        )
                      }
                      className="input-field"
                      placeholder="Enter Membership Name"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveField(index, memberships, setMemberships)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField(setMemberships, "memberships")}
                  className="add-button"
                >
                  <FaPlus /> Add Membership
                </button>
              </div>
            </div>

            {/* Awards */}
            <div className="bg-white shadow-sm rounded-lg mt-5">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  Awards & Achievements
                </h2>
              </div>
              <div className="p-5">
                {awards.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          e.target.value,
                          awards,
                          setAwards,
                          "title"
                        )
                      }
                      className="input-field"
                      placeholder="Enter Award Title"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveField(index, awards, setAwards)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField(setAwards, "awards")}
                  className="add-button"
                >
                  <FaPlus /> Add Award
                </button>
              </div>
            </div>

            {/* Conditions */}
            <div className="bg-white shadow-sm rounded-lg mt-5">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  Conditions Treated
                </h2>
              </div>
              <div className="p-5">
                {conditions.map((item, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          e.target.value,
                          conditions,
                          setConditions
                        )
                      }
                      className="input-field"
                      placeholder="Enter Condition Name"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveField(index, conditions, setConditions)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField(setConditions, "conditions")}
                  className="add-button"
                >
                  <FaPlus /> Add Condition
                </button>
              </div>
            </div>

            {/* Schedules */}
            <div className="bg-white shadow-sm rounded-lg mt-5">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  Schedule for Appointment
                </h2>
              </div>
              <div className="p-5">
                {schedules.map((sch, index) => (
                  <div key={index} className="flex items-center gap-3 mt-2">
                    <select
                      value={sch.day}
                      onChange={(e) =>
                        handleScheduleChange(index, "day", e.target.value)
                      }
                      className="p-2 border rounded-md"
                    >
                      <option value="">Select Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>

                    <input
                      type="time"
                      value={sch.startTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "startTime", e.target.value)
                      }
                      className="p-2 border rounded-md"
                    />
                    <input
                      type="time"
                      value={sch.endTime}
                      onChange={(e) =>
                        handleScheduleChange(index, "endTime", e.target.value)
                      }
                      className="p-2 border rounded-md"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveSchedule(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddSchedule}
                  className="add-button"
                >
                  <FaPlus /> Add Schedule
                </button>
              </div>
            </div>

            {/* Image Uploader */}
            <div className="bg-white shadow-sm rounded-lg mt-5">
              <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                  Upload Profile Photo
                </h2>
              </div>
              <div className="p-5">
                <ImageUploader />
              </div>
            </div>
            {/* Submit & Discard */}
            <div className="mt-6 flex gap-4 justify-end">
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </form>
      {/* Toast container to show messages */}
      <ToastContainer />
      </div>
    </div>
  );
};

export default AddDoctor;
