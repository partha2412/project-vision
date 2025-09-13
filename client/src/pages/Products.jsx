import { useContext } from "react";
import Carousel from "../components/Carousl_Products";
import { WishlistContext } from "../context/WishlistContext";

const Products = ({ data }) => {
  const { wishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const toggleWish = (item) => {
    const exists = wishlist.some((w) => w.id === item.id);
    if (exists) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <div
      className="min-h-screen w-full px-6 md:px-12 py-12 
      bg-gradient-to-br  bg-gray-100
      flex flex-col items-center gap-4"
    >
      {/* Heading */}
      <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-10 text-center drop-shadow-md ">
       Our Premium VISION Collection 
      </h1>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
        {/* one products loop */}
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl overflow-hidden 
            hover:shadow-2xl transform hover:-translate-y-2 
            transition-all flex flex-col w-[110%] mx-auto h-[80%] "
          >
            {/* Product Image */}
            <div className="relative w-full h-56 sm:h-60 md:h-64 flex justify-center items-center overflow-hidden">
              {Array.isArray(item.image) ? (
                <Carousel
                  images={item.image.filter((src) => src.trim() !== "")}
                />
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover hover:scale-105 transition"
                />
              )}

              {/* Wishlist Heart */}
              <button
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm 
                w-10 h-10 rounded-full flex justify-center items-center shadow-md 
                hover:scale-110 transition"
                onClick={() => toggleWish(item)}
              >
                {wishlist.find((w) => w.id === item.id) ? (
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
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                {item.title || "Product Title"}
              </h2>

              {/* Rating Stars */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < (Number(item.star) || 0) ? "gold" : "none"}
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-5 h-5 text-yellow-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 5.11a.56.56 0 0 0 .48.34l5.52.44c.5.04.7.66.32.99l-4.2 3.6a.56.56 0 0 0-.18.56l1.28 5.39a.56.56 0 0 1-.84.61l-4.73-2.88a.56.56 0 0 0-.59 0l-4.72 2.89a.56.56 0 0 1-.84-.61l1.28-5.39a.56.56 0 0 0-.18-.56L2.93 10.48a.56.56 0 0 1 .32-.99l5.52-.44a.56.56 0 0 0 .48-.34l2.12-5.11Z"
                    />
                  </svg>
                ))}
                <p className="text-sm text-gray-600">
                  ({item.reviews || "234 reviews"})
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.description || "Product description goes here."}
              </p>

              {/* Prices */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-gray-900 font-bold text-lg md:text-xl">
                  ₹ {item.price || "---"}
                </p>
                {item.prev_price && (
                  <p className="text-gray-500 text-sm md:text-base line-through">
                    ₹ {item.prev_price}
                  </p>
                )}
                <p className="text-xs md:text-sm text-green-600 font-semibold">
                  (20% OFF)
                </p>
              </div>

              <button
                className="mt-auto w-full py-2 rounded-lg 
                bg-gradient-to-r from-purple-500 to-pink-500 
                text-white font-semibold shadow-md hover:opacity-90 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
