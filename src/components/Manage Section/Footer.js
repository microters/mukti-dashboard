import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaTrash,
  FaLink,
  FaUpload,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import axios from "axios";

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
      ? `https://api.muktihospital.com${file.startsWith("/") ? file : `/${file}`}`
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

const Footer = () => {
  const [language, setLanguage] = useState("en");
  const [footerLogo, setFooterLogo] = useState(null);
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState({ logo: null, title: "", phone: "" });
  const [sections, setSections] = useState({
    QuickLinks: { title: "", links: [{ label: "", url: "" }] },
    Treatments: { title: "", links: [{ label: "", url: "" }] },
    PatientCare: { title: "", links: [{ label: "", url: "" }] },
    Diagnostic: { title: "", links: [{ label: "", url: "" }] },
  });
  const [copyright, setCopyright] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });
  const [listItems, setListItems] = useState([{ label: "", url: "" }]);

  // Define section labels as required.
  const SECTION_LABELS = {
    QuickLinks: "Quick Links",
    Treatments: "Treatments",
    PatientCare: "Advanced Treatments",
    Diagnostic: "Diagnostic",
  };

  // Define a fixed order for the sections.
  const sectionOrder = ["QuickLinks", "Treatments", "PatientCare", "Diagnostic"];

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await axios.get("https://api.muktihospital.com/api/footer");
        const data = res.data?.translations?.[language];
        if (data) {
          setFooterLogo(data.footerLogo || null);
          setDescription(data.description || "");
          setContact(data.contact || { logo: null, title: "", phone: "" });
          setSections(data.sections || sections);
          setCopyright(data.copyright || "");
          setSocialLinks(data.socialLinks || {});
          setListItems(data.listItems || [{ label: "", url: "" }]);
        }
      } catch (err) {
        console.error("Failed to fetch footer data", err);
      }
    };
    fetchFooter();
  }, [language]);

  const handleSectionChange = (section, index, field, value) => {
    const updatedLinks = [...sections[section].links];
    updatedLinks[index][field] = value;
    setSections({
      ...sections,
      [section]: { ...sections[section], links: updatedLinks },
    });
  };

  const addSectionLink = (section) => {
    setSections({
      ...sections,
      [section]: {
        ...sections[section],
        links: [...sections[section].links, { label: "", url: "" }],
      },
    });
  };

  const removeSectionLink = (section, index) => {
    const updatedLinks = sections[section].links.filter((_, i) => i !== index);
    setSections({
      ...sections,
      [section]: { ...sections[section], links: updatedLinks },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("language", language);
    formData.append("description", description);
    formData.append("copyright", copyright);
    formData.append("socialLinks", JSON.stringify(socialLinks));
    formData.append("sections", JSON.stringify(sections));
    formData.append("listItems", JSON.stringify(listItems));

    if (footerLogo instanceof File) {
      formData.append("footerLogo", footerLogo);
    }
    if (contact.logo instanceof File) {
      formData.append("contactLogo", contact.logo);
    }
    formData.append("contactTitle", contact.title);
    formData.append("contactPhone", contact.phone);

    try {
      const res = await axios.post("https://api.muktihospital.com/api/footer", formData);
      alert("✅ Footer Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while saving");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Manage Footer</h1>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium">
          Select Language:
          <select
            className="ml-2 p-2 border rounded focus:ring-blue-500 text-black"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="bn">Bangla</option>
          </select>
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Footer Logo */}
        <fieldset className="border p-6 rounded-md bg-white text-black">
          <legend className="text-lg font-semibold">Footer Logo</legend>
          <ImageUpload
            label="Upload Footer Logo"
            file={footerLogo}
            setFile={setFooterLogo}
          />
        </fieldset>

        {/* Footer Description */}
        <fieldset className="border p-6 rounded-md bg-white text-black mt-6">
          <legend className="text-lg font-semibold">Footer Description</legend>
          <textarea
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter footer description..."
          />
        </fieldset>

        {/* Contact Section */}
        <fieldset className="border p-6 rounded-md bg-white text-black mt-6">
          <legend className="text-lg font-semibold">Contact</legend>
          <ImageUpload
            label="Upload Contact Logo"
            file={contact.logo}
            setFile={(file) => setContact({ ...contact, logo: file })}
          />
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
            value={contact.title}
            onChange={(e) => setContact({ ...contact, title: e.target.value })}
            placeholder="Enter contact title"
          />
          <input
            type="tel"
            className="w-full px-4 py-2 border rounded-md mt-2 focus:ring-2 focus:ring-blue-500"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
            placeholder="Enter phone number"
          />
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="block mt-2 text-blue-400">
              {contact.phone}
            </a>
          )}
        </fieldset>

        {/* Dynamic Sections in Fixed Order */}
        <div className="space-y-6 mt-6">
          {sectionOrder.map((section) => (
            <fieldset
              key={section}
              className="border p-6 rounded-md bg-white text-black"
            >
              <legend className="text-lg font-semibold">
                {SECTION_LABELS[section]}
              </legend>

              {/* Section Title */}
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={sections[section].title}
                onChange={(e) =>
                  setSections({
                    ...sections,
                    [section]: {
                      ...sections[section],
                      title: e.target.value,
                    },
                  })
                }
                placeholder="Enter section title"
              />

              {/* Links within this section */}
              {sections[section].links.map((link, index) => (
                <div key={index} className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    className="p-2 border rounded-md w-1/2"
                    value={link.label}
                    onChange={(e) =>
                      handleSectionChange(section, index, "label", e.target.value)
                    }
                    placeholder="Link Label"
                  />
                  <input
                    type="text"
                    className="p-2 border rounded-md w-1/2"
                    value={link.url}
                    onChange={(e) =>
                      handleSectionChange(section, index, "url", e.target.value)
                    }
                    placeholder="URL"
                  />
                  {link.url && (
                    <a
                      href={link.url}
                      className="text-blue-400"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLink />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => removeSectionLink(section, index)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addSectionLink(section)}
                className="mt-3 text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <FaPlus /> Add More Links
              </button>
            </fieldset>
          ))}
        </div>

        {/* Copyright & Additional Sections */}
        <div className="space-y-6 mt-6">
          <fieldset className="border p-6 rounded-md bg-white text-black">
            <legend className="text-lg font-semibold">Copyright</legend>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={copyright}
              onChange={(e) => setCopyright(e.target.value)}
              placeholder="Enter copyright text"
            />
          </fieldset>

          {/* Social Links */}
          <fieldset className="border p-6 rounded-md bg-white text-black">
            <legend className="text-lg font-semibold">Social Links</legend>
            {Object.entries(socialLinks).map(([platform, url]) => (
              <div key={platform} className="flex items-center gap-2 mt-2">
                {platform === "facebook" && (
                  <FaFacebook className="text-blue-600" size={24} />
                )}
                {platform === "twitter" && (
                  <FaTwitter className="text-blue-400" size={24} />
                )}
                {platform === "instagram" && (
                  <FaInstagram className="text-pink-500" size={24} />
                )}
                {platform === "linkedin" && (
                  <FaLinkedin className="text-blue-700" size={24} />
                )}
                {platform === "youtube" && (
                  <FaYoutube className="text-red-600" size={24} />
                )}
                <input
                  type="text"
                  className="p-2 border rounded-md w-full"
                  value={url}
                  onChange={(e) =>
                    setSocialLinks({ ...socialLinks, [platform]: e.target.value })
                  }
                  placeholder={`Enter ${platform} URL`}
                />
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    <FaLink />
                  </a>
                )}
              </div>
            ))}
          </fieldset>

          {/* Copyright List Items */}
          <fieldset className="border p-6 rounded-md bg-white text-black">
            <legend className="text-lg font-semibold">Copyright List Items</legend>
            {listItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  className="p-2 border rounded-md w-1/2"
                  value={item.label}
                  onChange={(e) => {
                    const updatedItems = [...listItems];
                    updatedItems[index].label = e.target.value;
                    setListItems(updatedItems);
                  }}
                  placeholder="Item label"
                />
                <input
                  type="text"
                  className="p-2 border rounded-md w-1/2"
                  value={item.url}
                  onChange={(e) => {
                    const updatedItems = [...listItems];
                    updatedItems[index].url = e.target.value;
                    setListItems(updatedItems);
                  }}
                  placeholder="URL"
                />
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    <FaLink />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setListItems(listItems.filter((_, i) => i !== index))
                  }
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setListItems([...listItems, { label: "", url: "" }])}
              className="mt-3 text-blue-600 flex items-center gap-1"
            >
              <FaPlus /> Add List Item
            </button>
          </fieldset>
        </div>

        {/* Save Changes Button */}
        <button
          type="submit"
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Footer;
