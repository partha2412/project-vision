// src/components/ProfileSettings.js
import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { FaStar } from 'react-icons/fa';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Mock Data
const mockOrders = [
  {
    id: 101,
    date: '2025-09-15',
    status: 'Delivered',
    amount: 1299,
    items: [{ name: 'Stylish Sunglasses', qty: 1, price: 1299 }],
    address: '123 Main St, Kolkata, WB',
    payment: 'Credit Card',
  },
  {
    id: 102,
    date: '2025-08-22',
    status: 'Shipped',
    amount: 799,
    items: [{ name: 'Leather Wallet', qty: 1, price: 799 }],
    address: '123 Main St, Kolkata, WB',
    payment: 'UPI',
  },
];

const mockWishlist = [
  { id: 1, name: 'Sunglasses', price: 1299 },
  { id: 2, name: 'Watch', price: 2999 },
];

const mockReviews = [
  { id: 1, product: 'Stylish Sunglasses', rating: 4, comment: 'Loved it!' },
];

const mockNotifications = [
  { id: 1, message: 'Your order #101 has been delivered', date: '2025-09-18' },
  { id: 2, message: '50% off on Leather Wallet!', date: '2025-09-10' },
];

const ProfileSettings = () => {
  const [orders] = useState(mockOrders);
  const [wishlist, setWishlist] = useState(mockWishlist);
  const [darkMode, setDarkMode] = useState(false);

  const removeWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const tabs = [
    'Orders',
    'Account Info',
    'Address Book',
    'Wishlist',
    'Payment Methods',
    'Reviews',
    'Notifications',
    'Rewards',
  ];

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <div className={`${darkMode ? 'dark' : ''} min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors`}>
=======
<<<<<<< HEAD
=======
>>>>>>> b68cf0fc (userdashboard edit)
    <div
      className={`${
        darkMode ? "dark" : ""
      } min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors`}
    >
>>>>>>> 0f7b8658 (Revert "Merge pull request #14 from partha2412/navbar-user-info-edited")
      <div className="max-w-screen mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Account Settings</h1>
         {/*<button
            className="px-4 py-2 bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 rounded hover:bg-gray-900 dark:hover:bg-gray-400 transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>*/}
        </div>

        <Tab.Group>
          <div className="flex">
            {/* Left-side Tabs */}
            <Tab.List className="flex flex-col w-56 space-y-2 border-r dark:border-gray-600 pr-4">
              {tabs.map((tab) => (
                <Tab
                  key={tab}
                  className={({ selected }) =>
                    classNames(
                      'py-2 px-4 text-left text-sm font-medium rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none',
                      selected
                        ? 'bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white font-semibold'
                        : 'text-gray-600 dark:text-gray-300'
                    )
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>

            {/* Tab Panels */}
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
                          <p className="font-medium dark:text-white">Order #{order.id}</p>
                          <p className="text-gray-500 text-sm dark:text-gray-300">Date: {order.date}</p>
                          <p
                            className={`text-sm ${
                              order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-500'
                            } dark:text-gray-300`}
                          >
                            Status: {order.status}
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">Total: ₹{order.amount}</p>
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

              {/* Account Info */}
              <Tab.Panel>
                <div className="space-y-6 max-w-lg">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                  />
                  <select className="block w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
                    <option>Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Save Changes
                  </button>
                </div>
              </Tab.Panel>

              {/* Address Book */}
              <Tab.Panel>
                <p className="text-gray-500 dark:text-gray-300">No address saved yet.</p>
              </Tab.Panel>

              {/* Wishlist */}
              <Tab.Panel>
                {wishlist.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-300">Your wishlist is empty.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="border p-4 rounded shadow dark:border-gray-600 dark:text-white"
                      >
                        <p className="font-medium">{item.name}</p>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold">₹{item.price}</p>
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

              {/* Payment Methods */}
              <Tab.Panel>
                <p className="text-gray-500 dark:text-gray-300">No payment methods saved.</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Add Payment Method
                </button>
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
                  <p className="text-gray-500 dark:text-gray-300">No notifications.</p>
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
                <p className="text-gray-700 dark:text-gray-300 font-semibold">Loyalty Points: 450</p>
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
