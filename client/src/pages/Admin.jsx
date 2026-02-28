import React, { useState, useRef, useEffect } from "react";
import {
  addProduct,
  addBulk,
  fetchProducts,
  hardDeleteProduct,
  updateProductById,
  deleteMultipleProducts,
  deleteAllProducts,
} from "../api/productApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { LayoutDashboard, PackagePlus, ChevronDown } from "lucide-react";
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
  const [expandedId, setExpandedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // ── Selection state ──────────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false); // bulk selected
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);    // delete all

  // Bulk upload states
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [bulkPreview, setBulkPreview] = useState([]);
  const [bulkHeaders, setBulkHeaders] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // ── Load products ────────────────────────────────────────────────────────────
  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(
        data.products.map((p) => ({ ...p, imagePreviews: p.images || [] }))
      );
      const lowStock = data.products.filter((p) => p.stock <= p.lowStockAlert);
      if (lowStock.length > 0) {
        toast.warning(`${lowStock.length} product(s) are low on stock!`, {
          toastId: "low-stock-warning",
          autoClose: 2000,
        });
      }
    } catch {
      toast.error("Failed to load products");
    }
  };

  useEffect(() => { loadProducts(); }, []);

  // ── Selection helpers ────────────────────────────────────────────────────────
  const allSelected =
    products.length > 0 && selectedIds.size === products.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p._id)));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // ── Delete handlers ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await hardDeleteProduct(id);
      toast.success("Product deleted!");
      setDeleteConfirmId(null);
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      await loadProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteMultipleProducts([...selectedIds]);
      toast.success(`${selectedIds.size} product(s) deleted!`);
      setSelectedIds(new Set());
      setConfirmBulkDelete(false);
      await loadProducts();
    } catch {
      toast.error("Failed to delete selected products");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllProducts();
      toast.success("All products deleted!");
      setSelectedIds(new Set());
      setConfirmDeleteAll(false);
      await loadProducts();
    } catch {
      toast.error("Failed to delete all products");
    }
  };

  // ── Image change ─────────────────────────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const hasChanges = (product) => {
    if (!editingId || !editableValues) return false;
    return Object.keys(editableValues).some((key) => {
      if (key === "newImages") return editableValues.newImages?.length > 0;
      return editableValues[key] !== product[key];
    });
  };

  // ── Bulk file preview ────────────────────────────────────────────────────────
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
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setBulkHeaders(Object.keys(json[0] || {}));
        setBulkPreview(json);
        setShowPreview(true);
      };
      reader.readAsBinaryString(file);
    } else {
      toast.error("Unsupported file format");
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) { toast.warning("Please select a file"); return; }
    try {
      setIsBulkUploading(true);
      const fd = new FormData();
      fd.append("file", bulkFile);
      await addBulk(fd);
      toast.success("Bulk upload successful!");
      await loadProducts();
    } catch {
      toast.error("Bulk upload failed");
    } finally {
      setBulkFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsBulkUploading(false);
    }
  };

  // ── Add product ──────────────────────────────────────────────────────────────
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (isAdding) return;
    try {
      setIsAdding(true);
      const fd = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "images") form.images.forEach((img) => fd.append("images", img));
        else fd.append(key, form[key]);
      });
      await addProduct(fd);
      toast.success("Product added!");
      await loadProducts();
      setForm(initialFormState);
      setImagePreviews([]);
    } catch {
      toast.error("Failed to add product");
    } finally {
      setIsAdding(false);
    }
  };

  // ── Edit helpers ─────────────────────────────────────────────────────────────
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
      description: product.description,
      newImages: [],
    });
  };

  const saveChanges = async (id) => {
    try {
      const fd = new FormData();
      Object.entries(editableValues).forEach(([key, value]) => {
        if (key === "newImages" && value?.length) {
          value.forEach((img) => fd.append("images", img));
        } else if (value !== undefined && value !== null) {
          fd.append(key, String(value));
        }
      });
      await updateProductById(id, fd);
      toast.success("Product updated!");
      setEditingId(null);
      await loadProducts();
    } catch {
      toast.error("Failed to update product");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditableValues({});
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 text-sm">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-xl sm:text-4xl font-bold mb-6 flex items-center gap-2">
        <LayoutDashboard className="w-8 h-8 text-blue-600" />
        Admin Product Management
      </h1>

      {/* ── Add Product ── */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <PackagePlus className="text-blue-500 w-6 h-6" />
          <p className="font-semibold text-lg sm:text-2xl flex-1">Add Product</p>
          <ChevronDown
            className={`transition-transform duration-300 ${showAddForm ? "rotate-180" : ""}`}
          />
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddProduct}
            className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <input type="text" placeholder="Product Title" className="border p-2 rounded" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <textarea placeholder="Description" className="border p-2 rounded md:col-span-2 lg:col-span-3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input type="number" placeholder="Price" className="border p-2 rounded" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input type="number" placeholder="Discount Price" className="border p-2 rounded" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
            <input type="number" placeholder="Stock" className="border p-2 rounded" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <input type="number" placeholder="Low Stock Alert" className="border p-2 rounded" value={form.lowStockAlert} onChange={(e) => setForm({ ...form, lowStockAlert: e.target.value })} />
            <input type="number" placeholder="GST Rate (%)" className="border p-2 rounded" value={form.gstRate} onChange={(e) => setForm({ ...form, gstRate: e.target.value })} />
            <input type="text" placeholder="Product Type" className="border p-2 rounded" value={form.productType} onChange={(e) => setForm({ ...form, productType: e.target.value })} />
            <input type="text" placeholder="Brand" className="border p-2 rounded" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />

            <div className="border p-2 rounded">
              <label className="text-gray-400 text-xs block mb-1">Category</label>
              <div className="flex gap-4 flex-wrap">
                {["Men", "Women", "Kids", "Unisex", "Unisex Kids"].map((cat) => (
                  <label key={cat} className="flex items-center gap-1.5 text-sm">
                    <input type="radio" name="category" value={cat} checked={form.category === cat} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
              <input type="file" multiple accept="image/*" className="border p-2 rounded w-full" onChange={handleImageChange} />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="preview" className="w-16 h-16 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isAdding}
              className={`md:col-span-2 lg:col-span-3 flex items-center justify-center gap-2 py-2 rounded font-semibold transition ${isAdding ? "bg-blue-400 cursor-not-allowed text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {isAdding ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding…</>
              ) : "Add Product"}
            </button>
          </form>
        )}
      </div>

      {/* ── Bulk Upload ── */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowBulkUpload(!showBulkUpload)}
        >
          <PackagePlus className="text-green-600 w-6 h-6" />
          <p className="font-semibold text-lg sm:text-2xl flex-1">Bulk Upload Products</p>
          <ChevronDown className={`transition-transform duration-300 ${showBulkUpload ? "rotate-180" : ""}`} />
        </div>

        {showBulkUpload && (
          <div className="mt-4 border border-dashed rounded-lg p-6 bg-gray-50">
            <p className="text-sm text-gray-500 mb-4">Upload a CSV or Excel file.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => { const f = e.target.files[0]; setBulkFile(f); handlePreviewFile(f); }}
              className="border p-2 rounded w-full mb-4 bg-white cursor-pointer"
            />
            <button
              onClick={handleBulkUpload}
              disabled={isBulkUploading}
              className={`flex items-center gap-2 px-4 py-2 rounded font-semibold ${isBulkUploading ? "bg-green-400 cursor-not-allowed text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
            >
              {isBulkUploading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading…</> : "Upload File"}
            </button>

            {showPreview && bulkPreview.length > 0 && (
              <div className="mt-6">
                <h3 className="text-base font-semibold mb-3">Preview ({bulkPreview.length} rows)</h3>
                <div className="overflow-x-auto max-h-[400px] border rounded-lg bg-white shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>{bulkHeaders.map((h) => <th key={h} className="px-3 py-2 text-left font-semibold text-gray-700 border-b">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {bulkPreview.map((row, i) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                          {bulkHeaders.map((h) => {
                            const v = row[h];
                            const bad = v === null || v === undefined || v === "" || v === 0 || v === "0";
                            return (
                              <td key={h} className={`px-3 py-2 border-b ${bad ? "bg-red-50 text-red-600 font-semibold" : "text-gray-800"}`}>
                                {bad ? "⚠ Missing" : v}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Manage Products ── */}
      <div>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-base sm:text-xl font-semibold">
            Manage Products
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({products.length} total)
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {/* Select all checkbox */}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded"
              />
              {allSelected ? "Deselect All" : "Select All"}
            </label>

            {/* Delete selected */}
            {selectedIds.size > 0 && (
              confirmBulkDelete ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded font-semibold transition"
                  >
                    Confirm Delete ({selectedIds.size})
                  </button>
                  <button
                    onClick={() => setConfirmBulkDelete(false)}
                    className="px-3 py-1.5 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmBulkDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded font-semibold transition"
                >
                  <FaTrash className="text-xs" />
                  Delete Selected ({selectedIds.size})
                </button>
              )
            )}

            {/* Delete all */}
            {confirmDeleteAll ? (
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAll}
                  className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-sm rounded font-semibold transition"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => setConfirmDeleteAll(false)}
                  className="px-3 py-1.5 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-black text-white text-sm rounded font-semibold transition"
              >
                <FaTrash className="text-xs" />
                Delete All
              </button>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-500">No products added yet.</p>
        ) : (
          products.map((p) => (
            <div
              key={p._id}
              className={`bg-white mb-3 rounded-xl shadow-md overflow-hidden border-2 transition-colors duration-200 ${
                selectedIds.has(p._id) ? "border-blue-400" : "border-transparent"
              }`}
            >
              <details
                onToggle={(e) => {
                  if (e.target.open) { startEditing(p); setExpandedId(p._id); }
                  else { cancelEdit(); setExpandedId(null); }
                }}
              >
                <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-gray-50 list-none">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p._id)}
                    onChange={() => toggleSelect(p._id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded flex-shrink-0"
                  />

                  {/* Images */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    {p.images?.slice(0, 2).map((img, i) => (
                      <img key={i} src={img} alt="" className="w-12 h-12 object-cover rounded" />
                    ))}
                  </div>

                  {/* Title + ID */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">#{p._id.toString().slice(-6)}</p>
                  </div>

                  {/* Stock badge */}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                    p.stock <= p.lowStockAlert ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}>
                    Stock: {p.stock}
                  </span>

                  {/* Save / Delete buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {editingId === p._id && hasChanges(p) && (
                      <button
                        onClick={() => saveChanges(p._id)}
                        className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs font-semibold"
                      >
                        <FaSave /> Save
                      </button>
                    )}

                    {deleteConfirmId === p._id ? (
                      <div className="flex gap-1.5">
                        <button onClick={() => handleDelete(p._id)} className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold">
                          <FaTrash /> Confirm
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded text-xs">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(p._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded text-xs"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </summary>

                {/* Expanded edit fields */}
                <div className="p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <label className="text-gray-500 text-xs mb-1">{label}</label>
                      <input
                        type={["price", "discountPrice", "stock", "lowStockAlert", "gstRate"].includes(key) ? "number" : "text"}
                        value={editingId === p._id ? editableValues[key] ?? "" : p[key] ?? ""}
                        onChange={(e) => setEditableValues({ ...editableValues, [key]: e.target.value })}
                        disabled={editingId !== p._id}
                        className={`border p-2 rounded text-sm ${editingId === p._id ? "bg-white" : "bg-gray-50 text-gray-500"}`}
                      />
                    </div>
                  ))}

                  <div className="flex flex-col md:col-span-2 lg:col-span-3">
                    <label className="text-gray-500 text-xs mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingId === p._id ? editableValues.description ?? "" : p.description ?? ""}
                      onChange={(e) => setEditableValues({ ...editableValues, description: e.target.value })}
                      disabled={editingId !== p._id}
                      className={`border p-2 rounded text-sm ${editingId === p._id ? "bg-white" : "bg-gray-50 text-gray-500"}`}
                    />
                  </div>

                  {/* Replace images */}
                  {editingId === p._id && (
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="text-gray-500 text-xs mb-1 block">Replace Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setEditableValues({ ...editableValues, newImages: Array.from(e.target.files) })}
                        className="text-sm"
                      />
                    </div>
                  )}
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Admin;