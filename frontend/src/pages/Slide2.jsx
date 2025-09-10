import React from "react";
import { useNavigate } from "react-router-dom";

import airflex from "../photo/airflex.webp";
import aviator from "../photo/aviator.webp";
import blend from "../photo/blend.webp";
import cateeye from "../photo/cateeye.webp";
import clipon from "../photo/clipon.webp";
import clubmaster from "../photo/clubmaster.webp";
import image179 from "../photo/image179.webp";
import trans from "../photo/trans.webp";

const Slide2 = () => {
  const navigate = useNavigate();

  const images = [
    { src: airflex, name: "airflex", route: "/airflex" },
    { src: aviator, name: "aviator", route: "/aviator" },
    { src: blend, name: "blend", route: "/blend" },
    { src: cateeye, name: "cateeye", route: "/cateeye" },
    { src: clipon, name: "clipon", route: "/clipon" },
    { src: clubmaster, name: "clubmaster", route: "/clubmaster" },
    { src: image179, name: "image179", route: "/image179" },
    { src: trans, name: "trans", route: "/trans" },
  ];

  return (
    <div className="w-full bg-white flex items-center p-6">
      {/* Left Side Text */}
      <div className="min-w-[200px] mr-6">
        <h1 className="text-3xl md:text-4xl text-black font-bold leading-snug">
          WEAR THE TREND
        </h1>
        <p className="text-sm text-gray-700 font-semibold mt-2">
          Our hottest collections
        </p>
      </div>

      {/* Right Side Images */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {images.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-1/3 sm:w-1/4 bg-gray-100 rounded-lg flex flex-col items-center justify-between p-2"
          >
            <img
              src={item.src}
              alt={item.name}
              className="w-full h-32 object-contain"
            />

            <button
              className="mt-2 px-3 py-1 bg-black text-white text-sm font-semibold rounded-md"
              onClick={() => navigate(`/products/${item.name}`)}
            >
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slide2;