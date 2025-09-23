import React, { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);




  return (
    <div className="p-6 h-screen">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ❤️</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-4 p-6 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="bg-white shadow rounded-2xl h-80 p-4 text-center border">
              <img src={item.image} alt={item.name} className="w-32 h-32 mx-auto mb-4" />
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-gray-600">₹{item.price}</p>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link to="/" className="text-blue-600 underline">
          Back to Products 🛍️
        </Link>
      </div>
    </div>
  );
};

export default WishlistPage;