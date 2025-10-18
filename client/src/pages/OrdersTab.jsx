import React, { useState, useEffect, useContext } from "react";
import { fetchUserOrders } from "../api/orderApi";
import { AuthContext } from "../context/AuthContext";

const OrdersTab = () => {
  const { user } = useContext(AuthContext); // Get logged-in user
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchUserOrders(user.id);
        setOrders(data.orders); // assuming API returns { success, count, orders }
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load orders");
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (loading) return <p className="text-gray-500 dark:text-gray-300">Loading orders...</p>;
  if (error) return <p className="text-red-500 dark:text-red-400">{error}</p>;
  if (orders.length === 0) return <p className="text-gray-500 dark:text-gray-300">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start dark:border-gray-600"
        >
          <div>
            <p className="font-medium dark:text-white">Order #{order._id}</p>
            <p className="text-gray-500 text-sm dark:text-gray-300">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
            <p
              className={`text-sm ${
                order.isDelivered ? "text-green-600" : "text-yellow-500"
              } dark:text-gray-300`}
            >
              Status: {order.isDelivered ? "Delivered" : order.status || "Pending"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Total: ₹{order.totalPrice || 0}
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
  );
};

export default OrdersTab;
