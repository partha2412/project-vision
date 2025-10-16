import React, { useState, useEffect } from "react";
import { addProduct, fetchProducts, hardDeleteProduct } from "../api/productApi";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Admin = () => {
  const initialFormState = {
    title: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    lowStockAlert: "",
    gstRate: "",
    category: "",
    productType: "",
    brand: "",
    images: [],
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editableValues, setEditableValues] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);


  // Load all products
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(
        data.products.map((p) => ({
          ...p,
          imagePreviews: p.images || [],
        }))
      );

      // ✅ Low stock warning (only once)
      const lowStockItems = data.products.filter(
        (p) => p.stock <= p.lowStockAlert
      );
      if (lowStockItems.length > 0) {
        toast.warning(
          `⚠️ ${lowStockItems.length} product(s) are low on stock!`,
          { toastId: "low-stock-warning", position: "top-right", autoClose: 2000 } // prevents duplicates
        );
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("❌ Failed to load products");
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

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (isAdding) return;

    try {
      setIsAdding(true);

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "images") {
          form.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, form[key]);
        }
      });

      await addProduct(formData);
      toast.success("✅ Product added successfully!");
      await loadProducts();
      setForm(initialFormState);
      setImagePreviews([]);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("❌ Failed to add product");
    } finally {
      setIsAdding(false);
    }
  };

  // Start editing a product
  const startEditing = (product) => {
    setEditingId(product._id);
    setEditableValues({
      title: product.title,
      brand: product.brand,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      lowStockAlert: product.lowStockAlert,
      gstRate: product.gstRate,
      productType: product.productType,
    });
  };

  // Confirm edit
  const saveChanges = async (id) => {
    try {
      await api.put(`/product/update/${id}`, editableValues);
      toast.success("✅ Product updated successfully!");
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("❌ Failed to update product");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      //await api.delete(`/product/delete/${id}`);
      await hardDeleteProduct(id);
      toast.success("🗑️ Product deleted successfully!");
      setDeleteConfirmId(null);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("❌ Failed to delete product");
    }
  };


  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditableValues({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add Product Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <form
          onSubmit={handleAddProduct}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
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
            onChange={(e) =>
              setForm({ ...form, discountPrice: e.target.value })
            }
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
            value={form.lowStockAlert}
            onChange={(e) =>
              setForm({ ...form, lowStockAlert: e.target.value })
            }
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
            onChange={(e) =>
              setForm({ ...form, productType: e.target.value })
            }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Images
            </label>
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
                  <img
                    key={idx}
                    src={src}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Add Product Button */}
          <button
            type="submit"
            disabled={isAdding}
            className={`flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded md:col-span-2 lg:col-span-3 transition-all duration-200 ${isAdding
              ? "bg-blue-400 text-white cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            {isAdding ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding...</span>
              </>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>

      {/* Product Table */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Products & Stock</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price / Discount</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Low Stock Alert</th>
              <th className="p-3">GST</th>
              <th className="p-3">Type</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                {/* Image */}
                <td className="p-3">
                  <span className=" font-semibold text-gray-600 text-[14px]">
                    ID <span className="text-gray-400">#{p._id.toString().slice(-6)} </span>
                  </span>
                  {p.imagePreviews?.length > 0 ? (
                    <img
                      src={p.imagePreviews[0]}
                      alt={p.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>

                {/* Title */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <input
                      value={editableValues.title}
                      onChange={(e) =>
                        setEditableValues({
                          ...editableValues,
                          title: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    p.title
                  )}
                </td>

                {/* Brand */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <input
                      value={editableValues.brand}
                      onChange={(e) =>
                        setEditableValues({
                          ...editableValues,
                          brand: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    p.brand
                  )}
                </td>

                {/* Category */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <select
                      value={editableValues.category}
                      onChange={(e) =>
                        setEditableValues({
                          ...editableValues,
                          category: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    >
                      <option value="Man">Man</option>
                      <option value="Woman">Woman</option>
                      <option value="Kids">Kids</option>
                    </select>
                  ) : (
                    p.category
                  )}
                </td>

                {/* Price / Discount */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <div className="flex flex-col gap-1">
                      <input
                        type="number"
                        value={editableValues.price}
                        onChange={(e) =>
                          setEditableValues({
                            ...editableValues,
                            price: e.target.value,
                          })
                        }
                        className="border p-1 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Discount"
                        value={editableValues.discountPrice}
                        onChange={(e) =>
                          setEditableValues({
                            ...editableValues,
                            discountPrice: e.target.value,
                          })
                        }
                        className="border p-1 rounded"
                      />
                    </div>
                  ) : (
                    <>
                      ₹{p.price}{" "}
                      {p.discountPrice > 0 && (
                        <span className="line-through text-gray-400 text-sm ml-1">
                          ₹{p.discountPrice}
                        </span>
                      )}
                    </>
                  )}
                </td>

                {/* Stock */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <input
                      type="number"
                      placeholder="Stock"
                      value={editableValues.stock}
                      onChange={(e) =>
                        setEditableValues({
                          ...editableValues,
                          stock: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    <span
                      className={`font-semibold ${p.stock <= p.lowStockAlert
                        ? "text-red-500"
                        : "text-green-600"
                        }`}
                    >
                      {p.stock}
                    </span>
                  )}
                </td>

                {/* Low Stock Alert */}
                <td className="relative pl-8">
                  {editingId === p._id ? (
                    <input
                      type="number"
                      placeholder="Low Stock Alert"
                      value={editableValues.lowStockAlert}
                      onChange={(e) =>
                        setEditableValues({
                          ...editableValues,
                          lowStockAlert: e.target.value,
                        })
                      }
                      className="absolute border top-13 right-0 p-1 rounded w-full"
                    />
                  ) : (
                    <span className="text-gray-600">
                      {p.lowStockAlert || "—"}
                    </span>
                  )}
                </td>

                {/* GST */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <input
                      type="number"
                      placeholder="GST %"
                      value={editableValues.gstRate}
                      onChange={(e) =>
                        setEditableValues({
                          ...editableValues,
                          gstRate: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-20"
                    />
                  ) : (
                    `${p.gstRate || 0}%`
                  )}
                </td>

                {/* Type */}
                <td className="p-3">
                  {editingId === p._id ? (
                    <input
                      placeholder="Type"
                      value={editableValues.productType}
                      onChange={(e) =>
                        setEditableValues({
                          ...editableValues,
                          productType: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    p.productType
                  )}
                </td>

                {/* Actions */}
                <td className="p-3 flex flex-col gap-2">
                  {editingId === p._id ? (
                    <>
                      <button
                        onClick={() => saveChanges(p._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => startEditing(p)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      {deleteConfirmId === p._id ? (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(p._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}

                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-gray-500 mt-3">No products added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Admin;
