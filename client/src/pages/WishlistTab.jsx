import React, { useState } from "react";

const mockWishlist = [
  { id: 1, name: "Sunglasses", price: 1299 },
  { id: 2, name: "Watch", price: 2999 },
];

const WishlistTab = () => {
  const [wishlist, setWishlist] = useState(mockWishlist);
  const removeWishlist = (id) => setWishlist(wishlist.filter((item) => item.id !== id));

  return wishlist.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-300">Your wishlist is empty.</p>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {wishlist.map((item) => (
        <div key={item.id} className="border p-4 rounded shadow dark:border-gray-600 dark:text-white">
          <p className="font-medium">{item.name}</p>
          <p className="text-blue-600 dark:text-blue-400 font-semibold">₹{item.price}</p>
          <div className="flex gap-2 mt-2">
            <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700" onClick={() => removeWishlist(item.id)}>Remove</button>
            <button className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-700">Move to Cart</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishlistTab;
