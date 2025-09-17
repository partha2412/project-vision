import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../datas/product";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  // Toggle wishlist
  const toggleWish = (item) => {
    const exists = wishlist.some((w) => w.id === item.id);
    if (exists) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  // Auto-slide every 3 seconds
  useEffect(() => {
    if (!product) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product]);

  if (!product) return <div className="p-6">Product not found</div>;

  // Discount calculation
  const discount = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating))
        return <FaStar key={i} className="text-yellow-500" />;
      if (i < rating) return <FaStarHalfAlt key={i} className="text-yellow-500" />;
      return <FaRegStar key={i} className="text-yellow-500" />;
    });
  };

  return (
    <div className="p-6">
      <Link
        to="/products"
        className="inline-flex items-center px-4 py-2 bg-teal-900 text-white font-semibold rounded-lg shadow-md hover:bg-teal-400 transition-colors duration-300"
      >
        &larr; Back to products
      </Link>

      <div className="mt-4 flex flex-col md:flex-row gap-8">
        {/* Left: Image Section */}
        <div className="md:w-3/4">
          {/* Main Image Slider */}
          <div className="w-full h-[450px] overflow-hidden relative rounded-lg shadow-xl border-2 border-gray-200">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {product.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.name} ${i}`}
                  className="w-full h-full object-contain flex-shrink-0"
                />
              ))}
            </div>

            {/* Wishlist Heart on Big Image */}
            <button
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm 
                         w-10 h-10 rounded-full flex justify-center items-center shadow-md 
                         hover:scale-110 transition"
              onClick={() => toggleWish(product)}
            >
              {wishlist.find((w) => w.id === product.id) ? (
                // Filled Heart
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
                // Outline Heart
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

          {/* Stylish Dot Navigation */}
          <div className="flex justify-center mt-4 gap-3">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                  currentIndex === i
                    ? "bg-blue-300 border-blue-700 shadow-lg transform scale-120"
                    : "bg-white border-gray-400"
                }`}
                aria-label={`Go to image ${i + 1}`}
              ></button>
            ))}
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-3 mt-4">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`border rounded overflow-hidden cursor-pointer transition-transform duration-300 ${
                  currentIndex === i
                    ? "ring-2 ring-blue-500 scale-105 shadow-md"
                    : "border-gray-300"
                }`}
                aria-label={`Show image ${i + 1}`}
              >
                <img
                  src={src}
                  alt={`${product.name}-${i}`}
                  className="w-20 h-20 object-contain"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="text-gray-600 font-bold">Size : {product.size}</p>
          <p className="text-gray-600 font-bold">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-500 ml-2">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Price & Discount */}
          <div className="mt-4">
            <span className="text-4xl font-semibold">₹{product.price}</span>
            <span className="line-through text-gray-500 ml-3">
              ₹{product.oldPrice}
            </span>
            <span className="ml-3 text-green-600 font-bold">{discount}% OFF</span>
          </div>

          <p className="mt-4">{product.description}</p>

          <div className="mt-6 flex gap-3">
            <button className="bg-teal-400 text-blue-950 px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-300 font-medium">
              Add to Cart
            </button>
            <button className="px-4 py-2 bg-red-500 rounded hover:bg-red-700 transition-colors duration-300 font-medium">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {/* Other Div */}
      <div className="bg-amber-400 mt-4 h-screen">
        next section
      </div>
    </div>
  );
}
