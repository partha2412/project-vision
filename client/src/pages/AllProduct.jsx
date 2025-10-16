import React, { useState, useEffect, useCallback } from "react";
import LeftOptions from "../components/LeftOptions";
import ProductCard from "../components/ProductCard";
import { fetchProducts, sortProducts } from "../api/productApi"; // Adjust as needed
import { FiSearch } from "react-icons/fi";


export default function AllProducts() {
  const [showOptions, setShowOptions] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null); // "asc" / "desc"
  const productsPerPage = 9;

  // Fetch products
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sorting handler
  const handleSortChange = async (order) => {
    try {
      setSortOrder(order);
      setLoading(true);
      const data = await sortProducts(order); // API should support sorting
      setProducts(data.products || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to sort products");
    } finally {
      setLoading(false);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter((product) =>
    (product.name || product.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-white">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out bg-white shadow-xl border-r border-gray-200 ${
          showOptions ? "w-72" : "w-0"
        } overflow-hidden`}
      >
        <LeftOptions onSortChange={handleSortChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Sidebar Toggle */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition duration-300"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transform transition duration-300 ${
                  showOptions ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transition-opacity duration-300 ${
                  showOptions ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transform transition duration-300 ${
                  showOptions ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </div>
          </button>

          <h1 className="text-2xl font-semibold text-gray-800">All Products</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-3xl mx-auto relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Products Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 max-w-[1200px] mx-auto">
              {currentProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-4"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-3">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`px-4 py-2 border rounded-md ${
                      currentPage === i + 1 ? "bg-green-600 text-white" : "hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
