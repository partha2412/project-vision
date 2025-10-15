// src/components/ProfileSettings.js
import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { FaStar } from "react-icons/fa";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Mock Data
const mockOrders = [
  {
    id: 101,
    date: "2025-09-15",
    status: "Delivered",
    amount: 1299,
    items: [{ name: "Stylish Sunglasses", qty: 1, price: 1299 }],
    address: "123 Main St, Kolkata, WB",
    payment: "Credit Card",
  },
  {
    id: 102,
    date: "2025-08-22",
    status: "Shipped",
    amount: 799,
    items: [{ name: "Leather Wallet", qty: 1, price: 799 }],
    address: "123 Main St, Kolkata, WB",
    payment: "UPI",
  },
];

const mockWishlist = [
  { id: 1, name: "Sunglasses", price: 1299 },
  { id: 2, name: "Watch", price: 2999 },
];

const mockReviews = [
  { id: 1, product: "Stylish Sunglasses", rating: 4, comment: "Loved it!" },
];

const mockNotifications = [
  { id: 1, message: "Your order #101 has been delivered", date: "2025-09-18" },
  { id: 2, message: "50% off on Leather Wallet!", date: "2025-09-10" },
];

const ProfileSettings = () => {
  const [orders] = useState(mockOrders);
  const [wishlist, setWishlist] = useState(mockWishlist);
  const [addresses, setAddresses] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Account update states
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
    image: null,
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const removeWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const handleAddressChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    if (
      !form.name ||
      !form.phone ||
      !form.street ||
      !form.city ||
      !form.state ||
      !form.pincode ||
      !form.country
    ) {
      alert("Please fill all fields!");
      return;
    }
    setAddresses([...addresses, form]);
    setForm({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    });
  };

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  // Profile update handlers
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfile({ ...profile, image: file });
  };

 const handleSaveProfile = async () => {
  if (!profile.firstname || !profile.email) {
    alert("Please fill in your name and email!");
    return;
  }

  if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
    alert("New password and confirmation do not match!");
    return;
  }

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append("firstName", profile.firstname);
    formData.append("lastName", profile.lastname);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("gender", profile.gender);
    formData.append("dob", profile.dob);
    if (profile.password) formData.append("password", profile.password);
    if (profile.newPassword) formData.append("newPassword", profile.newPassword);
    if (profile.image) formData.append("image", profile.image);

    // Call backend API
    const token = localStorage.getItem("token"); // Make sure token is stored after login
    const response = await fetch("http://localhost:5000/api/auth/updateuser", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      alert("Profile updated successfully!");
      // Optionally, update local state with returned user
      setProfile({
        ...profile,
        firstname: data.user.firstName,
        lastname: data.user.lastName,
        email: data.user.email,
        phone: data.user.phone,
        gender: data.user.gender,
        dob: data.user.dob,
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      alert(data.message || "Update failed!");
    }
  } catch (error) {
    console.error("Profile update error:", error);
    alert("Something went wrong while updating profile.");
  }
};


  const tabs = [
    "Orders",
    "Update",
    "Address Book",
    "Wishlist",
    "Reviews",
    "Notifications",
    "Rewards",
  ];

  return (
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors`}
    >
      <div className="max-w-screen mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">
            Account Settings
          </h1>
        </div>

        <Tab.Group>
          <div className="flex">
            {/* Tabs List */}
            <Tab.List className="flex flex-col w-56 space-y-2 border-r dark:border-gray-600 pr-4">
              {tabs.map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      "py-2 px-4 text-left text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none",
                      selected
                        ? "bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white font-semibold"
                        : "text-gray-600 dark:text-gray-300"
                    )
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            {/* Panels */}
            <Tab.Panels className="flex-1 pl-6">
              {/* Orders Tab */}
              <Tab.Panel>
                {orders.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-300">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="border p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start dark:border-gray-600"
                      >
                        <div>
                          <p className="font-medium dark:text-white">
                            Order #{order.id}
                          </p>
                          <p className="text-gray-500 text-sm dark:text-gray-300">
                            Date: {order.date}
                          </p>
                          <p
                            className={`text-sm ${
                              order.status === "Delivered"
                                ? "text-green-600"
                                : "text-yellow-500"
                            } dark:text-gray-300`}
                          >
                            Status: {order.status}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            Total: ₹{order.amount}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tab.Panel>

              {/* Update Tab */}
              <Tab.Panel>
                <div className="space-y-6 max-w-lg">
                  <h2 className="text-lg font-semibold dark:text-white mb-4">
                    Update Account Information
                  </h2>

                  {/* Profile Image */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
                      {profile.image ? (
                        <img
                          src={URL.createObjectURL(profile.image)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          No Image
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    />
                  </div>

                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={profile.firstname}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={profile.lastname}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <input
                    type="date"
                    name="dob"
                    value={profile.dob}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />

                  {/* Password Change */}
                  <h3 className="font-medium dark:text-white mt-4">Change Password</h3>
                  <input
                    type="password"
                    name="password"
                    placeholder="Current Password"
                    value={profile.password}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={profile.newPassword}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={profile.confirmPassword}
                    onChange={handleProfileChange}
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />

                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                </div>
              </Tab.Panel>

              {/* Address Book */}
              <Tab.Panel>
                <div className="max-w-lg space-y-6">
                  <h2 className="text-lg font-semibold dark:text-white">
                    Add New Address
                  </h2>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleAddressChange}
                      className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleAddressChange}
                      className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <textarea
                      name="street"
                      placeholder="Street Address"
                      rows="2"
                      value={form.street}
                      onChange={handleAddressChange}
                      className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    ></textarea>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleAddressChange}
                      className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={form.state}
                      onChange={handleAddressChange}
                      className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pin Code"
                      value={form.pincode}
                      onChange={handleAddressChange}
                      className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      type="text"
                      name="country"
                      placeholder="Country"
                      value={form.country}
                      onChange={handleAddressChange}
                      className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={handleSaveAddress}
                      className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save Address
                    </button>
                  </div>

                  <div className="mt-8 space-y-4">
                    <h2 className="text-lg font-semibold dark:text-white">
                      Saved Addresses
                    </h2>
                    {addresses.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-300">
                        You haven’t added any address yet.
                      </p>
                    ) : (
                      addresses.map((addr, index) => (
                        <div
                          key={index}
                          className="border p-4 rounded shadow dark:border-gray-600 dark:text-white"
                        >
                          <p className="font-medium">{addr.name}</p>
                          <p>{addr.phone}</p>
                          <p>{addr.street}</p>
                          <p>
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p>{addr.country}</p>
                          <button
                            onClick={() => removeAddress(index)}
                            className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Tab.Panel>

              {/* Wishlist */}
              <Tab.Panel>
                {wishlist.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-300">
                    Your wishlist is empty.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="border p-4 rounded shadow dark:border-gray-600 dark:text-white"
                      >
                        <p className="font-medium">{item.name}</p>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold">
                          ₹{item.price}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                            onClick={() => removeWishlist(item.id)}
                          >
                            Remove
                          </button>
                          <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700">
                            Move to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tab.Panel>

              {/* Reviews */}
              <Tab.Panel>
                {mockReviews.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-300">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {mockReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="border p-4 rounded shadow dark:border-gray-600 dark:text-white"
                      >
                        <p className="font-medium">{rev.product}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <FaStar key={i} className="text-yellow-500" />
                          ))}
                        </div>
                        <p>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Tab.Panel>

              {/* Notifications */}
              <Tab.Panel>
                {mockNotifications.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-300">
                    No notifications.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {mockNotifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="border p-3 rounded shadow dark:border-gray-600 dark:text-white"
                      >
                        <p>{notif.message}</p>
                        <p className="text-gray-400 text-sm">{notif.date}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </Tab.Panel>

              {/* Rewards */}
              <Tab.Panel>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">
                  Loyalty Points: 450
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Redeem points on checkout for discounts!
                </p>
              </Tab.Panel>
            </Tab.Panels>
          </div>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ProfileSettings;
