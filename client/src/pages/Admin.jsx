import React, { useState } from "react";

const Admin = () => {
  // State for products
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", image: "" });

  // State for orders
  const [orders, setOrders] = useState([
    { id: 1, customer: "Alice", total: 300, status: "Pending", payment: "Unpaid" },
    { id: 2, customer: "Bob", total: 500, status: "Delivered", payment: "Paid" },
  ]);

  // Add product
  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts([...products, { ...form, id: Date.now() }]);
    setForm({ name: "", price: "", stock: "", image: "" });
  };

  // Toggle delivery status
  const toggleDelivery = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, status: order.status === "Pending" ? "Delivered" : "Pending" }
          : order
      )
    );
  };

  // Toggle payment status
  const togglePayment = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id
          ? { ...order, payment: order.payment === "Unpaid" ? "Paid" : "Unpaid" }
          : order
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <form onSubmit={handleAddProduct} className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            className="border p-2 rounded"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            className="border p-2 rounded"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded col-span-4 md:col-span-1"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* Products Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Products & Stock</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">${p.price}</td>
                <td className="p-3">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-gray-500 mt-3">No products added yet.</p>
        )}
      </div>

      {/* Orders Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Orders</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Delivery Status</th>
              <th className="p-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.customer}</td>
                <td className="p-3">${o.total}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleDelivery(o.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      o.status === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status}
                  </button>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => togglePayment(o.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      o.payment === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {o.payment}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-gray-500 mt-3">No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
