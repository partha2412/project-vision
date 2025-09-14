import { Bell, Package, AlertTriangle } from "lucide-react"; // icons

const Notifications = () => {
  const alerts = [
    { type: "warning", message: "⚠️ Stock low for 'yellow frames'" },
    { type: "success", message: "🆕 New Order placed:Airflex " },
    { type: "info", message: "📦 Order #1023 has been shipped" },
  ];

  // Tailwind styles for different alert types
  const styles = {
    warning: "bg-red-100 text-red-700 border-l-4 border-red-500",
    success: "bg-green-100 text-green-700 border-l-4 border-green-500",
    info: "bg-blue-100 text-blue-700 border-l-4 border-blue-500",
  };

  // Icon for each alert type
  const icons = {
    warning: <AlertTriangle className="w-6 h-6 text-red-600" />,
    success: <Package className="w-6 h-6 text-green-600" />,
    info: <Bell className="w-6 h-6 text-blue-600" />,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-2">
        <Bell className="w-8 h-8 text-blue-600" /> Notifications
      </h1>

      <ul className="space-y-4">
        {alerts.map((alert, i) => (
          <li
            key={i}
            className={`p-4 rounded-xl shadow-md flex items-center gap-4 transform transition-all hover:scale-[1.02] ${styles[alert.type]}`}
          >
            {icons[alert.type]}
            <span className="font-medium">{alert.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
