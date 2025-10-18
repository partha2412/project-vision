import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import OrdersTab from "./OrdersTab";
import UpdateTab from "./UpdateTab";
import AddressBookTab from "./AddressBookTab";
import WishlistTab from "./WishlistTab";
import ReviewsTab from "./ReviewsTab";
import NotificationsTab from "./NotificationsTab";
import RewardsTab from "./RewardsTab";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProfileSettings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const tabs = [
    { name: "Orders", component: <OrdersTab /> },
    { name: "Update", component: <UpdateTab /> },
    { name: "Address Book", component: <AddressBookTab /> },
    { name: "Wishlist", component: <WishlistTab /> },
    { name: "Reviews", component: <ReviewsTab /> },
    { name: "Notifications", component: <NotificationsTab /> },
    { name: "Rewards", component: <RewardsTab /> },
  ];

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors`}>
      <div className="max-w-screen mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Account Settings</h1>
        </div>

        <Tab.Group>
          <div className="flex">
            {/* Tabs List */}
            <Tab.List className="flex flex-col w-56 space-y-2 border-r dark:border-gray-600 pr-4">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      "py-2 px-4 text-left text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none",
                      selected
                        ? "bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white font-semibold"
                        : "text-gray-600 dark:text-gray-300"
                    )
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>

            {/* Panels */}
            <Tab.Panels className="flex-1 pl-6">
              {tabs.map((tab) => (
                <Tab.Panel key={tab.name}>{tab.component}</Tab.Panel>
              ))}
            </Tab.Panels>
          </div>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ProfileSettings;
