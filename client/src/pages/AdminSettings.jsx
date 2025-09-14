import React, { useState } from "react";

const AdminSettings = () => {
  const [form, setForm] = useState({
    address: "",
    profileName: "",
    email: "",
    phone: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", form);
    // 🔗 Call your backend API to save data
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Admin Settings
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Address Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Store Address
            </h2>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter store address"
              rows="4"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Profile Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Profile Information
            </h2>
            <div className="space-y-5">
              <input
                type="text"
                name="profileName"
                value={form.profileName}
                onChange={handleChange}
                placeholder="Admin Name"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
