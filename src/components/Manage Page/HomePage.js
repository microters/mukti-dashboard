import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomepageForm = () => {
  // ভাষা নির্বাচন (ডিফল্ট: ইংরেজি)
  const [language, setLanguage] = useState('en');

  // হোমপেজের অস্তিত্ব
  const [homepageExists, setHomepageExists] = useState(false);

  // প্রতিটি সেকশনের টেক্সট ডাটা (নির্দিষ্ট ভাষার জন্য)
  const [heroData, setHeroData] = useState({ prefix: '', title: '' });
  const [featuresData, setFeaturesData] = useState({ subtitle: '', title: '', icon: '' });
  const [aboutData, setAboutData] = useState({
    title: '',
    subtitle: '',
    description: '',
    experience: '',
    serviceTitle: '',
    serviceIcon: ''
  });
  const [whyChooseData, setWhyChooseData] = useState({
    title: '',
    subtitle: '',
    description: '',
    serviceTitle: '',
    serviceDescription: '',
    serviceIcon: ''
  });
  const [downloadAppData, setDownloadAppData] = useState({
    title: '',
    subtitle: '',
    description: ''
  });
  const [appointmentProcessData, setAppointmentProcessData] = useState({ icon: '', title: '' });
  const [appointmentData, setAppointmentData] = useState({}); // শুধুমাত্র ফাইল সংক্রান্ত (PUT এ ব্যবহার হবে না)

  // ফাইল ডাটা (POST করার জন্য)
  const [heroFile, setHeroFile] = useState(null);
  const [aboutFiles, setAboutFiles] = useState([]);
  const [appointmentFile, setAppointmentFile] = useState(null);
  const [downloadAppFile, setDownloadAppFile] = useState(null);
  const [whyChooseFile, setWhyChooseFile] = useState(null);

  // GET: হোমপেজ ডাটা লোড করা
  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/home');
        console.log(res.data)
        if (res.data) {
          setHomepageExists(true);
          const {
            heroSection,
            featuresSection,
            aboutSection,
            appointmentSection,
            whyChooseUsSection,
            downloadAppSection,
            appointmentProcess
          } = res.data;

          // নির্বাচিত ভাষা অনুযায়ী ডাটা সেট করা
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
            setAppointmentProcessData(appointmentProcess.translations[language]);
          }
        } else {
          setHomepageExists(false);
        }
      } catch (error) {
        console.error('Error fetching homepage:', error);
      }
    };

    fetchHomepage();
  }, [language]);

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!homepageExists) {
      // POST: নতুন হোমপেজ তৈরি (ডিফল্ট ইংরেজি)
      const formData = new FormData();
      // ডিফল্টভাবে সব ডাটা "en" কী এর অধীনে রাখা হবে
      formData.append('heroSection', JSON.stringify({ ...heroData, backgroundImage: '' }));
      formData.append('featuresSection', JSON.stringify(featuresData));
      formData.append('aboutSection', JSON.stringify({ ...aboutData, images: [] }));
      formData.append('appointmentSection', JSON.stringify(appointmentData));
      formData.append('whyChooseUsSection', JSON.stringify({ ...whyChooseData, image: '' }));
      formData.append('downloadAppSection', JSON.stringify({ ...downloadAppData, image: '' }));
      formData.append('appointmentProcess', JSON.stringify(appointmentProcessData));

      if (heroFile) formData.append('heroBackgroundImage', heroFile);
      if (aboutFiles.length > 0) aboutFiles.forEach(file => formData.append('aboutImages', file));
      if (appointmentFile) formData.append('appointmentImage', appointmentFile);
      if (downloadAppFile) formData.append('downloadAppImage', downloadAppFile);
      if (whyChooseFile) formData.append('whyChooseUsImage', whyChooseFile);

      try {
        const res = await axios.post('http://localhost:5000/api/home', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log(res.data);
        alert('Homepage created successfully!');
        setHomepageExists(true);
      } catch (err) {
        console.error('Error creating homepage:', err);
        alert('Error creating homepage');
      }
    } else {
      // PUT: আপডেট – নির্বাচিত ভাষা অনুযায়ী (ইমেজ বাদ)
      const sections = [
        { name: 'heroSection', data: heroData },
        { name: 'featuresSection', data: featuresData },
        { name: 'aboutSection', data: aboutData },
        { name: 'appointmentSection', data: appointmentData },
        { name: 'whyChooseUsSection', data: whyChooseData },
        { name: 'downloadAppSection', data: downloadAppData },
        { name: 'appointmentProcess', data: appointmentProcessData }
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
              translations: updatedData
            });
          })
        );
        alert('Homepage updated successfully!');
      } catch (err) {
        console.error('Error updating homepage:', err);
        alert('Error updating homepage');
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
        {/* Hero Section */}
        <fieldset className="border p-4 rounded">
          <legend className="text-xl font-semibold mb-2">Hero Section</legend>
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Prefix"
            value={heroData.prefix}
            onChange={(e) => setHeroData({ ...heroData, prefix: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Title"
            value={heroData.title}
            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
          />
          <label className="block mb-2 font-medium">
            Background Image:&nbsp;
            <input type="file" onChange={(e) => setHeroFile(e.target.files[0])} />
          </label>
        </fieldset>

        {/* Features Section */}
        <fieldset className="border p-4 rounded">
          <legend className="text-xl font-semibold mb-2">Features Section</legend>
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Subtitle"
            value={featuresData.subtitle}
            onChange={(e) => setFeaturesData({ ...featuresData, subtitle: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Title"
            value={featuresData.title}
            onChange={(e) => setFeaturesData({ ...featuresData, title: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Icon"
            value={featuresData.icon}
            onChange={(e) => setFeaturesData({ ...featuresData, icon: e.target.value })}
          />
        </fieldset>

        {/* About Section */}
        <fieldset className="border p-4 rounded">
          <legend className="text-xl font-semibold mb-2">About Section</legend>
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Title"
            value={aboutData.title}
            onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Subtitle"
            value={aboutData.subtitle}
            onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Description"
            value={aboutData.description}
            onChange={(e) => setAboutData({ ...aboutData, description: e.target.value })}
          />
          <label className="block mb-2 font-medium">
            Images (select up to 4):
            <input type="file" multiple onChange={(e) => setAboutFiles(Array.from(e.target.files))} />
          </label>
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Experience"
            value={aboutData.experience}
            onChange={(e) => setAboutData({ ...aboutData, experience: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Service Title"
            value={aboutData.serviceTitle}
            onChange={(e) => setAboutData({ ...aboutData, serviceTitle: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Service Icon"
            value={aboutData.serviceIcon}
            onChange={(e) => setAboutData({ ...aboutData, serviceIcon: e.target.value })}
          />
        </fieldset>

        {/* Appointment Section */}
        <fieldset className="border p-4 rounded">
          <legend className="text-xl font-semibold mb-2">Appointment Section</legend>
          <label className="block mb-2 font-medium">
            Image:&nbsp;
            <input type="file" onChange={(e) => setAppointmentFile(e.target.files[0])} />
          </label>
        </fieldset>

        {/* Why Choose Us Section */}
        <fieldset className="border p-4 rounded">
          <legend className="text-xl font-semibold mb-2">Why Choose Us Section</legend>
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Title"
            value={whyChooseData.title}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, title: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Subtitle"
            value={whyChooseData.subtitle}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, subtitle: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Description"
            value={whyChooseData.description}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, description: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Service Title"
            value={whyChooseData.serviceTitle}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, serviceTitle: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Service Description"
            value={whyChooseData.serviceDescription}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, serviceDescription: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Service Icon"
            value={whyChooseData.serviceIcon}
            onChange={(e) => setWhyChooseData({ ...whyChooseData, serviceIcon: e.target.value })}
          />
          <label className="block mb-2 font-medium">
            Image:&nbsp;
            <input type="file" onChange={(e) => setWhyChooseFile(e.target.files[0])} />
          </label>
        </fieldset>

        {/* Download App Section */}
        <fieldset className="border p-4 rounded">
          <legend className="text-xl font-semibold mb-2">Download App Section</legend>
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Title"
            value={downloadAppData.title}
            onChange={(e) => setDownloadAppData({ ...downloadAppData, title: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Subtitle"
            value={downloadAppData.subtitle}
            onChange={(e) => setDownloadAppData({ ...downloadAppData, subtitle: e.target.value })}
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Description"
            value={downloadAppData.description}
            onChange={(e) => setDownloadAppData({ ...downloadAppData, description: e.target.value })}
          />
          <label className="block mb-2 font-medium">
            Image:&nbsp;
            <input type="file" onChange={(e) => setDownloadAppFile(e.target.files[0])} />
          </label>
        </fieldset>

        {/* Appointment Process Section */}
        <fieldset className="border p-4 rounded">
          <legend className="text-xl font-semibold mb-2">Appointment Process Section</legend>
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Icon"
            value={appointmentProcessData.icon}
            onChange={(e) => setAppointmentProcessData({ ...appointmentProcessData, icon: e.target.value })}
          />
          <input
            className="w-full p-2 border rounded mb-2"
            type="text"
            placeholder="Title"
            value={appointmentProcessData.title}
            onChange={(e) => setAppointmentProcessData({ ...appointmentProcessData, title: e.target.value })}
          />
        </fieldset>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          {homepageExists ? 'Update Homepage' : 'Create Homepage'}
        </button>
      </form>
    </div>
  );
};

export default HomepageForm;
