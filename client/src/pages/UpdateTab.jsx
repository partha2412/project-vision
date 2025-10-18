import React, { useState } from "react";
import { updateUser } from "../api/userApi";

const UpdateTab = () => {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    image: null, // store File object
  });

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setProfile({ ...profile, image: e.target.files[0] });

  const handleSaveProfile = async () => {
    if (!profile.firstname || !profile.email) return alert("Name and email required!");
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword)
      return alert("Password confirmation mismatch!");

    try {
      // Prepare payload
      const payload = {
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        phone: profile.phone,
        gender: profile.gender,
        dob: profile.dob,
        password: profile.password || undefined,
        newPassword: profile.newPassword || undefined,
      };

      // Append image if exists
      if (profile.image) {
        payload.image = profile.image; // ✅ matches backend multer field
      }

      const data = await updateUser(payload);
      if (data.success) {
        alert("Profile updated successfully!");
        setProfile({ ...profile, password: "", newPassword: "", confirmPassword: "", image: null });
      } else alert(data.message || "Update failed!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Something went wrong!");
    }
  };

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-lg font-semibold dark:text-white mb-4">Update Account Information</h2>

      {/* Profile Image */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
          {profile.image ? (
            <img src={URL.createObjectURL(profile.image)} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No Image</div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm text-gray-600 dark:text-gray-300"
        />
      </div>

      {/* Text Fields */}
      <input type="text" name="firstname" placeholder="First Name" value={profile.firstname} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
      <input type="text" name="lastname" placeholder="Last Name" value={profile.lastname} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
      <input type="email" name="email" placeholder="Email" value={profile.email} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
      <input type="text" name="phone" placeholder="Phone Number" value={profile.phone} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
      <select name="gender" value={profile.gender} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input type="date" name="dob" value={profile.dob} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />

      {/* Password */}
      <h3 className="font-medium dark:text-white mt-4">Change Password</h3>
      <input type="password" name="password" placeholder="Current Password" value={profile.password} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
      <input type="password" name="newPassword" placeholder="New Password" value={profile.newPassword} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />
      <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={profile.confirmPassword} onChange={handleProfileChange} className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white" />

      <button onClick={handleSaveProfile} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Save Changes
      </button>
    </div>
  );
};

export default UpdateTab;
