import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaPlus, FaTrash, FaUserMd } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["addDoctor"]);

  const [doctorData, setDoctorData] = useState({
    name: { en: "", bn: "" },
    email: "",
    contactNumber: { en: "", bn: "" },
    contactNumberSerial: { en: "", bn: "" },
    designation: { en: "", bn: "" },
    gender: { en: "", bn: "" },
    department: { en: "", bn: "" },
    shortBio: { en: "", bn: "" },
    academicQualification: { en: "", bn: "" },
    yearsOfExperience: { en: "", bn: "" },
    appointmentFee:{ en: "", bn: "" },
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  // Dynamic Fields for memberships, awards, etc.
  const [schedules, setSchedules] = useState([]);
  const [memberships, setMemberships] = useState([{ name: "" }]);
  const [awards, setAwards] = useState([{ title: "" }]);
  const [treatments, setTreatments] = useState([{ name: "" }]);
  const [conditions, setConditions] = useState([{ name: "" }]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);
  // Fetch doctor data for editing based on selected language
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/doctor/${id}?lang=${selectedLanguage}`,
          {
            headers: {
              "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079",
            },
          }
        );
        const doctor = response.data;
        
        setDoctorData({
          name: {
            en: doctor.translations?.name || "",
            bn: doctor.translations?.name || "",
          },
          email: doctor.email || "",
          contactNumber: {
            en: doctor.translations?.contactNumber || "",
            bn: doctor.translations?.contactNumber || "",
          },
          contactNumberSerial: {
            en: doctor.translations?.contactNumberSerial || "",
            bn: doctor.translations?.contactNumberSerial || "",
          },
          designation: {
            en: doctor.translations?.designation || "",
            bn: doctor.translations?.designation || "",
          },
          gender: {
            en: doctor.translations?.gender || "",
            bn: doctor.translations?.gender || "",
          },
          department: {
            en: doctor.translations?.department || "",
            bn: doctor.translations?.department || "",
          },
          shortBio: {
            en: doctor.translations?.shortBio || "",
            bn: doctor.translations?.shortBio || "",
          },
          academicQualification: {
            en: doctor.translations?.academicQualification || "",
            bn: doctor.translations?.academicQualification || "",
          },
          yearsOfExperience: {
            en: doctor.translations?.yearsOfExperience || "",
            bn: doctor.translations?.yearsOfExperience || "",
          },
          appointmentFee: {
            en: doctor.translations?.appointmentFee || "",
            bn: doctor.translations?.appointmentFee || "",
          },
          followUpFee: {
            en: doctor.translations?.followUpFee || "",
            bn: doctor.translations?.followUpFee || "",
          },
          patientAttended: {
            en: doctor.translations?.patientAttended || "",
            bn: doctor.translations?.patientAttended || "",
          },
          avgConsultationTime: {
            en: doctor.translations?.avgConsultationTime || "",
            bn: doctor.translations?.avgConsultationTime || "",
          },
          
         
         
          profilePhoto: doctor.profilePhoto || "https://placehold.co/100",
          memberships: doctor.memberships || [{ name: "" }],
          awards: doctor.awards || [{ title: "" }],
          treatments: doctor.treatments || [{ name: "" }],
          conditions: doctor.conditions || [{ name: "" }],
          schedule: doctor.schedule || [],
          faqs: doctor.faqs || [{ question: "", answer: "" }],
        });
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, selectedLanguage]);
console.log(doctorData);

  // Handle form field changes
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const language = selectedLanguage; // Selected language (either 'en' or 'bn')
  console.log(language);
  
    // Only update the selected language's data, without affecting the other language's data
    setDoctorData(prevData => ({
      ...prevData,
      translations: {
        ...prevData.translations,
        [language]: {
          ...prevData.translations[language], // Preserve the existing data for the selected language
          [name]: value, // Update the selected field (name, contactNumber, etc.)
        }
      }
    }));
  };
  
  
  
  // Handle language change
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setSelectedLanguage(selectedLang);  // Store the selected language
    i18n.changeLanguage(selectedLang);  // Change language using i18n
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setDoctorData({ ...doctorData, profilePhoto: fileURL });
      setSelectedFile(file);
    }
  };
    // Handle dynamic field changes
    const handleFieldChange = (index, value, list, setList, key = "name") => {
        const updatedList = list.map((item, i) =>
          i === index ? { ...item, [key]: value } : item
        );
        setList(updatedList);
      };
    
      // Add a new dynamic field (e.g., memberships, awards)
      const handleAddField = (setList, type) => {
        setList((prevList) => [...prevList, type === "awards" ? { title: "" } : { name: "" }]);
      };  
    
      // Remove dynamic field
      const handleRemoveField = (index, list, setList) => {
        setList(list.filter((_, i) => i !== index));
      };
    
      // Handle Schedule
      const handleAddSchedule = () => {
        setSchedules([...schedules, { day: "", startTime: "", endTime: "" }]);
      };
    
      const handleRemoveSchedule = (index) => {
        setSchedules(schedules.filter((_, i) => i !== index));
      };
    
      const handleScheduleChange = (index, field, value) => {
        const updatedSchedules = schedules.map((schedule, i) =>
          i === index ? { ...schedule, [field]: value } : schedule
        );
        setSchedules(updatedSchedules);
      };
    
      // Handle FAQ
      const handleFaqChange = (index, field, value) => {
        const updatedFaqs = faqs.map((faq, i) =>
          i === index ? { ...faq, [field]: value } : faq
        );
        setFaqs(updatedFaqs);
      };
    
      const handleAddFaq = () => {
        setFaqs([...faqs, { question: "", answer: "" }]);
      };
    
      const handleRemoveFaq = (index) => {
        setFaqs(faqs.filter((_, i) => i !== index));
      };
    
// Handle dynamic fields for Memberships
const handleAddMembership = () => {
    setMemberships([...memberships, { name: "" }]); // Add a new membership
  };
  
  const handleRemoveMembership = (index) => {
    setMemberships(memberships.filter((_, i) => i !== index)); // Remove a membership at index
  };
  
  const handleMembershipChange = (index, value) => {
    const updatedMemberships = [...memberships];
    updatedMemberships[index].name = value; // Update the membership name at index
    setMemberships(updatedMemberships);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...doctorData,
      profilePhoto: doctorData.profilePhoto || "",
      translations: {
        en: {
          name: doctorData.name.en,
          designation: doctorData.designation.en,
          department: doctorData.department.en,
          shortBio: doctorData.shortBio.en,
          contactNumber: doctorData.contactNumber.en,
          contactNumberSerial: doctorData.contactNumberSerial.en,
          gender: doctorData.gender.en,
          appointmentFee: doctorData.appointmentFee.en,
          followUpFee: doctorData.followUpFee.en,
          patientAttended: doctorData.patientAttended.en,
          avgConsultationTime: doctorData.avgConsultationTime.en,
        },
        bn: {
          name: doctorData.name.bn,
          designation: doctorData.designation.bn,
          department: doctorData.department.bn,
          shortBio: doctorData.shortBio.bn,
          contactNumber: doctorData.contactNumber.bn,
          contactNumberSerial: doctorData.contactNumberSerial.bn,
          gender: doctorData.gender.bn,
          appointmentFee: doctorData.appointmentFee.bn,
          followUpFee: doctorData.followUpFee.bn,
          patientAttended: doctorData.patientAttended.bn,
          avgConsultationTime: doctorData.avgConsultationTime.bn,
        },
      },
      memberships,
      awards,
      treatments,
      conditions,
      schedule: schedules,
      faqs,
    };

    try {
      const response = await axios.put(`http://localhost:5000/api/doctor/edit/${id}`, payload, {
        headers: { "x-api-key": "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079" },
      });
      alert("Doctor updated successfully!");
      navigate("/doctor-list");
    } catch (error) {
      console.error("Error updating doctor data:", error);
      alert("Failed to update doctor.");
    }
  };

  if (loading) return <p>Loading doctor data...</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
              <FaUserMd /> Edit Doctor
            </h2>
            <p className="text-gray-500 text-sm mt-2">Edit doctor details below.</p>
          </div>
          <div className="mb-4">
            <select
              className="p-2 border rounded-md"
              onChange={handleLanguageChange}
              value={selectedLanguage}
            >
              <option value="en">English</option>
              <option value="bn">Bangla</option>
            </select>
          </div>
        </div>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">{t('doctorName')}</label>
              <input
                type="text"
                name="name"
                value={doctorData.name[selectedLanguage] || ""}
                onChange={handleChange}
                className="input-field"
                placeholder={t('enterDoctorName')}
              />
            </div>
            <div>
              <label className="label">{t('email')}</label>
              <input
                type="email"
                name="email"
                value={doctorData.email}
                onChange={handleChange}
                className="input-field"
                placeholder={t('enterEmail')}
              />
            </div>
            <div>
              <label className="label">{t('contactNumber')}</label>
              <input
                type="tel"
                name="contactNumber"
                value={doctorData.contactNumber[selectedLanguage] || ""}
                onChange={handleChange}
                className="input-field"
                placeholder={t('enterContactNumber')}
              />
            </div>
            {/* Continue for other fields */}
            <div>
              <label className="label">{t('contactNumberSerial')}</label>
              <input type="tel" name="contactNumberSerial" 
               value={doctorData.contactNumberSerial[selectedLanguage] || ""}
              onChange={handleChange} className="input-field"
               placeholder={t('enterSerialContactNumber')} />
            </div>
            {/* Designation */}
            <div>
              <label className="label">{t('designation')}</label>
              <input type="text"
               name="designation"
               value={doctorData.designation[selectedLanguage] || ""}
                onChange={handleChange} className="input-field"
                 placeholder={t('enterDesignation')} />
            </div>
            
            {/* Gender (Dropdown) */}
            <div>
            <label className="label">{t('gender')}</label>
            <select
                name="gender"
                value={doctorData.gender[selectedLanguage] || ""}
                onChange={handleChange}
                className="input-field"
            >
                <option value="">{t('selectGender')}</option>
                <option value={t("male")}>{t('male')}</option>
                <option value={t("female")}>{t('female')}</option>
                <option value={t('other')}>{t('other')}</option>
            </select>
            </div>
            {/* Department (Dropdown) */}
            <div>
              <label className="label">{t('department')}</label>
              <select name="department" 
              value={doctorData.department[selectedLanguage] || ""} 
              onChange={handleChange} className="input-field">
                <option value="">{t('selectDepartment')}</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
                <option>Pediatrics</option>
              </select>
            </div>
             {/* Year of Experience */}
             <div>
            <label className="label">{t('yearsOfExperience')}</label>
            <input
                type="number"
                name="yearsOfExperience"
                value={doctorData.yearsOfExperience[selectedLanguage] || ""}
                onChange={handleChange}
                className="input-field"
                placeholder={t('yearsOfExperiencePlaceholder')}
            />
            </div>
             {/* Appointment Fee */}
             <div>
              <label className="label">{t('appointmentFee')}</label>
              <input type="number" name="appointmentFee" 
               value={doctorData.appointmentFee[selectedLanguage] || ""}
              className="input-field" />
            </div>
             {/* Follow-Up Fee */}
             <div>
            <label className="label">{t('followUpFee')}</label>
            <input
                type="number"
                name="followUpFee"
                value={doctorData.followUpFee[selectedLanguage] || ""}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter Follow-Up Fee"
            />
            </div>
            {/* Short Bio */}
            <div>
            <label className="label">{t('shortBio')}</label>
            <textarea
                name="shortBio"
                value={doctorData.shortBio[selectedLanguage] || ""}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter a short bio"
            ></textarea>
            </div>
                  {/* Treatments List */}
                        <div className="md:col-span-2">
                            <label className="label">Treatments</label>
                            {doctorData.treatments.map((treatment, index) => (
                                <div key={index} className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={treatment}
                                        onChange={(e) => handleFieldChange(index, e.target.value, treatments, setTreatments)}
                                        className="p-2 border rounded-md w-full"
                                        placeholder="Enter Treatment Name"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveField(index, treatments, setTreatments)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => handleAddField(setTreatments, "treatments")} className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"> <FaPlus /> Add Treatment</button>
                        </div>
                        {/* Memberships List */}
                      <div className="md:col-span-2">
                          <label className="label">Memberships</label>
                          {doctorData.memberships.map((membership, index) => (
                        
                            
                              <div key={index} className="flex gap-2 mt-2">
                                  <input
                                      type="text"
                                      value={membership}
                                      onChange={(e) => handleFieldChange(index, e.target.value, memberships, setMemberships)}
                                      className="p-2 border rounded-md w-full"
                                      placeholder="Enter Membership Name"
                                  />
                                  <button
                                      type="button"
                                      onClick={() => handleRemoveField(index, memberships, setMemberships)}
                                      className="text-red-500 hover:text-red-700"
                                  >
                                      <FaTrash />
                                  </button>
                              </div>
                          ))}
                          <button
                              type="button"
                              onClick={() => handleAddField(setMemberships)}
                              className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                          >
                              <FaPlus /> Add Membership
                          </button>
                      </div>
                         {/* Awards & Achievements */}
                      <div className="md:col-span-2">
                          <label className="label">Awards & Achievements</label>
                          {doctorData.awards.map((award, index) => (
                            <div key={index} className="flex gap-2 mt-2">
                              <input
                                type="text"
                                value={award.title} // The value of the input comes from the award object
                                onChange={(e) => handleFieldChange(index, e.target.value, awards, setAwards, "title")}
                                className="p-2 border rounded-md w-full"
                                placeholder="Enter Award Title"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveField(index, awards, setAwards)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                             ))}
                          <button
                              type="button"
                              onClick={() => handleAddField(setAwards, "awards")}
                              className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                          >
                              <FaPlus /> Add Award
                          </button>
                      </div>
                        {/* Conditions List */}
                      <div className="md:col-span-2">
                          <label className="label">Conditions Treated</label>
                          {doctorData?.conditions.map((condition, index) => (
                              <div key={index} className="flex gap-2 mt-2">
                                  <input
                                      type="text"
                                      value={condition.name}
                                      onChange={(e) => handleFieldChange(index, e.target.value, conditions, setConditions)}
                                      className="p-2 border rounded-md w-full"
                                      placeholder="Enter Condition Name"
                                  />
                                  <button
                                      type="button"
                                      onClick={() => handleRemoveField(index, conditions, setConditions)}
                                      className="text-red-500 hover:text-red-700"
                                  >
                                      <FaTrash />
                                  </button>
                              </div>
                          ))}
                          <button
                              type="button"
                              onClick={() => handleAddField(setConditions)}
                              className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                          >
                              <FaPlus /> Add Condition
                          </button>
                      </div>
                         {/* Schedule for Appointment */}
                         <div className="md:col-span-2">
                          <label className="label">Schedule for Appointment</label>
                          {doctorData?.schedules?.map((schedule, index) => (
                            <div key={index} className="flex items-center gap-3 mt-2">
                              {/* Select Day */}
                              <select
                                value={schedule.day}
                                onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
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
            
                              {/* Start Time */}
                              <input
                                type="time"
                                value={schedule.startTime}
                                onChange={(e) => handleScheduleChange(index, "startTime", e.target.value)}
                                className="p-2 border rounded-md"
                              />
            
                              {/* End Time */}
                              <input
                                type="time"
                                value={schedule.endTime}
                                onChange={(e) => handleScheduleChange(index, "endTime", e.target.value)}
                                className="p-2 border rounded-md"
                              />
            
                              {/* Remove Button */}
                              <button type="button" onClick={() => handleRemoveSchedule(index)} className="text-red-500 hover:text-red-700">
                                <FaTrash />
                              </button>
                            </div>
                          ))}
            
                          {/* Add Schedule Button */}
                          <button type="button" onClick={handleAddSchedule} className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1">
                            <FaPlus /> Add Schedule
                          </button>
                        </div>
            
                        {/* FAQ Section */}
                        <div className="md:col-span-2">
                        <label className="label">FAQs</label>
                        
                        {doctorData?.faqs?.map((faq, index) => (
                            <div key={index} className="relative border p-4 rounded-md shadow-sm mt-3 bg-white">
                            
                            {/* Delete FAQ Button */}
                            <button
                                type="button"
                                onClick={() => handleRemoveFaq(index)}
                                className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                            >
                                <FaTrash />
                            </button>
            
                            {/* FAQ Question Input */}
                            <label className="label">Question</label>
                            <input
                                type="text"
                                placeholder="Enter FAQ Question"
                                value={faq.question}
                                onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                                className="p-2 border rounded-md w-full mt-1"
                            />
            
                            {/* FAQ Answer Textarea */}
                            <label className="label mt-3">Answer</label>
                            <textarea
                                placeholder="Enter FAQ Answer"
                                value={faq.answer}
                                onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                                className="p-2 border rounded-md w-full mt-1 h-24"
                            />
                            
                            </div>
                        ))}
            
                        {/* Add FAQ Button */}
                        <button
                            type="button"
                            onClick={handleAddFaq}
                            className="mt-3 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                            <FaPlus /> Add FAQ
                        </button>
                        </div>
            <div>
              <label className="label">{t('profilePhoto')}</label>
              <img
                src={doctorData.profilePhoto}
                alt="Profile"
                className="rounded-full border shadow-md"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                <FaEdit />
                <input type="file" className="hidden" onChange={handleProfilePhotoChange} />
              </label>
            </div>

            <div className="mt-6 flex gap-4">
              <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition">
                Submit
              </button>
              <button
                type="button"
                onClick={() => navigate("/doctor-list")}
                className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctor;
