import React, { useState, useEffect } from "react";
import { addProduct, fetchProducts } from "../api/productApi";

const Admin = () => {
  const initialFormState = {
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    lowStock: "",
    gstRate: "",
    category: "",
    productType: "",
    brand: "",
    images: [],
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [orders, setOrders] = useState([
    { id: 1, customer: "Alice", total: 300, status: "Pending", payment: "Unpaid" },
    { id: 2, customer: "Bob", total: 500, status: "Delivered", payment: "Paid" },
  ]);

  // Load all products from DB
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      // Assuming your API returns { success, count, products }
      setProducts(data.products.map(p => ({ ...p, imagePreviews: p.images || [] })));
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "images") {
          if (form.images.length > 0) {
            form.images.forEach(img => formData.append("images", img));
          }
        } else {
          formData.append(key, form[key]);
        }
      });

      await addProduct(formData);

      alert("✅ Product added successfully!");
      // Reload all products from DB after adding
      await loadProducts();

      // Reset form
      setForm(initialFormState);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message || "❌ Failed to add product");
    }
  };

  // Toggle delivery status
  const toggleDelivery = (id) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id
          ? { ...order, status: order.status === "Pending" ? "Delivered" : "Pending" }
          : order
      )
    );
  };

  // Toggle payment status
  const togglePayment = (id) => {
    setOrders(prev =>
      prev.map(order =>
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
        <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Product Title"
            className="border p-2 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="border p-2 rounded md:col-span-2 lg:col-span-3"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
            placeholder="Discount Price"
            className="border p-2 rounded"
            value={form.discountPrice}
            onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
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
            type="number"
            placeholder="Low Stock Alert"
            className="border p-2 rounded"
            value={form.lowStock}
            onChange={(e) => setForm({ ...form, lowStock: e.target.value })}
          />
          <input
            type="number"
            placeholder="GST Rate (%)"
            className="border p-2 rounded"
            value={form.gstRate}
            onChange={(e) => setForm({ ...form, gstRate: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            className="border p-2 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Product Type"
            className="border p-2 rounded"
            value={form.productType}
            onChange={(e) => setForm({ ...form, productType: e.target.value })}
          />
          <input
            type="text"
            placeholder="Brand"
            className="border p-2 rounded"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          {/* Image Upload */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="border p-2 rounded w-full"
              onChange={handleImageChange}
            />
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imagePreviews.map((src, idx) => (
                  <img key={idx} src={src} alt="preview" className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded md:col-span-2 lg:col-span-3 transition-all duration-200"
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
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id || p.id} className="border-t">
                <td className="p-3">
                  {p.imagePreviews?.length > 0 ? (
                    <img src={p.imagePreviews[0]} alt={p.title} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">{p.brand}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="text-gray-500 mt-3">No products added yet.</p>}
      </div>
    </div>
  );
};

export default Admin;
