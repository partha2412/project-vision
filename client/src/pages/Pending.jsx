import { useState, useEffect } from "react";
import { fetchAllOrders } from "../api/orderApi"; // adjust path if needed

const Pending = () => {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchAllOrders();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(
          (o) => o.status.toLowerCase() === filter.toLowerCase()
        );

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {filteredOrders.map((order) => (
            <li
              key={order._id}
              className="border p-4 mb-3 rounded-lg shadow-sm bg-white"
            >
              {/* Order header */}
              <div className="font-semibold text-lg mb-1">
                Order <span className="text-gray-500">#{order._id.slice(-6)}</span>
              </div>

              {/* User info */}
              <div className="text-sm mb-2">
                <strong>User:</strong>{" "}
                {order.user
                  ? `${order.user.firstname || ""} ${
                      order.user.lastname || ""
                    } (${order.user.email || ""})`
                  : "N/A"}
              </div>

              {/* Order items */}
              <div className="text-sm text-gray-700 mb-2">
                <strong>Items:</strong>{" "}
                {order.orderItems && order.orderItems.length > 0
                  ? order.orderItems
                      .map(
                        (item) =>
                          `${item.product?.name || item.name} × ${
                            item.quantity
                          } (₹${item.price})`
                      )
                      .join(", ")
                  : "No items"}
              </div>

              {/* Amount and status */}
              <div className="text-sm text-gray-700 mb-1">
                <strong>Total Amount:</strong> ₹
                {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
              </div>

              <div className="text-sm text-gray-700 mb-1">
                <strong>Status:</strong> {order.status}
              </div>

              <div className="text-sm text-gray-700 mb-1">
                <strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}
              </div>

              {order.isPaid && order.paidAt && (
                <div className="text-sm text-gray-700 mb-1">
                  <strong>Paid At:</strong>{" "}
                  {new Date(order.paidAt).toLocaleString()}
                </div>
              )}

              {/* Shipping address */}
              <div className="text-sm text-gray-600 mt-2">
                <strong>Shipping Address:</strong>{" "}
                {order.shippingAddress
                  ? `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} (${order.shippingAddress.postalCode}), ${order.shippingAddress.country}`
                  : "N/A"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Pending;
