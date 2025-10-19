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
        <div className="flex flex-col gap-6">
          {wishlist.map((item, index) => {
            const product = item.product || item;

            return (
              <div
                key={product._id || index}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex overflow-hidden w-full"
              >
                {/* Product Image */}
                <img
                  src={product.image || product.images?.[0]}
                  alt={product.title || product.name}
                  className="h-48 w-48 object-cover"
                />

                {/* Product Info */}
                <div className="p-4 flex flex-1 flex-col ml-10">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.title || product.name}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                    {product.description || "No description available."}
                  </p>

                  {/* Price and Remove button horizontal */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{(product.discountPrice ?? product.price ?? 0).toLocaleString()}
                      </span>
                      {product.price && product.discountPrice && (
                        <span className="text-sm font-bold text-gray-400 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="bg-gray-700 hover:bg-gray-500 text-white font-semibold px-3 py-1.5 rounded-full shadow-md transition-all duration-200"
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
