import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";
import { getSalesOverview, getRevenueByCategory, getOrdersDistribution } from "../api/analyticsApi";
import { ChartNoAxesCombined } from 'lucide-react';

const Analytics = () => {
  // Example Data
  const [salesData, setSalesData] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [ordersData, setOrdersData] = useState([]);

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [salesRes, revenueRes, ordersRes] = await Promise.all([
          getSalesOverview(),
          getRevenueByCategory(),
          getOrdersDistribution(),
        ]);

        setSalesData(salesRes);
        setRevenueByCategory(revenueRes);
        setOrdersData(ordersRes);
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <h1 className="text-xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        <ChartNoAxesCombined className="w-8 h-8 text-blue-600" /> Analytics Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
        {/* Line Chart: Sales Over Time */}
        <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart: Revenue by Category */}
        <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Orders Distribution */}
        <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg md:col-span-2">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Orders Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ordersData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {ordersData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
