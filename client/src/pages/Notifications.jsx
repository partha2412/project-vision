import React, { useEffect, useState, useRef } from "react";
import {
  Bell,
  Package,
  AlertTriangle,
  Trash2,
  CheckCircle,
  PlusCircle,
  Gift,
} from "lucide-react";
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
  createNotification,
} from "../api/notificationApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notifications = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState("info");
  const didFetch = useRef(false);

  // Fetch notifications
  const getNotifications = async () => {
    try {
      const data = await fetchNotifications();
      if (data.success) setAlerts(data.notifications);
    } catch (error) {
      toast.error(error.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    getNotifications();
    const interval = setInterval(getNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // Mark as read
  const handleMarkRead = async (id) => {
    try {
      const data = await markNotificationAsRead(id);
      if (data.success) {
        setAlerts((prev) =>
          prev.map((a) => (a._id === id ? { ...a, read: true } : a))
        );
        toast.success("Notification marked as read");
      }
    } catch (error) {
      toast.error(error.message || "Failed to mark as read");
    }
  };

  // Delete notification
  const handleDelete = async (id) => {
    try {
      const data = await deleteNotification(id);
      if (data.success) {
        setAlerts((prev) => prev.filter((a) => a._id !== id));
        toast.success("Notification deleted");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete notification");
    }
  };

  // Create notification
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return toast.error("Message cannot be empty");

    try {
      const data = await createNotification({ message: newMessage, type: newType });
      if (data.success) {
        setAlerts((prev) => [data.notification, ...prev]);
        setNewMessage("");
        toast.success("Notification created");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create notification");
    }
  };

  const styles = {
    warning: "bg-red-100 text-red-700 border-l-4 border-red-500",
    success: "bg-green-100 text-green-700 border-l-4 border-green-500",
    info: "bg-blue-100 text-blue-700 border-l-4 border-blue-500",
    offers:
      "bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 text-yellow-800 border-l-4 border-yellow-500 shadow-sm",
  };

  const icons = {
    warning: <AlertTriangle className="w-6 h-6 text-red-600" />,
    success: <Package className="w-6 h-6 text-green-600" />,
    info: <Bell className="w-6 h-6 text-blue-600" />,
    offers: <Gift className="w-6 h-6 text-yellow-600" />,
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-gray-600">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Bell className="w-8 h-8 text-blue-600" /> Notifications
      </h1>

      {/* New Notification Form */}
      <form
        onSubmit={handleCreate}
        className="mb-6 flex flex-col md:flex-row gap-3 items-center"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter notification message"
          className="flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="offers">Offers</option>
        </select>
        <button
          type="submit"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" /> Add
        </button>
      </form>

      {alerts.length === 0 ? (
        <p className="text-gray-500 text-lg">No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {alerts.map((alert) => (
            <li
              key={alert._id}
              className={`p-4 rounded-xl shadow-md flex items-center justify-between gap-4 transition-all hover:scale-[1.02] ${
                styles[alert.type] || "bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-4">
                {icons[alert.type] || <Bell className="w-6 h-6 text-gray-600" />}
                <div>
                  <p
                    className={`font-medium ${alert.read ? "opacity-70" : "font-semibold"}`}
                  >
                    {alert.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!alert.read && (
                  <button
                    onClick={() => handleMarkRead(alert._id)}
                    className="text-green-600 hover:text-green-800"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-6 h-6" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(alert._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete notification"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
