import React, { useState, useEffect, useContext } from "react";
import { fetchUserOrders } from "../api/orderApi";
import { AuthContext } from "../context/AuthContext";

const OrdersTab = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchUserOrders(user.id);
        setOrders(data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError(err.message || "Failed to load orders");
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  if (loading)
    return <p className="text-gray-500 dark:text-gray-300">Loading orders...</p>;

  if (error)
    return <p className="text-red-500 dark:text-red-400">{error}</p>;

  if (orders.length === 0)
    return <p className="text-gray-500 dark:text-gray-300">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start dark:border-gray-600 bg-white dark:bg-gray-800"
        >
          <div className="space-y-1">
            <p className="font-medium text-lg dark:text-white">
              Order #{order._id}
            </p>

            <p className="text-gray-500 text-sm dark:text-gray-300">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {order.isDelivered && order.deliveredAt && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Delivered on: {new Date(order.deliveredAt).toLocaleDateString()}
              </p>
            )}

            <p
              className={`text-sm font-medium ${
                order.status === "Delivered"
                  ? "text-green-600"
                  : order.status === "Cancelled"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              Status: {order.status}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              Payment: {order.paymentMethod}
            </p>

            <p className="text-gray-700 dark:text-gray-300">
              Items: {order.orderItems?.length || 0}
            </p>

            <p className="font-semibold text-gray-800 dark:text-gray-100">
              Total: ₹{order.totalAmount?.toLocaleString() || 0}
            </p>
          </div>

          <div className="mt-3 md:mt-0">
            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersTab;
