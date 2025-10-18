import React from "react";

const mockNotifications = [
  { id: 1, message: "Your order #101 has been delivered", date: "2025-09-18" },
  { id: 2, message: "50% off on Leather Wallet!", date: "2025-09-10" },
];

const NotificationsTab = () => {
  return mockNotifications.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-300">No notifications.</p>
  ) : (
    <ul className="space-y-2">
      {mockNotifications.map((notif) => (
        <li key={notif.id} className="border p-3 rounded shadow dark:border-gray-600 dark:text-white">
          <p>{notif.message}</p>
          <p className="text-gray-400 text-sm">{notif.date}</p>
        </li>
      ))}
    </ul>
  );
};

export default NotificationsTab;
