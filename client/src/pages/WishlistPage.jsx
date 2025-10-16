// WishlistPage.jsx
import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useContext(WishlistContext);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
