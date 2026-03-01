import React, { useState, useEffect, useContext } from "react";
import { fetchUserOrders } from "../api/orderApi";
import { AuthContext } from "../context/AuthContext";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

const statusStyles = {
  Delivered:  "bg-green-100 text-green-700",
  Cancelled:  "bg-red-100 text-red-500",
  Pending:    "bg-yellow-100 text-yellow-600",
  Processing: "bg-blue-100 text-blue-600",
  Shipped:    "bg-purple-100 text-purple-600",
};

const OrdersTab = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!user) return;
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchUserOrders(user.id);
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  if (loading) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
      ))}
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-red-500">{error}</div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
      <Package className="w-12 h-12" />
      <p className="text-lg font-medium">No orders yet</p>
      <p className="text-sm">Your orders will appear here once you place them</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
          
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Badge */}
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}>
                {order.status}
              </span>

              {/* Total */}
              <span className="font-bold text-gray-800">
                ₹{order.totalAmount?.toLocaleString()}
              </span>

              {/* Expand Button */}
              <button
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"
              >
                {expandedOrder === order._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedOrder === order._id && (
            <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">

              {/* Order Items */}
              <div className="space-y-3">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Payment</p>
                  <p className="font-medium text-gray-700">{order.paymentMethod}</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-400 mb-1">Items</p>
                  <p className="font-medium text-gray-700">{order.orderItems?.length} item(s)</p>
                </div>
                {order.isDelivered && order.deliveredAt && (
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Delivered</p>
                    <p className="font-medium text-green-600">
                      {new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short"
                      })}
                    </p>
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="bg-white p-3 rounded-lg col-span-2 sm:col-span-1">
                    <p className="text-xs text-gray-400 mb-1">Tracking</p>
                    <p className="font-medium text-gray-700">{order.trackingNumber}</p>
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="bg-white p-3 rounded-lg text-sm">
                  <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                  <p className="text-gray-700">
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                  </p>
                </div>
              )}

            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdersTab;