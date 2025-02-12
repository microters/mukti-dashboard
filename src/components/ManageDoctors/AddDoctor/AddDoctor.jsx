import React, { useState} from "react";
import { FaUserMd, FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AddDoctor = () => {
  const { t, i18n } = useTranslation(["addDoctor"]);
  const [profilePhoto, setProfilePhoto] = useState("https://placehold.co/100");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    contactNumberSerial: "",
    designation: "",
    gender: "",
    department: "",
    shortBio: "",
    academicqualifcation: "",
    yearexperiences: "",
    appointmentFee: "",
    followUpFee: "",
    patientAttended: "",
    avgConsultationTime: "",
    faqs: "",
  });

  // Dynamic Fields
  const [schedules, setSchedules] = useState([]);
  const [memberships, setMemberships] = useState([{ name: "" }]);
  const [awards, setAwards] = useState([{ title: "" }]);
  const [treatments, setTreatments] = useState([{ name: "" }]);
  const [conditions, setConditions] = useState([{ name: "" }]);
  const [faqs, setFaqs] = useState([{ question: "", answer: "" }]);

   // Handle Language Change
   const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Profile Photo Upload
  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        setProfilePhoto(fileURL);
        setFormData(prev => ({
            ...prev,
            profilePhoto: fileURL
        }));
    }
};

  const handleAddField = (setList, type) => {
    setList(prev => [...prev, type === "awards" ? { title: "" } : { name: "" }]);
  };

const handleRemoveField = (index, list, setList) => {
  setList(list.filter((_, i) => i !== index));
};

const handleFieldChange = (index, value, list, setList, type) => {
  const updatedList = list.map((item, i) => 
      i === index 
          ? (type === "awards" ? { ...item, title: value } : { ...item, name: value }) 
          : item
  );
  setList(updatedList);
};
  // Schedule for Appointment
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

  // Handle FAQ Input Change
const handleFaqChange = (index, field, value) => {
    const updatedFaqs = faqs.map((faq, i) =>
      i === index ? { ...faq, [field]: value } : faq
    );
    setFaqs(updatedFaqs);
  };
  
  // Add a new FAQ
  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };
  
  // Remove an FAQ
  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const doctorData = {
      ...formData,
      avgConsultationTime: `${formData.avgConsultationTime} mins`,
      yearsOfExperience: `${formData.yearexperiences} years`,
      profilePhoto: formData.profilePhoto,
      memberships: memberships,
      awardsAchievements: awards,
      treatmentsList: treatments,
      conditionsList: conditions,
      schedule: schedules,
      faqs: faqs,
    };
    console.log("Submitted Data:", doctorData);
  };

  // Reset Form
  const handleDiscard = () => {
    setFormData({
        name: "",
        email: "",
        contactNumber: "",
        contactNumberSerial: "",
        designation: "",
        gender: "",
        department: "",
        shortBio: "",
        academicqualifcation: "",
        yearexperiences: "",
        appointmentFee: "",
        followUpFee: "",
        patientAttended: "",
        avgConsultationTime: "",
        faqs: "",
    });
    setProfilePhoto("https://placehold.co/100");
    setSchedules([]);
    setMemberships([]);
    setAwards([]);
    setTreatments([]);
    setConditions([]);
    setFaqs([{ question: "", answer: "" }]); 
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className=" bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-700 flex items-center gap-2">
            <FaUserMd /> {t('addNewDoctor')}
            </h2>
            <p className="text-gray-500 text-sm mt-2">{t('description')}</p>
        </div>
         {/* Language switcher */}
         <div className="mb-4">
          <select
            className="p-2 border rounded-md"
            onChange={handleLanguageChange}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="bn">Bangla</option>
          </select>
        </div>
        </div>
        <form className="mt-6" onSubmit={handleSubmit}>
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="label">{t('doctorName')}</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Enter Doctor Name" />
            </div>

            {/* Email */}
            <div>
              <label className="label">{t('email')}</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="Enter Email" />
            </div>

            {/* Contact Numbers */}
            <div>
              <label className="label">{t('contactNumber')}</label>
              <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="input-field" placeholder="Enter Contact Number" />
            </div>
            <div>
              <label className="label">{t('contactNumberSerial')}</label>
              <input type="tel" name="contactNumberSerial" value={formData.contactNumberSerial} onChange={handleChange} className="input-field" placeholder="Enter Serial Contact Number" />
            </div>

            {/* Designation */}
            <div>
              <label className="label">{t('designation')}</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="input-field" placeholder="Enter Designation" />
            </div>
            {/* Gender (Dropdown) */}
            <div>
            <label className="label">{t('gender')}</label>
            <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input-field"
            >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            </div>
            {/* Department (Dropdown) */}
            <div>
              <label className="label">{t('department')}</label>
              <select name="department" value={formData.department} onChange={handleChange} className="input-field">
                <option value="">Select Department</option>
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
                name="yearexperiences"
                value={formData.yearexperiences}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter years of experience"
            />
            </div>
             {/* Appointment Fee */}
            <div>
              <label className="label">{t('appointmentFee')}</label>
              <input type="number" name="appointmentFee" value={formData.appointmentFee} onChange={handleChange} className="input-field" />
            </div>
            {/* Follow-Up Fee */}
            <div>
            <label className="label">{t('followUpFee')}</label>
            <input
                type="number"
                name="followUpFee"
                value={formData.followUpFee}
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
                value={formData.shortBio}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter a short bio"
            ></textarea>
            </div>
             {/* Academic Qualifications */}
             <div>
                <label className="label">
                   {t('academicQualification')}
                </label>
                <textarea 
                    name="academicqualifcation"
                    value={formData.academicqualifcation} 
                    onChange={handleChange} 
                    className="input-field"
                    placeholder="Enter academic qualifications"
                ></textarea>
                </div>

            <div>
              <label className="label">{t('patientAttended')}</label>
              <input type="number" name="patientAttended" value={formData.patientAttended} onChange={handleChange} className="input-field" />
            </div>

            <div>
              <label className="label">{t('avgConsultationTime')}</label>
              <input type="number" name="avgConsultationTime" value={formData.avgConsultationTime} onChange={handleChange} className="input-field" />
            </div>
             {/* Treatments List */}
            <div className="md:col-span-2">
                <label className="label">Treatments</label>
                {treatments.map((treatment, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                        <input
                            type="text"
                            value={treatment.name}
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
                <button
                    type="button"
                    onClick={() => handleAddField(setTreatments)}
                    className="mt-2 text-blue-500 hover:text-blue-700 flex items-center gap-1"
                >
                    <FaPlus /> Add Treatment
                </button>
            </div>
            {/* Memberships List */}
          <div className="md:col-span-2">
              <label className="label">Memberships</label>
              {memberships.map((membership, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                      <input
                          type="text"
                          value={membership.name}
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
              {awards.map((award, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                      <input
                          type="text"
                          value={award.title}
                          onChange={(e) => handleFieldChange(index, e.target.value, awards, setAwards, "awards")}
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
              {conditions.map((condition, index) => (
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
              {schedules.map((schedule, index) => (
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
            
            {faqs.map((faq, index) => (
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
          </div>

          {/* Profile Image Upload */}
          <div className="mt-6 flex flex-col">
            <div className="relative w-24 h-24">
              <img src={profilePhoto} alt="Profile" className="rounded-full border shadow-md" />
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer">
                <FaEdit />
                <input type="file" className="hidden" onChange={handleProfilePhotoChange} />
              </label>
            </div>
          </div>

          {/* Submit & Discard Buttons */}
          <div className="mt-6 flex gap-4">
            <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition">Submit</button>
            <button type="button" onClick={handleDiscard} className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition">Discard</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
