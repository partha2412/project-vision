import React, { useState } from "react";
import {
  User,
  Heart,
  Bell,
  ShoppingBag,
  CreditCard,
  MapPin,
  Star,
  Gift,
} from "lucide-react";
import { FaUserEdit } from "react-icons/fa";

// Import user components/pages
import ProfileSettings from "../components/ProfileSettings"; // The full settings component you have
import Orders from "./Orders";          // You can create a dedicated orders page if needed
import Wishlist from "./Wishlist";      // Optional separate page
import Notifications from "./Notifications"; // User-specific notifications
import Rewards from "./Rewards";        // Rewards/loyalty section
import PaymentMethods from "./PaymentMethods"; // Payment info management

const UserDashboard = () => {
  const [activePage, setActivePage] = useState("profile"); // Default page

  const menu = [
    { id: "profile", label: "Profile Settings", icon: <User className="w-5 h-5" /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart className="w-5 h-5" /> },
    { id: "payments", label: "Payment Methods", icon: <CreditCard className="w-5 h-5" /> },
    { id: "address", label: "Address Book", icon: <MapPin className="w-5 h-5" /> },
    { id: "reviews", label: "My Reviews", icon: <Star className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "rewards", label: "Rewards", icon: <Gift className="w-5 h-5" /> },
    { id: "edit", label: "Edit Account", icon: <FaUserEdit className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">User Dashboard</h2>

        <nav className="flex flex-col gap-3">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-2 p-3 rounded-lg text-left transition ${
                activePage === item.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-indigo-100 text-gray-700"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activePage === "profile" && <ProfileSettings />}
        {activePage === "orders" && <Orders />}
        {activePage === "wishlist" && <Wishlist />}
        {activePage === "payments" && <PaymentMethods />}
        {activePage === "address" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Address Book</h1>
            <p className="text-gray-600">You haven’t added any addresses yet.</p>
            <button className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Add New Address
            </button>
          </div>
        )}
        {activePage === "reviews" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">My Reviews</h1>
            <p className="text-gray-600">You haven’t written any reviews yet.</p>
          </div>
        )}
        {activePage === "notifications" && <Notifications />}
        {activePage === "rewards" && <Rewards />}
        {activePage === "edit" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Account Information</h1>
            <div className="max-w-md space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
