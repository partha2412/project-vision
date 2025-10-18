import React, { useState } from "react";

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

const OrdersTab = () => {
  const [orders] = useState(mockOrders);

  return orders.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-300">No orders yet.</p>
  ) : (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start dark:border-gray-600">
          <div>
            <p className="font-medium dark:text-white">Order #{order.id}</p>
            <p className="text-gray-500 text-sm dark:text-gray-300">Date: {order.date}</p>
            <p className={`text-sm ${order.status === "Delivered" ? "text-green-600" : "text-yellow-500"} dark:text-gray-300`}>
              Status: {order.status}
            </p>
            <p className="text-gray-700 dark:text-gray-300">Total: ₹{order.amount}</p>
          </div>
          <div className="mt-2 md:mt-0">
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">View Details</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersTab;
