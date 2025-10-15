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
    <div className="w-full sm:w-72 mt-14 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      {/* Sidebar Title */}
      <div className="bg-gradient-to-r bg-teal-600">
        <h1 className="text-lg font-bold text-white text-center uppercase tracking-wider drop-shadow-md">
          Filter Products
        </h1>
      </div>

      {/* All Options */}
      <div className="flex flex-col divide-y divide-gray-200">
        {/* Sorting */}
        <div className="p-5">
          <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gradient-to-b bg-teal-600 rounded-full shadow-sm"></span>
            Sort By
          </h2>
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label
                key={option}
                className="relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer overflow-hidden group"
              >
                {/* Animated background */}
                <span
                  className={`absolute inset-0 rounded-lg transition-opacity duration-500 ease-in-out ${
                    selected === option
                      ? "bg-gradient-to-r from-green-100 via-green-200 to-green-100 opacity-80"
                      : "opacity-0 group-hover:opacity-20"
                  }`}
                ></span>

                {/* Content */}
                <div className="relative flex items-center gap-3 w-full transition-transform duration-300">
                  <input
                    type="radio"
                    name="sortOption"
                    value={option}
                    checked={selected === option}
                    onChange={() => setSelected(option)}
                    className="bg-teal-600 scale-110 transition-transform duration-300"
                  />
                  <span
                    className={`transition-colors duration-300 ${
                      selected === option
                        ? "text-teal-600 font-semibold"
                        : "text-gray-700 group-hover:bg-teal-600"
                    }`}
                  >
                    {option}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="p-5 bg-green-50">
          <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gradient-to-b bg-teal-600 rounded-full shadow-sm"></span>
            Price Range
          </h2>
          <label className="text-sm text-gray-700">
            <span className="font-semibold">₹0 - ₹{value}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-teal-600 w-full mt-3 cursor-pointer transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default LeftOptions;
