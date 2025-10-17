import React, { useState } from "react";
import axios from "axios";

const LeftOptions = ({ selectedOption = "Trending", setSelectedOption = () => {}, setProducts }) => {
  const [minRange, setMinRange] = useState("");
  const [maxRange, setMaxRange] = useState("");

  const options = [
    "Trending",
    "Best Rating",
    "Best Seller",
    "Discount",
    "High to Low",
    "Low to High",
  ];

  // Apply range filter
  const handleApplyRange = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/product/filter", {
        params: { min: minRange, max: maxRange },
      });
setProducts(response.data.products || []); 
    } catch (error) {
      console.error("Error filtering products:", error);
    }
  };

  return (
    <div className="w-full sm:w-72 mt-14 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 py-3">
        <h1 className="text-lg font-bold text-white text-center uppercase tracking-wider drop-shadow-md">
          Filter Products
        </h1>
      </div>

      <div className="p-5">
        <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-gray-700 rounded-full shadow-sm"></span>
          Sort By
        </h2>

        <div className="flex flex-col gap-2 mb-6">
          {options.map((option) => (
            <label
              key={option}
              className="relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer overflow-hidden group"
            >
              <div className="relative flex items-center gap-3 w-full transition-transform duration-300">
                <input
                  type="radio"
                  name="sortOption"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="text-gray-700 focus:ring-gray-500"
                />
                <span
                  className={`transition-colors duration-300 ${
                    selectedOption === option
                      ? "text-gray-900 font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
              </div>
            </label>
          ))}
        </div>

        {/* Price Range Filter */}
        <div>
          <h2 className="text-md font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gray-700 rounded-full shadow-sm"></span>
            Price Range
          </h2>

          <div className="flex items-center justify-between gap-3">
            <input
              type="number"
              placeholder="Min"
              value={minRange}
              onChange={(e) => setMinRange(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
            <span className="text-gray-500 font-semibold">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxRange}
              onChange={(e) => setMaxRange(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:outline-none"
            />
          </div>

          <button
            className="mt-4 w-full bg-gradient-to-r from-gray-500 to-gray-700 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
            onClick={handleApplyRange}
          >
            Apply Range
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftOptions;
