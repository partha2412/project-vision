import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
export default function WishlistPage() {
  
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          Your wishlist is empty!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-[1400px] mx-auto">
          {wishlist.map((item, index) => {
            const product = item.product || item; // ✅ handles both shapes

            return (
              <div
                key={product._id || index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col overflow-hidden"
              >
                <img
                  src={product.image || product.images?.[0]}
                  alt={product.title || product.name}
                  className="h-52 w-full object-cover"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.title || product.name}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                    {product.description || "No description available."}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{(product.price ?? 0).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-full shadow-md transition-all duration-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
