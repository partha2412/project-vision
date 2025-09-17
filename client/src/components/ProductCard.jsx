import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Carousl_SingleProduct from "../components/Carousl_SingleProduct";
import { WishlistContext } from "../context/WishlistContext";

export default function ProductCard({ product }) {
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  // Toggle wishlist (add or remove)
  const toggleWish = (item) => {
    const exists = wishlist.some((w) => w.id === item.id);
    if (exists) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return <FaStar key={i} />;
      if (i < rating) return <FaStarHalfAlt key={i} />;
      return <FaRegStar key={i} />;
    });
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-white rounded-xl shadow-md overflow-hidden 
                 transform transition-all duration-300
                 hover:-translate-y-2 hover:scale-105 hover:shadow-2xl 
                 active:scale-95"
    >
      {/* Image Carousel */}
      <div className="relative w-full h-56 bg-gray-50">
        <Carousl_SingleProduct images={product.images} />

        {/* Wishlist Heart */}
        <button
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm 
                     w-10 h-10 rounded-full flex justify-center items-center shadow-md 
                     hover:scale-110 transition"
          onClick={(e) => {
            e.preventDefault(); // prevent navigating to product page when clicking heart
            toggleWish(product);
          }}
        >
          {wishlist.find((w) => w.id === product.id) ? (
            // Filled Heart (if in wishlist)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-red-600"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 
                2 12.28 2 8.5 2 5.42 4.42 3 7.5 3 
                c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
                14.76 3 16.5 3 19.58 3 22 5.42 
                22 8.5c0 3.78-3.4 6.86-8.55 
                11.54L12 21.35z" />
            </svg>
          ) : (
            // Outline Heart (not in wishlist)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5
                -1.935 0-3.597 1.126-4.312 2.733
                -.715-1.607-2.377-2.733-4.313-2.733
                C5.1 3.75 3 5.765 3 8.25c0 7.22 
                9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.brand}</p>

        {/* ⭐ Rating */}
        <div className="flex items-center text-yellow-500 mt-2">
          {renderStars(product.rating)}
          <span className="ml-2 text-sm text-gray-500">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <p className="mt-1">
          <span className="font-bold">₹{product.price}</span>{" "}
          <span className="line-through text-sm text-gray-500">
            ₹{product.oldPrice}
          </span>
        </p>

        {/* Add to Cart Button */}
        <button
          className="mt-3 w-full bg-teal-600 text-white py-2 rounded-lg 
                     hover:bg-teal-700 transition-colors duration-300 font-bold"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
