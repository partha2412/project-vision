import React from "react";

const LeftOptions = ({ selectedOption = "Trending", setSelectedOption = () => {} }) => {
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
      <div className="bg-gradient-to-r from-green-600 to-teal-600 py-3">
        <h1 className="text-lg font-bold text-white text-center uppercase tracking-wider drop-shadow-md">
          Filter Products
        </h1>
      </div>

      <div className="p-5">
        <h2 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-green-600 rounded-full shadow-sm"></span>
          Sort By
        </h2>

        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <label
              key={option}
              className="relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer overflow-hidden group"
            >
              <span
                className={`absolute inset-0 rounded-lg transition-opacity duration-500 ease-in-out ${
                  selectedOption === option
                    ? "bg-gradient-to-r from-green-100 via-green-200 to-green-100 opacity-80"
                    : "opacity-0 group-hover:opacity-20"
                }`}
              ></span>

              <div className="relative flex items-center gap-3 w-full transition-transform duration-300">
                <input
                  type="radio"
                  name="sortOption"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span
                  className={`transition-colors duration-300 ${
                    selectedOption === option
                      ? "text-green-700 font-semibold"
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
    </div>
  );
};

export default LeftOptions;
