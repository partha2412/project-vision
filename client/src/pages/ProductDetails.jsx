import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { IoHeartOutline, IoHeart, IoBagOutline, IoBag } from "react-icons/io5";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContext";
import ReviewPage from "./ReviewPage";
import { fetchProductById, fetchProductsByCategory } from "../api/productApi";

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Pulse = ({ className }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

const SkeletonPage = () => (
  <div className="min-h-screen bg-white max-w-7xl mx-auto px-4 sm:px-8 py-10">
    <Pulse className="h-4 w-28 mb-10" />
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
      <div className="w-full lg:w-1/2">
        <Pulse className="w-full h-72 sm:h-96 md:h-[480px] rounded-2xl" />
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <Pulse key={i} className="w-16 h-16 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>
      <div className="w-full lg:w-1/2 space-y-5 pt-2">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-7 w-3/4" />
        <Pulse className="h-4 w-1/4" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Pulse key={i} className="w-4 h-4 rounded-full" />
          ))}
        </div>
        <Pulse className="h-9 w-1/3" />
        <Pulse className="h-px w-full" />
        <Pulse className="h-16 w-full" />
        <Pulse className="h-3 w-16" />
        <Pulse className="h-20 w-full rounded-xl" />
        <Pulse className="h-16 w-full rounded-xl" />
        <div className="flex gap-3">
          <Pulse className="h-12 flex-1 rounded-xl" />
          <Pulse className="h-12 flex-1 rounded-xl" />
          <Pulse className="h-12 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");
  const [addingCart, setAddingCart] = useState(false);

  const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { cart, addToCart } = useContext(CartContext);

  const inWishlist = wishlist?.some((w) => w?._id === product?._id);
  const inCart = cart?.items?.some((i) => i.product?._id === product?._id);
  const [inStock,setInStock] = useState(product?.stock > 0);
  const [similarProducts, setSimilarProducts] = useState([]);

  const toggleWish = () => {
    if (!product) return;
    inWishlist ? removeFromWishlist(product._id) : addToWishlist(product);
  };

  const handleCart = async () => {
    if (inCart) { navigate("/cart"); return; }
    setAddingCart(true);
    try { await addToCart(product, 1); }
    finally { setAddingCart(false); }
  };

  // Fetch product
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductById(id);
        const similar = await fetchProductsByCategory(data.product.category);
        const filtered = (similar.products || [])
          .filter((p) => p._id !== id)
          .slice(0, 8); // show max 8
        setSimilarProducts(filtered);
        setProduct(data.product);   
        setInStock(data.product.stock > 0);
        
      } catch (e) {
        console.error(e);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Auto-slide images
  useEffect(() => {
    if (!product?.images?.length) return;
    const iv = setInterval(
      () => setCurrentIndex((p) => (p + 1) % product.images.length),
      3500
    );
    return () => clearInterval(iv);
  }, [product]);

  if (loading) return <SkeletonPage />;

  if (!product)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center">
        <p className="text-xl font-semibold text-gray-400">Product not found</p>
        <Link
          to="/products"
          className="text-sm text-gray-400 underline hover:text-gray-800 transition"
        >
          ← Back to products
        </Link>
      </div>
    );

  // Computed values from real DB fields
  const discount =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  const avgRating =
    product.reviews?.length > 0
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;

  const renderStars = (r) =>
    Array.from({ length: 5 }, (_, i) => {
      if (i + 1 <= Math.floor(r)) return <FaStar key={i} className="text-amber-400 text-xs" />;
      if (i < r) return <FaStarHalfAlt key={i} className="text-amber-400 text-xs" />;
      return <FaRegStar key={i} className="text-gray-200 text-xs" />;
    });

  const checkDelivery = () => {
    if (!pincode) return setDeliveryMsg("Enter a valid pincode.");
    setDeliveryMsg(
      pincode.startsWith("7")
        ? "Delivery available · 3–5 business days"
        : "Delivery not available in this area"
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10">

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors duration-200 mb-10 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
          Back
        </button>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">

          {/* ── Left: Images ── */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-24 self-start">
            {/* Main image */}
            <div className="relative w-full h-72 sm:h-96 md:h-[480px] bg-gray-50 rounded-2xl overflow-hidden">
              <div
                className="flex h-full transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {product.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${product.title} ${i + 1}`}
                    className="w-full h-full object-contain flex-shrink-0"
                  />
                ))}
              </div>

              {/* Discount pill */}
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-black text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider">
                  -{discount}%
                </span>
              )}

              {/* Wishlist */}
              <button
                onClick={toggleWish}
                className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-200"
              >
                {inWishlist
                  ? <IoHeart className="text-red-500 text-lg" />
                  : <IoHeartOutline className="text-gray-400 text-lg" />}
              </button>

              {/* Dot nav */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`rounded-full transition-all duration-300 ${currentIndex === i
                        ? "w-5 h-1.5 bg-gray-800"
                        : "w-1.5 h-1.5 bg-gray-300"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${currentIndex === i
                    ? "border-gray-900"
                    : "border-transparent opacity-40 hover:opacity-70"
                    }`}
                >
                  <img src={src} alt="" className="w-full h-full object-contain bg-gray-50" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="w-full lg:w-1/2 space-y-5">

            {/* Category + productType */}
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span>{product.category}</span>
              {product.productType && (
                <>
                  <span className="text-gray-200">·</span>
                  <span>{product.productType}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-400">{product.brand}</p>
            )}

            {/* Rating — only if reviews exist */}
            {product.reviews?.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">{renderStars(avgRating)}</div>
                <span className="text-xs text-gray-400">
                  {avgRating.toFixed(1)} · {product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">
                ₹{product.discountPrice || product.price}
              </span>
              {discount > 0 && (
                <span className="text-base text-gray-300 line-through">
                  ₹{product.price}
                </span>
              )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-500 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${inStock ? "bg-emerald-400" : "bg-red-400"
                  }`}
              />
              <span
                className={`text-sm font-medium ${inStock ? "text-emerald-600" : "text-red-500"
                  }`}
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
              {inStock && product.stock <= product.lowStockAlert && (
                <span className="text-xs text-orange-400">
                  · Only {product.stock} left
                </span>
              )}
            </div>

            {/* GST */}
            {product.gstRate > 0 && (
              <p className="text-xs text-gray-400">
                Inclusive of {product.gstRate}% GST
              </p>
            )}

            {/* Delivery check */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Check Delivery
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && checkDelivery()}
                  placeholder="Enter pincode"
                  maxLength={6}
                  className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-300 min-w-0"
                />
                <button
                  onClick={checkDelivery}
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition font-medium flex-shrink-0"
                >
                  Check
                </button>
              </div>
              {deliveryMsg && (
                <p
                  className={`text-xs ${deliveryMsg.includes("not") ? "text-red-400" : "text-emerald-500"
                    }`}
                >
                  {deliveryMsg}
                </p>
              )}
            </div>

            {/* Offers */}
            <div className="border border-dashed border-gray-200 rounded-xl p-4 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Offers
              </p>
              <p className="text-xs text-gray-500">
                · 10% off on first order — code{" "}
                <span className="font-semibold text-gray-700">FIRSTBUY</span>
              </p>
              <p className="text-xs text-gray-500">
                · Free shipping on orders above ₹999
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2 flex-wrap sm:flex-nowrap">
              {/* Cart */}
              <button
                onClick={handleCart}
                disabled={!inStock || addingCart}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${inStock
                  ? "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
              >
                {inCart ? <IoBag className="text-base" /> : <IoBagOutline className="text-base" />}
                {addingCart ? "Adding…" : inCart ? "Go to Cart" : "Add to Cart"}
              </button>

              {/* Buy now */}
              <button
                disabled={!inStock}
                className={`flex-1 min-w-[120px] py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${inStock
                  ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                  : "border-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
              >
                Buy Now
              </button>

              {/* Try on */}
              <button
                onClick={() => navigate("/vto")}
                className="px-5 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 whitespace-nowrap"
              >
                Try On
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom sections ── */}
        <div className="mt-20 border-t border-gray-100 pt-12 space-y-14">
          <ReviewPage />
          {similarProducts.length > 0 && (
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
                Similar Products
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {similarProducts.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="cursor-pointer group"
                  >
                    <div className="w-full h-40 sm:h-52 bg-gray-50 rounded-xl overflow-hidden mb-3">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.brand}</p>
                    <p className="text-sm font-bold text-gray-900 mt-1">
                      ₹{item.discountPrice || item.price}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}