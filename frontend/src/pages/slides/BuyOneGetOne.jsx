import React from "react";
import lens from "../../photo/lens.webp";

const BuyOneGetOne = () => {
  return (
    <div className="relative w-full h-auto overflow-hidden rounded-lg shadow-lg">
      {/* Text first in the DOM */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
       
       
      </div>

      {/* Banner Image */}
      <img
        src={lens}
        alt="Buy One Get One Free"
        className="w-full h-full object-cover"
      />

      {/* Optional Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/0"></div>
    </div>
  );
};

export default BuyOneGetOne;