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
    <div className="w-full sm:w-72 mt-14 bg-white rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
      {/* Sidebar Title */}
      <div className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 p-4">
        <h1 className="text-lg font-bold text-white text-center uppercase tracking-wider drop-shadow-md">
          Filter Products
        </h1>
      </div>

      {/* All Options */}
      <div className="flex flex-col divide-y divide-gray-100">
        {/* Sorting */}
        <div className="p-5">
          <h2 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gradient-to-b from-violet-600 to-pink-500 rounded-full shadow-sm"></span>
            Sort By
          </h2>
          <div className="flex flex-col gap-2">
            {options.map((option) => (
              <label
              key={option}
              className="relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer overflow-hidden"
              >
              {/* Animated background layer */}
              <span
               className={`absolute inset-0 rounded-lg transition-opacity duration-500 ease-in-out ${
               selected === option
               ? "bg-gradient-to-r from-violet-50 to-pink-50 opacity-100"
                : "opacity-0"
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
              className="accent-fuchsia-600 scale-110 transition-transform duration-300"
              />
             <span
             className={`transition-colors duration-300 ${
             selected === option
            ? "text-pink-700 font-semibold"
            : "text-gray-700"
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
        <div className="p-5 bg-gray-50">
          <h2 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-gradient-to-b from-violet-600 to-pink-500 rounded-full shadow-sm"></span>
            Price Range
          </h2>
          <label className="text-[15px] text-gray-700">
            <span className="font-semibold">₹0 - ₹{value}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="accent-fuchsia-600 w-full mt-3 cursor-pointer transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default LeftOptions;
