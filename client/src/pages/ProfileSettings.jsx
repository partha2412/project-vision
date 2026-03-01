import React, { useState } from "react";
import {
  ShoppingBag, User, MapPin, Heart, Star, Bell, Gift
} from "lucide-react";
import OrdersTab from "./OrdersTab";
import UpdateTab from "./UpdateTab";
import AddressBookTab from "./AddressBookTab";
import WishlistTab from "./WishlistTab";
import ReviewsTab from "./ReviewsTab";
import NotificationsTab from "./NotificationsTab";
import RewardsTab from "./RewardsTab";

const ProfileSettings = () => {
  const [activePage, setActivePage] = useState("orders");

  const tabs = [
    { id: "orders",        label: "Orders",        icon: <ShoppingBag className="w-5 h-5" />, component: <OrdersTab /> },
    { id: "update",        label: "Profile",        icon: <User className="w-5 h-5" />,        component: <UpdateTab /> },
    { id: "address",       label: "Address Book",   icon: <MapPin className="w-5 h-5" />,      component: <AddressBookTab /> },
    { id: "wishlist",      label: "Wishlist",       icon: <Heart className="w-5 h-5" />,       component: <WishlistTab /> },
    { id: "reviews",       label: "Reviews",        icon: <Star className="w-5 h-5" />,        component: <ReviewsTab /> },
    { id: "notifications", label: "Notifications",  icon: <Bell className="w-5 h-5" />,        component: <NotificationsTab /> },
    { id: "rewards",       label: "Rewards",        icon: <Gift className="w-5 h-5" />,        component: <RewardsTab /> },
  ];

  const activeTab = tabs.find((t) => t.id === activePage);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex flex-col bg-white shadow-lg p-4 w-64">
        <h2 className="text-gray-900 font-bold text-2xl mb-8 px-2">My Account</h2>
        <nav className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition ${
                activePage === tab.id
                  ? "bg-gray-900 text-white shadow-md"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden mb-4">
          <h2 className="text-gray-900 font-bold text-xl">My Account</h2>
          <p className="text-gray-400 text-sm">{activeTab?.label}</p>
        </div>

        {/* Page title */}
        <div className="hidden md:flex items-center gap-3 mb-6">
          <span className="text-gray-700">{activeTab?.icon}</span>
          <h1 className="text-2xl font-semibold text-gray-800">{activeTab?.label}</h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          {activeTab?.component}
        </div>
      </main>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActivePage(tab.id)}
              className={`flex flex-col items-center gap-1 px-2 py-1 transition ${
                activePage === tab.id ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {tab.icon}
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

    </div>
  );
};

export default ProfileSettings;