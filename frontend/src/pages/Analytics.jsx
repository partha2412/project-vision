import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analytics = () => {
  // Example Data
  const salesData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3200 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 4200 },
    { month: "May", revenue: 6100 },
    { month: "Jun", revenue: 7200 },
  ];

  const revenueByCategory = [
    { category: "Aviator", revenue: 5000 },
    { category: "oval Glasses", revenue: 3000 },
    { category: "Browline Glasses", revenue: 2000 },
    { category: "Round Glasses", revenue: 1500 },
  ];

  const ordersData = [
    { name: "Delivered", value: 60 },
    { name: "Pending", value: 25 },
    { name: "Cancelled", value: 15 },
  ];

  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold mb-8">📊 Admin Analytics</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Line Chart: Sales Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
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
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
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
        <div className="bg-white p-6 rounded-xl shadow-lg md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Orders Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
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
