import React, { useContext } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Carousl_SingleProduct from "../components/Carousl_SingleProduct";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);

  if (!product?._id) return null;

  // Check if the product is in wishlist (safe)
  const inWishlist = Array.isArray(wishlist) && wishlist.some(w => w?._id === product?._id);

  // Check if the product is in cart (safe)
  const inCart = Array.isArray(cart?.items) && cart.items.some(i => i.product?._id === product?._id);


  // Toggle wishlist
  const toggleWishlist = (e) => {

    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) removeFromWishlist(product._id);
    else addToWishlist(product);
  };

  // Toggle cart
  const toggleCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) removeFromCart(product._id);
    else addToCart(product, 1);
  };

  // Render stars
  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return <FaStar key={i} />;
      if (i < rating) return <FaStarHalfAlt key={i} />;
      return <FaRegStar key={i} />;
    });

  return (
    <Link to={`/product/${product._id}`} className="block">
      <div className="relative bg-white rounded-xl overflow-hidden transform transition-all duration-300 ">
        {/* Product images */}
        <div className="relative w-full h-56 bg-gray-50 hover:-translate-y-2 hover:scale-110 duration-300">
          <Carousl_SingleProduct images={product.images || []} />
        </div>

        {/* Product info */}
        <div className="p-4">
          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className="absolute mx-4 top-60 right-12 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex justify-center items-center border border-red-500/50 shadow-lg hover:scale-110 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={inWishlist ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 ${inWishlist ? "text-red-600" : "text-gray-600"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          </button>

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="absolute top-60 right-4 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex justify-center items-center border border-red-500/50 shadow-lg hover:scale-110 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={inCart ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-6 h-6 ${inCart ? "text-red-600" : "text-gray-600"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293A1 1 0 007 17h12M7 13l1.293-2.293A1 1 0 009 10h12M17 21a2 2 0 100-4 2 2 0 000 4zm-10 0a2 2 0 100-4 2 2 0 000 4z"
              />
            </svg>
          </button>
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <p className="text-gray-600">{product.brand}</p>
          <div className="flex items-center text-yellow-500 mt-2">
            {renderStars(product.rating)}
            <span className="ml-2 text-sm text-gray-500">{product.rating?.toFixed(1) || "0.0"}</span>
          </div>
          <p className="mt-1">
            <span className="font-bold">₹{product.discountPrice ?? 0}</span>{" "}
            <span className="line-through text-sm text-gray-500">₹{product.price ?? 0}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
