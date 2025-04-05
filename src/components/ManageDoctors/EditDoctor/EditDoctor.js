import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash, FaUserMd } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import slugify from "slugify";  // ✅ Import slugify for generating slugs
// React Skeleton for loading states
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// React Toastify for notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DynamicSelect from "../../DynamicSelect";
import PageHeading from "../../PageHeading";

/** 
 * Utility: Convert Bengali digits (০-৯) to English (0-9).
 * Example: "১২৩" -> "123"
 */
function convertBengaliToEnglish(str) {
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

const EditDoctor = ({isSearchable}) => {
  const { id } = useParams();
  console.log(id);
  
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["addDoctor"]);

  // Which language is chosen in the UI for multi-language fields
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [departments, setDepartments] = useState([]);
  // Full doctor data state
  const [doctorData, setDoctorData] = useState({
    metaTitle: { en: "", bn: "" },
    metaDescription:{ en: "", bn: "" },
    name: { en: "", bn: "" },
    email: "",
    slug: "",
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
    profilePhoto: "https://placehold.co/100",

    memberships: [{ name: "" }],
    awards: [{ title: "" }],
    treatments: [{ name: "" }],
    conditions: [{ name: "" }],
    schedule: [],
    faqs: [{ question: "", answer: "" }],
  });

  // Separate local states for dynamic arrays
  const [memberships, setMemberships] = useState([{ name: "" }]);
  const [awards, setAwards] = useState([{ title: "" }]);
  const [treatments, setTreatments] = useState([{ name: "" }]);
  const [conditions, setConditions] = useState([{ name: "" }]);
  const [schedules, setSchedules] = useState([]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // for submit button

  // File (profile photo) if you need actual file upload
  const [selectedFile, setSelectedFile] = useState(null);
   // ----------------------------------------------------------------
  //  A) Fetch departments list from backend whenever language changes
  // ----------------------------------------------------------------
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const lang = i18n.language; // "en" or "bn"
        const response = await axios.get(`https://api.muktihospital.com/api/department?lang=${lang}`, {
          headers: {
            "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
          },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("❌ Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, [i18n.language]);

  // --------------------------------------------------
  // 1. Fetch doctor data when component mounts or when language changes
  // --------------------------------------------------
  
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
  
        // দুইটা ভাষার ডেটা একসাথে আনো
        const [resEn, resBn] = await Promise.all([
          axios.get(`https://api.muktihospital.com/api/doctor/${id}?lang=en`, {
            headers: {
              "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            },
          }),
          axios.get(`https://api.muktihospital.com/api/doctor/${id}?lang=bn`, {
            headers: {
              "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            },
          }),
        ]);
  
        const doctorEn = resEn.data;
        const doctorBn = resBn.data;
  
        const generatedSlug =
          doctorEn.slug ||
          slugify(doctorEn.translations?.en?.name || "doctor", {
            lower: true,
            strict: true,
          });
  
        setDoctorData((prev) => ({
          ...prev,
          metaTitle: {
            en: doctorEn.translations?.metaTitle || "",
            bn: doctorBn.translations?.metaTitle || "",
          },
          metaDescription: {
            en: doctorEn.translations?.metaDescription || "",
            bn: doctorBn.translations?.metaDescription || "",
          },
          name: {
            en: doctorEn.translations?.name || "",
            bn: doctorBn.translations?.name || "",
          },
          email: doctorEn.email || "",
          slug: generatedSlug,
          contactNumber: {
            en: doctorEn.translations?.contactNumber || "",
            bn: doctorBn.translations?.contactNumber || "",
          },
          contactNumberSerial: {
            en: doctorEn.translations?.contactNumberSerial || "",
            bn: doctorBn.translations?.contactNumberSerial || "",
          },
          designation: {
            en: doctorEn.translations?.designation || "",
            bn: doctorBn.translations?.designation || "",
          },
          gender: {
            en: doctorEn.translations?.gender || "",
            bn: doctorBn.translations?.gender || "",
          },
          department: {
            en: doctorEn.translations?.department || "",
            bn: doctorBn.translations?.department || "",
          },
          shortBio: {
            en: doctorEn.translations?.shortBio || "",
            bn: doctorBn.translations?.shortBio || "",
          },
          academicQualification: {
            en: doctorEn.translations?.academicQualification || "",
            bn: doctorBn.translations?.academicQualification || "",
          },
          yearsOfExperience: {
            en: doctorEn.translations?.yearsOfExperience || "",
            bn: doctorBn.translations?.yearsOfExperience || "",
          },
          appointmentFee: {
            en: doctorEn.translations?.appointmentFee || "",
            bn: doctorBn.translations?.appointmentFee || "",
          },
          followUpFee: {
            en: doctorEn.translations?.followUpFee || "",
            bn: doctorBn.translations?.followUpFee || "",
          },
          patientAttended: {
            en: doctorEn.translations?.patientAttended || "",
            bn: doctorBn.translations?.patientAttended || "",
          },
          avgConsultationTime: {
            en: doctorEn.translations?.avgConsultationTime || "",
            bn: doctorBn.translations?.avgConsultationTime || "",
          },
          profilePhoto: doctorEn.icon || prev.icon,
        }));
  
        // Dynamic Arrays
        setMemberships(
          doctorEn.memberships?.map((m) => ({ name: m })) || [{ name: "" }]
        );
        setAwards(
          doctorEn.awards?.map((a) => ({ title: a })) || [{ title: "" }]
        );
        setTreatments(
          doctorEn.treatments?.map((t) => ({ name: t })) || [{ name: "" }]
        );
        setConditions(
          doctorEn.conditions?.map((c) => ({ name: c })) || [{ name: "" }]
        );
        setSchedules(doctorEn.schedule || []);
        setFaqs(doctorEn.faqs || [{ question: "", answer: "" }]);
      } catch (error) {
        console.error("❌ Error fetching doctor data:", error);
        toast.error("Failed to fetch doctor data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchDoctor();
  }, [id]);

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


  // --------------------------------------------------
  // 3. Multi-language text input handler
  // --------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    const lang = selectedLanguage;
    if (name === "slug") {
      setDoctorData((prev) => ({ ...prev, slug: value }));
    } else {
      setDoctorData((prev) => ({
        ...prev,
        [name]: { ...prev[name], [lang]: value },
        // Auto-update slug when name changes (always using English)
        ...(name === "name" && { slug: slugify(value, { lower: true, strict: true }) }),
      }));
    }
  };

    // Day Select
    const dayOptions = [
      { value: "Monday", label: "Monday" },
      { value: "Tuesday", label: "Tuesday" },
      { value: "Wednesday", label: "Wednesday" },
      { value: "Thursday", label: "Thursday" },
      { value: "Friday", label: "Friday" },
      { value: "Saturday", label: "Saturday" },
      { value: "Sunday", label: "Sunday" },
    ];
  // Profile photo change
  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        setDoctorData((prev) => ({ ...prev, icon: fileURL })); 
        setSelectedFile(file); // Storing file for upload
    }
};

  // --------------------------------------------------
  // Dynamic array (memberships, awards, treatments, conditions)
  // --------------------------------------------------
  const handleFieldChange = (index, value, list, setList, key = "name") => {
    const updated = list.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );
    setList(updated);
  };

  const handleAddField = (setList, fieldType) => {
    if (fieldType === "awards") {
      setList((prev) => [...prev, { title: "" }]);
    } else {
      // memberships, treatments, conditions
      setList((prev) => [...prev, { name: "" }]);
    }
  };

  const handleRemoveField = (index, list, setList) => {
    setList(list.filter((_, i) => i !== index));
  };

  // --------------------------------------------------
  // Schedule
  // --------------------------------------------------
  const handleAddSchedule = () => {
    setSchedules((prev) => [...prev, { day: "", startTime: "", endTime: "" }]);
  };

  const handleRemoveSchedule = (index) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = schedules.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setSchedules(updated);
  };

  // --------------------------------------------------
  // FAQ
  // --------------------------------------------------
  const handleAddFaq = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
  };

  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index, field, value) => {
    const updated = faqs.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFaqs(updated);
  };

  // --------------------------------------------------
  // 4. Submit data
  // --------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Convert Bengali digits to English for numeric fields
    const finalYearsOfExpEn = convertBengaliToEnglish(doctorData.yearsOfExperience.en || "");
    const finalYearsOfExpBn = convertBengaliToEnglish(doctorData.yearsOfExperience.bn || "");
    const finalAppointmentFeeEn = convertBengaliToEnglish(doctorData.appointmentFee.en || "");
    const finalAppointmentFeeBn = convertBengaliToEnglish(doctorData.appointmentFee.bn || "");
    const finalFollowUpFeeEn = convertBengaliToEnglish(doctorData.followUpFee.en || "");
    const finalFollowUpFeeBn = convertBengaliToEnglish(doctorData.followUpFee.bn || "");
    const finalPatientAttendedEn = convertBengaliToEnglish(doctorData.patientAttended.en || "");
    const finalPatientAttendedBn = convertBengaliToEnglish(doctorData.patientAttended.bn || "");
    const finalAvgTimeEn = convertBengaliToEnglish(doctorData.avgConsultationTime.en || "");
    const finalAvgTimeBn = convertBengaliToEnglish(doctorData.avgConsultationTime.bn || "");

    // Prepare JSON payload
    const payload = {
        ...doctorData,
        slug: doctorData.slug,  // Ensure slug remains in the update
        translations: {
            en: {
                metaTitle: doctorData.metaTitle.en,
                metaDescription: doctorData.metaDescription.en,
                name: doctorData.name.en,
                designation: doctorData.designation.en,
                department: doctorData.department.en,
                shortBio: doctorData.shortBio.en,
                contactNumber: doctorData.contactNumber.en,
                contactNumberSerial: doctorData.contactNumberSerial.en,
                gender: doctorData.gender.en,
                yearsOfExperience: finalYearsOfExpEn,
                appointmentFee: finalAppointmentFeeEn,
                followUpFee: finalFollowUpFeeEn,
                patientAttended: finalPatientAttendedEn,
                avgConsultationTime: finalAvgTimeEn,
                academicQualification: doctorData.academicQualification.en,
            },
            bn: {
                metaTitle: doctorData.metaTitle.bn,
                metaDescription: doctorData.metaDescription.bn,
                name: doctorData.name.bn,
                designation: doctorData.designation.bn,
                department: doctorData.department.bn,
                shortBio: doctorData.shortBio.bn,
                contactNumber: doctorData.contactNumber.bn,
                contactNumberSerial: doctorData.contactNumberSerial.bn,
                gender: doctorData.gender.bn,
                yearsOfExperience: finalYearsOfExpBn,
                appointmentFee: finalAppointmentFeeBn,
                followUpFee: finalFollowUpFeeBn,
                patientAttended: finalPatientAttendedBn,
                avgConsultationTime: finalAvgTimeBn,
                academicQualification: doctorData.academicQualification.bn,
            },
        },
        memberships,
        awards,
        treatments,
        conditions,
        schedule: schedules,
        faqs,
    };

    // Create FormData for sending JSON and file together
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));  // Attach JSON data
    if (selectedFile) {
        formData.append("profilePhoto", selectedFile);  // Attach file if exists
    }

    console.log("Submitting Payload:", payload);

    try {
        const response = await axios.put(`https://api.muktihospital.com/api/doctor/edit/${id}`, formData, {
            headers: {
                "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("Update Response:", response.data);
        toast.success("Doctor updated successfully!");
        navigate("/all-doctors");
    } catch (error) {
        console.error("Error updating doctor data:", error);
        toast.error("Failed to update doctor.");
    } finally {
        setSubmitting(false);
    }
};

console.log(doctorData);

  // --------------------------------------------------
  // 5. Loading skeleton
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          <Skeleton width={200} height={25} />
        </h2>
        <div className="flex flex-col gap-3">
          <Skeleton height={30} width={"80%"} />
          <Skeleton height={30} width={"60%"} />
          <Skeleton height={30} width={"40%"} />
          <Skeleton height={30} width={"70%"} />
        </div>
        <div className="mt-4 flex gap-4">
          <Skeleton circle width={60} height={60} />
          <Skeleton width={100} height={40} />
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Actual Render
  // --------------------------------------------------
  const breadcrumbs = [
    { label: "Dashboard", url: "/dashboard" },
    { label: "Manage Doctors", url: "/doctors" },
    { label: "Edit Doctor" },
  ];
  return (
    <div>
      <PageHeading title="Edit Doctor" breadcrumbs={breadcrumbs} />

      {/* <div className="bg-white shadow-lg rounded-lg p-6"> */}
         <div className="mb-4 flex justify-end">
            {/* Language selector */}
            <DynamicSelect
              options={languageOptions}
              onChange={handleLanguageChange}
              value={languageOptions.find(option => option.value === i18n.language)}
              isSearchable={isSearchable}
          />
         </div>
         <div className="min-h-screen">
        {/* Form */}
        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Basic info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
              <div className="bg-white shadow-sm rounded-lg">
                <div className="flex items-center justify-between border-b border-dashed border-M-text-color/50 p-4">
                    <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
                      Basic Information
                    </h2>
                </div>
                   {/* Meta Title */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
                <div>
                  <label className="label">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    className="input-field"
                    placeholder={t("enterDoctorName") || "Enter Meta  Title"}
                    value={doctorData.metaTitle[i18n.language] || ""}
                    onChange={handleChange}
                    disabled={submitting}
                  />
              </div>
              {/* Meta Description */}
              <div>
                <label className="label">Meta Description</label>
                <input
                  type="text"
                  name="metaDescription"
                  className="input-field"
                  placeholder={t("enterDoctorName") || "Enter Meta Description"}
                  value={doctorData.metaDescription[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
              {/* Name */}
              <div>
                  <label className="label">{t("doctorName")}</label>
                  {loading ? (
                    <Skeleton height={40} />
                  ) : (
                    <input
                      type="text"
                      name="name"
                      className="input-field"
                      placeholder={t("enterDoctorName") || "Enter Doctor Name"}
                      value={doctorData.name[i18n.language] || ""}
                      onChange={handleChange}
                      disabled={submitting}
                    />
                  )}
              </div>
              {/* Slug Field */}
              <div>
                <label className="label">Slug</label>
                <input type="text" name="slug" className="input-field" placeholder="Enter Slug" value={doctorData.slug} onChange={handleChange} disabled={submitting} />
              </div>
              {/* Email */}
              <div>
                <label className="label">{t("email")}</label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder={t("enterEmail") || "Enter Email"}
                  value={doctorData.email}
                  onChange={(e) =>
                    setDoctorData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  disabled={submitting}
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="label">{t("contactNumber")}</label>
                <input
                  type="text" // we can use type="text" to allow any language digits
                  name="contactNumber"
                  className="input-field"
                  placeholder={t("enterContactNumber") || "Enter Contact Number"}
                  value={doctorData.contactNumber[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* Contact Number Serial */}
              <div>
                <label className="label">{t("contactNumberSerial")}</label>
                <input
                  type="text"
                  name="contactNumberSerial"
                  className="input-field"
                  placeholder={
                    t("enterSerialContactNumber") || "Enter Serial Contact Number"
                  }
                  value={doctorData.contactNumberSerial[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* Designation */}
              <div>
                <label className="label">{t("designation")}</label>
                <input
                  type="text"
                  name="designation"
                  className="input-field"
                  placeholder={t("enterDesignation") || "Enter Designation"}
                  value={doctorData.designation[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="label">{t("gender")}</label>
                <select
                  name="gender"
                  className="input-field"
                  value={doctorData.gender[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                >
                  <option value="">{t("selectGender") || "Select Gender"}</option>
                  <option value="Male">{t("male") || "Male"}</option>
                  <option value="Female">{t("female") || "Female"}</option>
                  <option value="Other">{t("other") || "Other"}</option>
                </select>
              </div>
    
            {/* Department */}
            <div>
                <label className="label">{t("department")}</label>
                <select
                  name="department"
                  className="input-field"
                  value={doctorData.department[i18n.language] || ""}
                  onChange={handleChange}
                >
                  <option value="">{t("selectDepartment")}</option>
                  {departments.map((dep) => {
                    // Suppose each 'dep' has shape: { id, translations: { en: { name: ... }, bn: { name: ... } } }
                    // So the department name in the current language is dep.translations?.[i18n.language]?.name
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
                  type="text" // type="text" to allow Bangla digits
                  name="yearsOfExperience"
                  className="input-field"
                  placeholder={
                    t("yearsOfExperiencePlaceholder") || "Years of experience"
                  }
                  value={doctorData.yearsOfExperience[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* Appointment Fee */}
              <div>
                <label className="label">{t("appointmentFee")}</label>
                <input
                  type="text"
                  name="appointmentFee"
                  className="input-field"
                  value={doctorData.appointmentFee[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* FollowUpFee */}
              <div>
                <label className="label">{t("followUpFee")}</label>
                <input
                  type="text"
                  name="followUpFee"
                  className="input-field"
                  placeholder={t("followUpFee") || "Follow Up Fee"}
                  value={doctorData.followUpFee[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* academicQualification */}
              <div>
                <label className="label">{t("academicQualification")}</label>
                <input
                  type="text"
                  name="academicQualification"
                  className="input-field"
                  placeholder={
                    t("academicQualification") || "Academic Qualification"
                  }
                  value={
                    doctorData.academicQualification[i18n.language] || ""
                  }
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* patientAttended */}
              <div>
                <label className="label">{t("patientAttended")}</label>
                <input
                  type="text"
                  name="patientAttended"
                  className="input-field"
                  placeholder={t("patientAttended") || "Patient Attended"}
                  value={doctorData.patientAttended[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* avgConsultationTime */}
              <div>
                <label className="label">{t("avgConsultationTime")}</label>
                <input
                  type="text"
                  name="avgConsultationTime"
                  className="input-field"
                  placeholder={t("avgConsultationTime") || "Avg. Consultation Time"}
                  value={doctorData.avgConsultationTime[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              {/* shortBio */}
              <div>
                <label className="label">{t("shortBio")}</label>
                <textarea
                  name="shortBio"
                  className="input-field"
                  placeholder={t("shortBio") || "Short Bio"}
                  value={doctorData.shortBio[i18n.language] || ""}
                  onChange={handleChange}
                  disabled={submitting}
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
    {/* Header Labels */}
    {schedules.length > 0 && (
      <div className="hidden md:grid md:grid-cols-[1fr_1fr_1fr_20px] gap-4 mb-2 text-sm font-medium text-gray-600">
        <div>Day</div>
        <div>From Time</div>
        <div>To Time</div>
        <div></div>
      </div>
    )}

    {schedules.map((sch, index) => (
      <div
        key={index}
        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_20px] gap-4 items-center mb-4"
      >
        {/* Day select */}
        <DynamicSelect
          options={dayOptions}
          value={dayOptions.find((opt) => opt.value === sch.day)}
          onChange={(selectedOption) =>
            handleScheduleChange(index, "day", selectedOption?.value || "")
          }
          isSearchable={false}
        />

        {/* From time */}
        <input
          type="time"
          value={sch.startTime}
          onChange={(e) =>
            handleScheduleChange(index, "startTime", e.target.value)
          }
          className="p-2 border rounded-md w-full bg-gray-50 text-sm"
        />

        {/* To time */}
        <input
          type="time"
          value={sch.endTime}
          onChange={(e) =>
            handleScheduleChange(index, "endTime", e.target.value)
          }
          className="p-2 border rounded-md w-full bg-gray-50 text-sm"
        />

        {/* Remove */}
        <button
          type="button"
          onClick={() => handleRemoveSchedule(index)}
          className="text-red-500 hover:text-red-700 grid-cols-[50px]"
          title="Remove"
        >
          <FaTrash />
        </button>
      </div>
    ))}

    {/* Add Schedule Button */}
    <button
      type="button"
      onClick={handleAddSchedule}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm mt-4"
    >
      <FaPlus /> Add Schedule
    </button>
  </div>
          </div>

          {/* Profile Photo */}
          <div className="mt-6">
            <label className="label">{t("profilePhoto")}</label>
            <div className="relative w-24 h-24">
            <img
                src={`https://api.muktihospital.com${doctorData.profilePhoto}` || "https://placehold.co/100"} // Display icon here
                alt="Profile"
                className="rounded-full border shadow-md w-24 h-24 object-cover"
              />

              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                <FaEdit />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleProfilePhotoChange}
                  disabled={submitting}
                />
              </label>
            </div>
          </div>

          {/* Submit / Cancel buttons */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              className="bg-M-primary-color/90 text-sm text-white py-2 px-6 rounded-md hover:bg-M-primary-color transition-all duration-200"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : t("submit") || "Submit"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/doctor-list")}
              className="bg-[#E7633D]/90 text-sm text-white py-2 px-6 rounded-md hover:bg-[#E7633D] transition-all duration-30"
              disabled={submitting}
            >
              {t("Cancel") || "Cancel"}
            </button>
          </div>
          </div>
          </div>
        </form>

      {/* Toastify container for toasts */}
      <ToastContainer position="top-right" />
      </div>
    </div>
  );
};

export default EditDoctor;
