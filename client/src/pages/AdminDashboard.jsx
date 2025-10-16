import React, { useEffect, useState } from "react";
import {
  BarChart2,
  Bell,
  ClipboardList,
  Package,
  PlusCircle,
} from "lucide-react";
import { FaUserEdit } from "react-icons/fa";

// Import your existing pages/components
import Admin from "./Admin";         // Products + Orders
import Pending from "./Pending";     // Filtered orders
import Notifications from "./Notifications";
import Analytics from "./Analytics";
import AdminSettings from "./AdminSettings";
import { fetchProducts } from "../api/productApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("analytics"); // default page

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      // ✅ Low stock warning (only once)
      const lowStockItems = data.products.filter(
        (p) => p.stock <= p.lowStockAlert
      );

      if (lowStockItems.length > 0) {
        toast.warning(
          ` ${lowStockItems.length} product(s) are low on stock!`,
          { toastId: "low-stock-warning", position: "top-right", autoClose: 2000 } // prevents duplicates
        );
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);

  // Sidebar buttons with icons
  const menu = [
    { id: "analytics", label: "Analytics", icon: <BarChart2 className="w-5 h-5" /> },
    { id: "admin", label: "Products ", icon: <ClipboardList className="w-5 h-5" /> },
    { id: "pending", label: " Orders", icon: <Package className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-5 h-5" /> },
    { id: "update profile", label: "update profile", icon: <FaUserEdit className="w-5 h-5" /> },

  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" /> {/* ✅ ADD THIS */}

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-2 p-3 rounded-lg text-left transition ${activePage === item.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "hover:bg-indigo-100 text-gray-700"
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activePage === "analytics" && <Analytics />}
        {activePage === "admin" && <Admin />}
        {activePage === "pending" && <Pending />}
        {activePage === "notifications" && <Notifications />}
        {activePage === "update profile" && <AdminSettings />}

      </main>
    </div>
  );
};

export default AdminDashboard;
