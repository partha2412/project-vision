import React, { useState, useRef, useEffect } from "react";
import { addProduct, addBulk, fetchProducts, hardDeleteProduct, updateProductById } from "../api/productApi";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { LayoutDashboard, PackagePlus, ChevronDown } from 'lucide-react';
import Papa from "papaparse";
import * as XLSX from "xlsx";

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
  const [editable, setEditable] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Bulk upload states
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [bulkPreview, setBulkPreview] = useState([]);
  const [bulkHeaders, setBulkHeaders] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

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

      const lowStockItems = data.products.filter(
        (p) => p.stock <= p.lowStockAlert
      );
      if (lowStockItems.length > 0) {
        toast.warning(`${lowStockItems.length} product(s) are low on stock!`, {
          toastId: "low-stock-warning",
          position: "top-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handle image upload (for new product)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };
  // Function to check if any field has changed
  const hasChanges = (product) => {
    if (!editingId || !editableValues) return false;

    // Compare each field
    return Object.keys(editableValues).some((key) => {
      if (key === "newImages") {
        return editableValues.newImages?.length > 0; // new images added
      }
      return editableValues[key] !== product[key];
    });
  };

  const handlePreviewFile = (file) => {
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setBulkHeaders(Object.keys(result.data[0] || {}));
          setBulkPreview(result.data);
          setShowPreview(true);
        },
      });
    }
    else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        setBulkHeaders(Object.keys(jsonData[0] || {}));
        setBulkPreview(jsonData);
        setShowPreview(true);
      };
      reader.readAsBinaryString(file);
    }
    else {
      toast.error("Unsupported file format");
    }
  };

  // Add in Bulk
  const handleBulkUpload = async () => {
    if (!bulkFile) {
      toast.warning("Please select a CSV or Excel file");
      return;
    }

    try {
      setIsBulkUploading(true);

      const formData = new FormData();
      formData.append("file", bulkFile); // 🔥 MUST be "file"

      const res = await addBulk(formData);
      //console.log(res.data.data[0]);
      
      toast.success("✅ Bulk products uploaded successfully!");
      await loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("❌ Bulk upload failed");
    } finally {
      setBulkFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsBulkUploading(false);
    }
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

  // Start editing
  const startEditing = (product) => {
    // setEditable(!editable);
    // console.log(editable);

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
      description: product.description,
      newImages: [],
    });
  };

  // Save changes
  const saveChanges = async (id) => {
    try {
      const formData = new FormData();

      Object.entries(editableValues).forEach(([key, value]) => {
        if (key === "newImages" && value?.length) {
          // Append multiple images
          value.forEach((img) => formData.append("images", img));
        } else if (value !== undefined && value !== null) {
          // Convert numbers/booleans to string for FormData
          formData.append(key, String(value));
        }
      });
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      // Call your API
      await updateProductById(id, formData);

      toast.success("✅ Product updated successfully!");
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      // console.error("Error updating product:", error);
      toast.error("❌ Failed to update product");
    }
  };


  // Delete product
  const handleDelete = async (id) => {
    try {
      await hardDeleteProduct(id);
      toast.success("🗑️ Product deleted successfully!");
      setDeleteConfirmId(null);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditableValues({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <LayoutDashboard className="w-8 h-8 text-blue-600" /> Admin Product Management
      </h1>

      {/* ➕ Add Product Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="flex items-center w-full gap-3 cursor-pointer" onClick={(e) => setShowAddForm(!showAddForm)}>
          <PackagePlus className="text-blue-500 size-15" />
          <p className="font-semibold text-2xl w-100">
            Add Product
          </p>
          <div className="w-full flex justify-end">
            <span className="flex">
              <ChevronDown />
            </span>
          </div>
        </div>
        {showAddForm ? (
          <div>
            <h2 className="text-xl font-semibold mb-4"></h2>
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
                placeholder="Product Type"
                className="border p-2 rounded"
                value={form.productType}
                onChange={(e) => setForm({ ...form, productType: e.target.value })}
              />
              <div className="border p-2 rounded">
                <label className=" opacity-55">Select Product Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value="Men"
                      checked={form.category === "Men"}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                    Men
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value="Women"
                      checked={form.category === "Women"}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                    Women
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category"
                      value="Kids"
                      checked={form.category === "Kids"}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                    Kids
                  </label>
                </div>
              </div>

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

              {/* Add Button */}
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
        ) : null}
      </div>

      {/* 📂 Bulk Product Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div
          className="flex items-center w-full gap-3 cursor-pointer"
          onClick={() => setShowBulkUpload(!showBulkUpload)}
        >
          <PackagePlus className="text-green-600 size-15" />
          <p className="font-semibold text-2xl w-100">
            Bulk Upload Products
          </p>
          <div className="w-full flex justify-end">
            <ChevronDown />
          </div>
        </div>

        {showBulkUpload && (
          <div className="mt-4 border border-dashed rounded-lg p-6 bg-gray-50">
            <p className="text-sm text-gray-600 mb-4">
              Upload a CSV or Excel file containing multiple products.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => {
                const file = e.target.files[0];
                setBulkFile(file);
                handlePreviewFile(file);
              }}
              className="border p-2 rounded w-full mb-4 bg-white cursor-pointer hover:bg-gray-200"
            />

            <button
              onClick={handleBulkUpload}
              disabled={isBulkUploading}
              className={`flex items-center justify-center gap-2 font-semibold px-4 py-2 rounded transition-all duration-200 ${isBulkUploading
                ? "bg-green-400 cursor-not-allowed text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
                }`}
            >
              {isBulkUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                "Upload File"
              )}
            </button>

            {/* Bulk Preview */}
            {showPreview && bulkPreview.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Preview ({bulkPreview.length} rows)
                </h3>

                <div className="overflow-x-auto max-h-[400px] border rounded-lg bg-white shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        {bulkHeaders.map((header) => (
                          <th
                            key={header}
                            className="px-3 py-2 text-left font-semibold text-gray-700 border-b"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {bulkPreview.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 "
                        >
                          {bulkHeaders.map((header) => {
                            const value = row[header];

                            const isInvalid =
                              value === null ||
                              value === undefined ||
                              value === "" ||
                              value === 0 ||
                              value === "0";

                            return (
                              <td
                                key={row[rowIndex]}
                                className={`px-3 py-2 border-b ${isInvalid
                                  ? "bg-red-50 text-red-600 font-semibold"
                                  : "text-gray-800"
                                  }`}
                              >
                                <div className="max-h-[40px] overflow-y-auto">
                                  {isInvalid ? "⚠ Missing" : value}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  ⚠ Highlighted cells contain empty or zero values.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 📦 Product Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage Products</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          products.map((p) => (
            <details
              key={p._id}
              className="bg-white mb-4 rounded-xl shadow-md overflow-hidden"
              onToggle={(e) => {
                if (e.target.open) {
                  // The details is now open
                  // onsole.log("Details opened for product:", p._id);
                  // Do something, e.g., make fields editable
                  startEditing(p);
                  setExpandedId(p._id);
                } else {
                  // The details is now closed
                  // console.log("Details closed for product:", p._id);
                  cancelEdit();
                  setExpandedId(null);
                }
              }}
            //open={expandedId === p._id} // optional: control programmatically

            >
              <summary className="flex justify-between items-center cursor-pointer bg-gray-50 px-4 py-3">
                <div className="font-semibold text-gray-800">
                  {p.title}{" "}
                  <span className="text-gray-400 text-sm">
                    #{p._id.toString().slice(-6)}
                  </span>


                  {/* Image section */}
                  <div className="md:col-span-2 lg:col-span-3">
                    {/* <p className="text-sm font-medium text-gray-700 mb-2">
                    Images
                  </p> */}
                    <div className="flex flex-wrap gap-2">
                      {p.images?.length > 0 ? (
                        p.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="product"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No images</p>
                      )}
                    </div>
                    {editingId === p._id && (
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          setEditableValues({
                            ...editableValues,
                            newImages: Array.from(e.target.files),
                          })
                        }
                        className="mt-2 text-sm"
                      />
                    )}
                  </div>


                </div>
                <div className="relative flex items-center gap-3">
                  {/* Actions */}
                  <div className="md:col-span-2 lg:col-span-3 flex flex-wrap gap-3 mt-3">
                    {editingId === p._id ? (
                      <>
                        {editingId === p._id && hasChanges(p) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // ✅ prevents <summary> toggle
                              saveChanges(p._id)
                            }}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                          >
                            <FaSave /> Save
                          </button>
                        )}

                        {/* <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        >
                          <FaTimes /> Cancel
                        </button> */}
                      </>
                    ) : (
                      <div className=" absolute flex right-40 top-0 items-center gap-3">
                        {/* <button
                          onClick={() => startEditing(p)}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          <FaEdit /> Edit
                        </button> */}
                        {deleteConfirmId === p._id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDelete(p._id)}
                              className="flex items-center h-8 gap-2 bg-red-600 hover:bg-red-700 duration-300 text-white px-4 py-2 rounded"
                            >
                              <FaTrash /> Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="flex items-center h-8 gap-2 bg-gray-400 hover:bg-gray-500 duration-300 text-white px-4 py-2 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(p._id)}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 duration-300 text-white px-4 py-2 rounded"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span
                    className={`font-semibold ${p.stock <= p.lowStockAlert
                      ? "text-red-500"
                      : "text-green-600"
                      }`}
                  >
                    Stock: {p.stock}
                  </span>
                </div>
              </summary>

              <div className="">
                <div className="p-4 w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Editable fields */}
                  {[
                    { key: "title", label: "Product Title" },
                    { key: "brand", label: "Brand" },
                    { key: "category", label: "Category" },
                    { key: "price", label: "Price (₹)" },
                    { key: "discountPrice", label: "Discount Price (₹)" },
                    { key: "stock", label: "Stock Quantity" },
                    { key: "lowStockAlert", label: "Low Stock Alert" },
                    { key: "gstRate", label: "GST Rate (%)" },
                    { key: "productType", label: "Product Type" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col">
                      <label
                        htmlFor={key}
                        className="text-gray-500 text-[15px] mb-1"
                      >
                        {label}
                      </label>
                      <input
                        id={key}
                        type={
                          ["price", "discountPrice", "stock", "lowStockAlert", "gstRate"].includes(
                            key
                          )
                            ? "number"
                            : "text"
                        }
                        placeholder={label}
                        value={
                          editingId === p._id
                            ? editableValues[key]
                            : p[key] || ""
                        }
                        onChange={(e) =>
                          setEditableValues({
                            ...editableValues,
                            [key]: e.target.value,
                          })
                        }
                        disabled={editingId !== p._id}
                        className={`border p-2 rounded ${editingId === p._id
                          ? "bg-white"
                          : "bg-gray-100 text-gray-500"
                          }`}
                      />
                    </div>
                  ))}


                  {/* Description */}
                  <div className="flex flex-col md:col-span-2 lg:col-span-3">
                    <span className="text-gray-500 text-[15px]">Description</span>
                    <textarea
                      placeholder="Description"
                      rows="2"
                      value={
                        editingId === p._id
                          ? editableValues.description
                          : p.description || ""
                      }
                      onChange={(e) =>
                        setEditableValues({
                          ...editableValues,
                          description: e.target.value,
                        })
                      }
                      disabled={editingId !== p._id}
                      className={`border p-2 w-full rounded md:col-span-2 lg:col-span-3 ${editingId === p._id
                        ? "bg-white"
                        : "bg-gray-100 text-gray-500"
                        }`}
                    />

                  </div>


                </div>
              </div>

            </details>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;
