import React, { useState, useEffect } from "react";
import LeftOptions from "../components/LeftOptions";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../api/productApi"; // adjust the path

export default function AllProducts() {
  const [showOptions, setShowOptions] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        // If your API returns { success: true, products: [...] }
        setProducts(data.products || []); // <- make sure this is an array
      } catch (err) {
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);


  return (
    <div className="flex relative p-5">
      {/* Toggle Button */}
      <div className="absolute left-4 top-4 z-50">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition duration-300"
        >
          {/* Hamburger / X */}
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
      </div>

      {/* Sidebar */}
      <div
        className={`absolute z-30 top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${showOptions ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <LeftOptions />
      </div>

      {/* Products Grid */}
      <div className="flex-1">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div
            className="grid gap-6 
                       grid-cols-1 
                       sm:grid-cols-2 
                       md:grid-cols-3 
                       lg:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
