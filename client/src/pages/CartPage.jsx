import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const {
    cart,
    fetchCart,
    changeCartItemQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const items = Array.isArray(cart?.items) ? cart.items : [];
  const totalAmount = items.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
    //fetchCart();
  };

  const handleChangeQuantity = (productId, increment) => {
    changeCartItemQuantity(productId, increment);
  };

  const handleClearCart = async () => {
    await clearCart();
    //fetchCart();
  };

  const handleCheckout = () => {
    const checkoutItems = items.map((item) => ({
      productId: item.product._id,
      name: item.product.title,
      price: item.discountPrice,
      quantity: item.quantity,
      image: item.image || item.product.images?.[0] || "",
    }));

    navigate("/checkout", {
      state: {
        totalAmount,
        items: checkoutItems,
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold py-2 mb-6 bg-gradient-to-r from-gray-500 via-gray-700 to-gray-900 bg-clip-text text-transparent">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty 🛒</p>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.product._id}
                className="flex items-center gap-4 p-4 bg-white rounded shadow-sm"
              >
                <img
                  src={item.image || item.product.images?.[0]}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-lg">
                    {item.product.title}
                  </p>
                  <p className="text-gray-600 mt-1">
                    ₹{item.discountPrice} × {item.quantity} = ₹
                    {(item.discountPrice * item.quantity).toFixed(2)}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => handleChangeQuantity(item.product._id, false)}
                      className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                    >
                      -
                    </button>

                    <span className="text-gray-800">{item.quantity}</span>

                    <button
                      onClick={() => handleChangeQuantity(item.product._id, true)}
                      className="px-2 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 bg-white p-4 rounded shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">
              Total: ₹{totalAmount.toFixed(2)}
            </h2>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={handleClearCart}
                className="py-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-gray-800 rounded hover:from-gray-400 hover:to-gray-600 transition"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckout}
                className="py-2 bg-gradient-to-r from-gray-700 via-gray-800 to-black text-white rounded hover:from-gray-600 hover:to-gray-900 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
