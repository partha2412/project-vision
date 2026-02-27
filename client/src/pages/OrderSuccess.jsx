import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { fetchUserOrders } from "../api/orderApi";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("--");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    try {
      const decoded = jwt_decode(token);
      fetchOrderDetails(decoded.id); // ✅ real user ID from token
    } catch {
      navigate("/login");
    }
  }, []);

  const fetchOrderDetails = async (userId) => {
    try {
      const res = await fetchUserOrders(userId);
      const latest = res.orders[0]; // most recent order
      setOrderId(latest._id);
      setTotal(latest.totalAmount);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Confirmed</h1>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for your purchase. Your order has been successfully placed.
        </p>

        <div className="border-t border-gray-100 my-6" />

        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4 mx-auto" />
          </div>
        ) : (
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span className="font-medium text-gray-800">#{orderId.slice(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Paid</span>
              <span className="font-medium text-gray-800">₹{total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/userdashboard")}
            className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            View Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;