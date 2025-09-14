import { useState } from "react";

const Pending = () => {
  const [filter, setFilter] = useState("all");
  const orders = [
    { id: 1, product: "Shoes", status: "pending", paid: false },
    { id: 2, product: "Watch", status: "delivered", paid: true },
  ];

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="mb-4">
        <select
          className="border px-3 py-2"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <ul>
        {filteredOrders.map((o) => (
          <li key={o.id} className="border p-3 mb-2 rounded-lg">
            {o.product} — {o.status} — {o.paid ? "Paid" : "Not Paid"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pending;
