import React, { useState } from "react";

const LeftOptions = () => {
  const [selected, setSelected] = useState("Trending");
  const [value, setValue] = useState(50);

  const options = [
    "Trending",
    "Best Rating",
    "Best Seller",
    "Discount",
    "High to Low",
    "Low to High",
  ];

  return (
    <div className="w-full sm:w-72 mt-14 bg-white  overflow-hidden shadow-2xl">
      {/* Sidebar Title */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <h1 className="text-xl font-bold text-white text-center">
          Filter Products
        </h1>
      </div>

      {/* All Options */}
      <div className="flex flex-col divide-y divide-gray-200">
        {/* Sorting */}
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Sort By
          </h2>
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sortOption"
                  value={option}
                  checked={selected === option}
                  onChange={() => setSelected(option)}
                  className="accent-purple-600 group-hover:scale-110 transition"
                />
                <span
                  className={`${
                    selected === option
                      ? "text-purple-700 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="p-4 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Price Range
          </h2>
          <label className="text-[16px] text-gray-700">
            <span className="font-semibold">₹0 - ₹{value}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="accent-purple-600 w-full mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default LeftOptions;
