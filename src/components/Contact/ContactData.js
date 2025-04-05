import React, { useState, useEffect } from "react";

const ContactPage = () => {
  const [contacts, setContacts] = useState([]); // State to store the fetched contacts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const API_URL = "http://api.muktihospital.com"; // Replace with your API URL
  const API_KEY = "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079     "; // Replace with your API key

  // Fetch contact data when the component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/contact`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY, // Sending the API key in the request header
          },
        });

        const result = await response.json();
        if (response.ok) {
          setContacts(result.contacts); // Set contacts state with the fetched data
        } else {
          setError(result.message || "Failed to fetch contact data.");
        }
      } catch (err) {
        setError("An error occurred while fetching contact data.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchContacts();
  }, []);

  // Show loading state, error, or contact data
  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Contact Submissions</h2>

      {contacts.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No contact submissions available.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-100 transition-colors duration-300"
                >
                  <td className="px-6 py-4">{contact.name}</td>
                  <td className="px-6 py-4">{contact.email}</td>
                  <td className="px-6 py-4">{contact.phone}</td>
                  <td className="px-6 py-4">{contact.subject}</td>
                  <td className="px-6 py-4 max-w-xs truncate">{contact.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
