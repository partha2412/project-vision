import { useState, useEffect } from "react";
import { fetchAllOrders, deleteOrder, updateOrderStatus } from "../api/orderApi";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Package, ChevronDown, ChevronUp } from "lucide-react";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-600",
  Processing: "bg-blue-100 text-blue-600",
  Shipped: "bg-purple-100 text-purple-600",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-500",
};

const Pending = () => {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState({});
  const [expandedId, setExpandedId] = useState(null);

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

  useEffect(() => { loadOrders(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(orders.filter((o) => o._id !== id));
      setConfirmDeleteId(null);
      toast.success("Order deleted!");
    } catch (err) {
      toast.error(err.message || "Failed to delete order");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setPendingStatus((prev) => ({ ...prev, [id]: newStatus }));
  };

  const confirmStatusChange = async (id) => {
    const newStatus = pendingStatus[id];
    if (!newStatus) return;
    try {
      const updatedOrder = await updateOrderStatus(id, { status: newStatus });
      toast.success(`Order #${id.slice(-6)} → ${updatedOrder.order.status}`);
      setOrders(orders.map((o) => o._id === id ? { ...o, status: newStatus } : o));
      setPendingStatus((prev) => { const c = { ...prev }; delete c[id]; return c; });
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const cancelStatusChange = (id) => {
    setPendingStatus((prev) => { const c = { ...prev }; delete c[id]; return c; });
  };

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter((o) => o.status?.toLowerCase() === filter.toLowerCase());

  // Loading skeleton
  if (loading) return (
    <div className="p-4 md:p-6 space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-sm space-y-2 animate-pulse">
          <div className="h-4 w-1/4 bg-gray-200 rounded" />
          <div className="h-3 w-1/3 bg-gray-200 rounded" />
          <div className="h-3 w-1/2 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-500">{error}</div>
  );

  return (
    <div className="p-3 md:p-6">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          Orders
          <span className="text-sm font-normal text-gray-400 ml-1">({filteredOrders.length})</span>
        </h1>

        {/* Filter */}
        <select
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
          <Package className="w-12 h-12" />
          <p className="text-lg font-medium">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">

              {/* Order Header Row */}
              <div className="flex flex-wrap items-center gap-3 px-4 py-3">

                {/* Order ID + Date */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>

                {/* User */}
                <div className="hidden sm:block text-sm text-gray-600 flex-1 min-w-0 truncate">
                  {order.user ? `${order.user.firstname || ""} ${order.user.lastname || ""}` : "N/A"}
                </div>

                {/* Status Badge */}
                <span className={`text-xs font-medium px-3 py-1 rounded-full shrink-0 ${statusStyles[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>

                {/* Total */}
                <span className="font-bold text-gray-800 text-sm shrink-0">
                  ₹{order.totalAmount?.toLocaleString()}
                </span>

                {/* Expand */}
                <button
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400 shrink-0"
                >
                  {expandedId === order._id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedId === order._id && (
                <div className="border-t border-gray-100 bg-gray-50 space-y-4">

                  {/* Status Change + Delete */}
                  <div className="flex flex-wrap items-center p-2 gap-3">
                    <select
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                      value={pendingStatus[order._id] || order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    {pendingStatus[order._id] && (
                      <>
                        <button onClick={() => confirmStatusChange(order._id)}
                          className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition">
                          Confirm
                        </button>
                        <button onClick={() => cancelStatusChange(order._id)}
                          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition">
                          Cancel
                        </button>
                      </>
                    )}

                    {/* Delete */}
                    <div className="ml-auto">
                      {confirmDeleteId === order._id ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleDelete(order._id)}
                            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition flex items-center gap-1">
                            <FaTrash className="text-xs" /> Confirm
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(order._id)}
                          className="px-3 py-1.5 bg-red-50 text-red-500 text-sm rounded-lg hover:bg-red-100 transition flex items-center gap-1">
                          <FaTrash className="text-xs" /> Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* User detail */}
                  <div className="bg-white p-3 rounded-lg text-sm">
                    <p className="text-xs text-gray-400 mb-1">Customer</p>
                    <p className="font-medium text-gray-800">
                      {order.user ? `${order.user.firstname || ""} ${order.user.lastname || ""}` : "N/A"}
                    </p>
                    <p className="text-gray-500 text-xs">{order.user?.email}</p>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.orderItems?.map((item, i) => (
                      <div key={i} className="bg-white p-3 rounded-lg flex justify-between text-sm">
                        <div>
                          <p className="font-medium text-gray-800">{item.name || "Product"}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-700">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Payment</p>
                      <p className="font-medium text-gray-700">{order.paymentMethod}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Paid</p>
                      <p className={`font-medium ${order.isPaid ? "text-green-600" : "text-red-500"}`}>
                        {order.isPaid ? `Yes` : "No"}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Delivered</p>
                      <p className={`font-medium ${order.isDelivered ? "text-green-600" : "text-red-500"}`}>
                        {order.isDelivered ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>

                  {/* Shipping */}
                  {order.shippingAddress && (
                    <div className="bg-white p-3 rounded-lg text-sm">
                      <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                      <p className="text-gray-700">
                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                      </p>
                    </div>
                  )}



                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pending;