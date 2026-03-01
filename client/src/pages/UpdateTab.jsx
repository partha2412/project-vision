import React, { useEffect, useState } from "react";
import { updateUser } from "../api/userApi";
import { Camera, Loader2 } from "lucide-react";
const InputField = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
    />
  </div>
);

const UpdateTab = () => {
  const [profile, setProfile] = useState({
    firstname: "", lastname: "", email: "", phone: "",
    gender: "", dob: "", password: "", newPassword: "",
    confirmPassword: "", image: null,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setProfile((prev) => ({
        ...prev,
        firstname: storedUser.firstname || "",
        lastname: storedUser.lastname || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        gender: storedUser.gender || "",
        dob: storedUser.dob ? storedUser.dob.split("T")[0] : "",
        avatar: storedUser.avatar || null,
      }));
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success"|"error", text }

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleImage = (e) => setProfile({ ...profile, image: e.target.files[0] });

  const handleSave = async () => {
    if (!profile.firstname || !profile.email) {
      return setMessage({ type: "error", text: "First name and email are required." });
    }
    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match." });
    }

    try {
      setLoading(true);
      setMessage(null);

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
      if (profile.image) payload.image = profile.image;

      const data = await updateUser(payload);

      if (data.success) {
        // get new avatar from backend response
        const newAvatar = data.user?.avatar || data.avatar;

        // update localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const updatedUser = {
          ...storedUser,
          ...payload,
          avatar: newAvatar || storedUser.avatar
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("userUpdated"));
        // update profile state with new avatar so image reflects immediately
        setProfile((prev) => ({
          ...prev,
          password: "", newPassword: "", confirmPassword: "", image: null,
          avatar: newAvatar
        }));

        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({ type: "error", text: data.message || "Update failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-8">

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
          {profile.image ? (
            // new image selected by user
            <img src={URL.createObjectURL(profile.image)} alt="Preview" className="w-full h-full object-cover" />
          ) : profile.avatar && profile.avatar !== "default-avatar.jpg" ? (
            // existing avatar from DB
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            // fallback initials
            <span className="text-gray-400 text-2xl font-bold">
              {profile.firstname?.[0]?.toUpperCase() || "?"}
            </span>
          )}
          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition cursor-pointer rounded-full">
            <Camera className="w-5 h-5 text-white" />
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>
        </div>
        <div>
          <p className="font-semibold text-gray-800">{profile.firstname || "Your Name"}</p>
          <p className="text-sm text-gray-400">Click avatar to change photo</p>
        </div>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className={`text-sm px-4 py-3 rounded-lg ${message.type === "success"
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-red-50 text-red-600 border border-red-200"
          }`}>
          {message.text}
        </div>
      )}

      {/* Personal Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="First Name" type="text" name="firstname" placeholder="John" value={profile.firstname} onChange={handleChange} />
          <InputField label="Last Name" type="text" name="lastname" placeholder="Doe" value={profile.lastname} onChange={handleChange} />
          <InputField label="Email" type="email" name="email" placeholder="john@example.com" value={profile.email} onChange={handleChange} />
          <InputField label="Phone" type="text" name="phone" placeholder="+91 XXXXX XXXXX" value={profile.phone} onChange={handleChange} />
          <InputField label="Date of Birth" type="date" name="dob" value={profile.dob} onChange={handleChange} />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Gender</label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Change Password */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Current Password" type="password" name="password" placeholder="Enter current password" value={profile.password} onChange={handleChange} />
          <InputField label="New Password" type="password" name="newPassword" placeholder="Enter new password" value={profile.newPassword} onChange={handleChange} />
          <InputField label="Confirm Password" type="password" name="confirmPassword" placeholder="Confirm new password" value={profile.confirmPassword} onChange={handleChange} />
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {loading ? "Saving..." : "Save Changes"}
      </button>

    </div>
  );
};

export default UpdateTab;