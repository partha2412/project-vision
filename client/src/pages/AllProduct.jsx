import React, { useState, useEffect, useCallback } from "react";
import LeftOptions from "../components/LeftOptions";
import ProductCard from "../components/ProductCard";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { fetchProductsByCategory, fetchSortedProducts } from "../api/productApi";

export default function AllProducts() {
  const [showOptions, setShowOptions] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState(null);
  const [category, setCategory] = useState("All");

  const productsPerPage = 9;

  // Fetch products by category from backend
  // Fetch products by category
  const fetchProducts = useCallback(async (cat) => {
    try {
      setLoading(true);
      const data = await fetchProductsByCategory(cat);
      setProducts(data.products || []);
      setCurrentPage(1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchProducts(category);
  }, [category, fetchProducts]);


  // Handle sort change
  useEffect(() => {
    const fetchSorted = async () => {
      if (!selectedSort) return;
      try {
        setLoading(true);
        const data = await fetchSortedProducts(selectedSort);
        setProducts(data.products || []);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to sort products");
      } finally {
        setLoading(false);
      }
    };
    fetchSorted();
  }, [selectedSort]);

  // Filter products by search
  const filteredProducts = products.filter((product) =>
    (product.name || product.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out bg-white shadow-xl border-r border-gray-200 ${showOptions ? "w-72" : "w-0"
          } overflow-hidden`}
      >
        <LeftOptions
          selectedOption={selectedSort}
          setSelectedOption={setSelectedSort}
          setProducts={setProducts}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-300 shadow-md hover:shadow-lg transition duration-300"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transform transition duration-300 ${showOptions ? "rotate-45 translate-y-2" : ""
                  }`}
              ></span>
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transition-opacity duration-300 ${showOptions ? "opacity-0" : "opacity-100"
                  }`}
              ></span>
              <span
                className={`block h-0.5 w-6 rounded-full bg-gray-800 transform transition duration-300 ${showOptions ? "-rotate-45 -translate-y-2" : ""
                  }`}
              ></span>
            </div>
          </button>

          <h1 className="text-2xl font-semibold text-gray-800">All Products</h1>
        </div>

        {/* Search */}
        <div className="mb-4 max-w-3xl mx-auto relative">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["All", "Man", "Woman", "Kids"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);               // Update the state
                fetchProductsByCategory(cat);   // Fetch products immediately
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${category === cat
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
            >
              {cat}
            </button>
          ))}

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
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`px-4 py-2 border border-gray-300 rounded-md ${currentPage === i + 1
                      ? "bg-gray-800 text-white"
                      : "hover:bg-gray-200"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
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
