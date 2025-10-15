import { useState, useEffect } from "react";
import { fetchAllOrders, deleteOrder, updateOrderStatus } from "../api/orderApi";
import { FaTrash } from "react-icons/fa"; // Trash icon

const Pending = () => {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Track which order is pending deletion
  const [pendingStatus, setPendingStatus] = useState({}); // Track pending status changes

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

  useEffect(() => {

    loadOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter((order) => order._id !== id));
      setConfirmDeleteId(null); // Reset confirmation
    } catch (err) {
      alert(err.message || "Failed to delete order");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setPendingStatus((prev) => ({ ...prev, [id]: newStatus }));
  };

  const confirmStatusChange = async (id) => {
    const newStatus = pendingStatus[id]; // string like "Shipped"
    if (!newStatus) return;

    try {
      // Send directly as { status: "Shipped" }
      const payload = { status: newStatus };

      const updatedOrder = await updateOrderStatus(id, payload);
      console.log("Updated order:", updatedOrder);

      // Update orders state
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );

      // Clear pending status
      setPendingStatus((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      alert(err.message || "Failed to update status");
    }
  };



  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const cancelStatusChange = (id) => {
    setPendingStatus((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((o) => o.status?.toLowerCase() === filter.toLowerCase());

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
              className="border p-4 mb-3 rounded-lg shadow-sm bg-white relative"
            >
              {/* Delete Button (top-right corner) */}
              <div className="absolute top-12 right-4 flex gap-2 duration-300">
                {confirmDeleteId === order._id ? (
                  <div className="flex flex-row-reverse gap-2 mr-4">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 flex items-center gap-1"
                    >
                      <FaTrash /> Confirm
                    </button>
                    <button
                      onClick={cancelDelete}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(order._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 flex items-center gap-1"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              {/* Order header */}
              <div className="flex justify-between items-center mb-1">
                <div className="font-semibold text-lg">
                  Order <span className="text-gray-500">#{order._id.slice(-6)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              {/* User Info */}
              <div className="text-sm mb-2">
                <strong>User:</strong>{" "}
                {order.user
                  ? `${order.user.firstname || ""} ${order.user.lastname || ""} (${order.user.email || ""})`
                  : "N/A"}
              </div>

              {/* Payment & Status */}
              <div className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                <strong>Status:</strong>
                <select
                  className="border px-2 py-1 rounded"
                  value={pendingStatus[order._id] || order.status} // load current status from DB
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>


                {/* Confirm / Cancel buttons for status */}
                {pendingStatus[order._id] && (
                  <>
                    <button
                      onClick={() => confirmStatusChange(order._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => cancelStatusChange(order._id)}
                      className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>

              {/* Paid / Delivered */}
              <div className="text-sm text-gray-700 mb-1">
                <strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}
              </div>

              {order.isPaid && order.paidAt && (
                <div className="text-sm text-gray-700 mb-1">
                  <strong>Paid At:</strong> {new Date(order.paidAt).toLocaleString()}
                </div>
              )}

              <div className="text-sm text-gray-700 mb-1">
                <strong>Delivered:</strong> {order.isDelivered ? "Yes" : "No"}
              </div>

              {order.isDelivered && order.deliveredAt && (
                <div className="text-sm text-gray-700 mb-1">
                  <strong>Delivered At:</strong>{" "}
                  {new Date(order.deliveredAt).toLocaleString()}
                </div>
              )}

              {/* Order Items */}
              <div className="text-sm text-gray-700 mb-2">
                <strong>Items:</strong>{" "}
                {order.orderItems && order.orderItems.length > 0
                  ? order.orderItems
                    .map(
                      (item) =>
                        `${item.product?.name || "Product"} × ${item.quantity} (₹${item.price})`
                    )
                    .join(", ")
                  : "No items"}
              </div>

              {/* Total */}
              <div className="text-sm text-gray-700 mb-1">
                <strong>Total Amount:</strong> ₹
                {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
              </div>

              {/* Shipping Address */}
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
