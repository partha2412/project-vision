import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { WishlistContext } from "../context/WishlistContext";
import Slide1 from "./product_details_Bottom_Slides/Slide1";
import ReviewPage from "./ReviewPage";
import { fetchProductById } from "../api/productApi";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("Medium");

  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

  const toggleWish = (item) => {
    const exists = wishlist.some((w) => w._id === item._id);
    exists ? removeFromWishlist(item._id) : addToWishlist(item);
  };

  // Fetch product from backend
  useEffect(() => {
    const getProduct = async () => {
      try {
        const productData = await fetchProductById(id);
        setProduct(productData.product);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  // Image slider
  useEffect(() => {
    if (!product) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [product]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6">Product not found</div>;

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(rating)) return <FaStar key={i} className="text-yellow-500" />;
      if (i < rating) return <FaStarHalfAlt key={i} className="text-yellow-500" />;
      return <FaRegStar key={i} className="text-yellow-500" />;
    });

  const checkDelivery = () => {
    if (!pincode) setDeliveryMsg("Please enter a valid pincode.");
    else if (pincode.startsWith("7")) setDeliveryMsg("Delivery available within 3-5 days ✅");
    else setDeliveryMsg("Delivery not available in this area ❌");
  };

  const inStock = product.status !== "Out of Stock" && product.stock > 0;

  return (
    <div className="p-6">
      <Link
        to="/products"
        className="inline-flex items-center px-4 py-2 bg-teal-900 text-white font-semibold rounded-lg shadow-md hover:bg-teal-400 transition-colors duration-300"
      >
        &larr; Back to products
      </Link>

      <div className="mt-4 flex flex-col md:flex-row gap-8">
        {/* Left: Image Slider */}
        <div className="md:w-3/4">
          <div className="w-full h-[450px] overflow-hidden relative rounded-lg shadow-xl border-2 border-gray-200">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {product.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.title} ${i}`}
                  className="w-full h-full object-contain flex-shrink-0"
                />
              ))}
            </div>

            {/* Wishlist Heart */}
            <button
              className="absolute top-4 right-4 bg-white/90 w-10 h-10 rounded-full flex justify-center items-center shadow-md hover:scale-110 transition"
              onClick={() => toggleWish(product)}
            >
              {wishlist.find((w) => w._id === product._id) ? (
                <span className="text-red-600 text-2xl">♥</span>
              ) : (
                <span className="text-gray-600 text-2xl">♡</span>
              )}
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex justify-center gap-3 mt-4">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`border rounded overflow-hidden cursor-pointer transition-transform duration-300 ${currentIndex === i ? "ring-2 ring-blue-500 scale-105 shadow-md" : "border-gray-300"
                  }`}
              >
                <img src={src} alt={`${product.title}-${i}`} className="w-20 h-20 object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold">{product.title}</h2>
          <p className="text-gray-600 font-bold">{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {renderStars(
              product.reviews && product.reviews.length > 0
                ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
                : 0
            )}
            <span className="text-sm text-gray-500 ml-2">
              {product.reviews && product.reviews.length > 0
                ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
                : "0.0"} / 5
            </span>
          </div>


          {/* Price */}
          <div className="mt-4">
            <span className="text-4xl font-semibold">
              ₹{product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="line-through text-gray-500 ml-3">₹{product.price}</span>
            )}
            {discount > 0 && (
              <span className="ml-3 text-green-600 font-bold">{discount}% OFF</span>
            )}
          </div>

          {/* Variants */}
          <div className="mt-4">
            <p className="font-semibold">Select Color:</p>
            <div className="flex gap-2 mt-1">
              {["Black", "Blue", "Brown"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1 border rounded ${selectedColor === color ? "bg-teal-500 text-white" : ""
                    }`}
                >
                  {color}
                </button>
              ))}
            </div>
            <p className="mt-3 font-semibold">Select Size:</p>
            <div className="flex gap-2 mt-1">
              {["Small", "Medium", "Large"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded ${selectedSize === size ? "bg-teal-500 text-white" : ""
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Info */}
          <p className={`mt-3 font-bold ${inStock ? "text-green-600" : "text-red-600"}`}>
            {inStock ? "In Stock ✅" : "Out of Stock ❌"}
          </p>
          {inStock && product.stock <= product.lowStockAlert && (
            <p className="text-sm text-red-500">Only {product.stock} left – order soon!</p>
          )}

          {/* Delivery Check */}
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-1">Check Delivery</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter Pincode"
                className="border p-2 rounded w-40"
              />
              <button
                onClick={checkDelivery}
                className="bg-teal-500 px-4 py-2 text-white rounded hover:bg-teal-700"
              >
                Check
              </button>
            </div>
            {deliveryMsg && <p className="mt-2 text-sm">{deliveryMsg}</p>}
          </div>

          {/* Offers */}
          <div className="mt-4 bg-yellow-100 p-3 rounded">
            <p className="font-semibold">Available Offers:</p>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>10% off on first order with code <b>FIRSTBUY</b></li>
              <li>Free shipping on orders above ₹999</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              disabled={!inStock}
              className={`px-4 py-2 rounded font-medium transition-colors duration-300 ${inStock ? "bg-teal-400 text-blue-950 hover:bg-teal-700" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
            >
              Add to Cart
            </button>
            <button
              disabled={!inStock}
              className={`px-4 py-2 rounded font-medium transition-colors duration-300 ${inStock ? "bg-red-500 text-white hover:bg-red-700" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                }`}
            >
              Buy Now
            </button>
            <button
              onClick={() => navigate("/vto")}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Try Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12">
        <ReviewPage />
        <Slide1 />

        {/* Example Q&A */}
        <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-3">Customer Questions</h3>
          <div className="space-y-3">
            <div>
              <p className="font-medium">Q: Does it come with a case?</p>
              <p className="text-gray-700">A: Yes, it includes a premium case.</p>
            </div>
            <div>
              <p className="font-medium">Q: Is this unisex?</p>
              <p className="text-gray-700">A: Yes, it’s suitable for both men and women.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
