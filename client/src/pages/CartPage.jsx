import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

const CartPage = () => {
  const { cart, changeCartItemQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");

  const validCoupons = { SAVE10: 0.1, SAVE20: 0.2, ZEUS50: 0.5 };

  const subtotal = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
  const discountedTotal = subtotal - subtotal * discount;

  const handleApplyCoupon = () => {
    const code = promoCode.toUpperCase();
    if (validCoupons[code]) {
      setDiscount(validCoupons[code]);
      setAppliedCode(code);
    } else {
      setDiscount(0);
      setAppliedCode("");
      alert("Invalid Promo Code ❌");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.items.length === 0 ? (
        <p className="text-gray-600 text-lg">Your cart is empty 🛒</p>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-4">
            {cart.items.map((item) => (
              <li
                key={item.product._id}
                className="flex items-center gap-4 p-4 bg-white rounded shadow"
              >
                <img
                  src={item.image || item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{item.product.title}</p>
                  <p className="text-gray-600">
                    ₹{item.price} × {item.quantity} = ₹{item.totalPrice.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => changeCartItemQuantity(item.product._id, false)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => changeCartItemQuantity(item.product._id, true)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 bg-white p-4 rounded shadow space-y-3">
            <h3 className="text-lg font-semibold">Subtotal: ₹{subtotal.toFixed(2)}</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter Promo Code"
                className="border px-3 py-1 rounded flex-1"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Apply
              </button>
            </div>
            {appliedCode && (
              <p className="text-green-600">
                ✅ Coupon <b>{appliedCode}</b> applied ({discount * 100}% off)
              </p>
            )}
            <h2 className="text-xl font-bold">Total: ₹{discountedTotal.toFixed(2)}</h2>
            <button
              onClick={clearCart}
              className="w-full mt-2 py-2 bg-green-600 text-white rounded text-lg"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
