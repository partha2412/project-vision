// src/components/ProfileSettings.js

import React from 'react';
import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const ProfileSettings = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8 ">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b mb-4">
          {['My Orders', 'Account Info', 'Address Book'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'py-2 px-4 text-sm font-medium',
                  selected
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-500'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* My Orders Tab */}
          <Tab.Panel>
            <p className="text-gray-500 h-screen">You have no orders yet.</p>
          </Tab.Panel>

          {/* Account Info Tab */}
          <Tab.Panel>
            <div className="space-y-6 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full p-2 bg-gray-100 border-gray-300 rounded-md shadow-sm"
                  placeholder="johndoe@email.com"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option>Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Change Password */}
              <div className="mt-4 pt-4 border-t">
                <h2 className="text-lg font-semibold mb-2">Change Password</h2>
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Change Password
                  </button>
                </div>
              </div>

              {/* Save Account Info */}
              <div className="mt-6">
                <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Save Changes
                </button>
              </div>
            </div>
          </Tab.Panel>

          {/* Address Book Tab */}
          <Tab.Panel>
            <div className="space-y-20 max-w-lg ">
              <p className="text-gray-500">No address saved.</p>

              <div className="mt-6 border-t pt-4">
                <h3 className="font-semibold text-lg mb-2">Add New Address</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Label (Home, Work, etc.)"
                    className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Address Line 2"
                    className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="ZIP / PIN"
                    className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Add Address
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProfileSettings;
