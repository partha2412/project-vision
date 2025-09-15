import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");

  const validCoupons = {
    SAVE10: 0.1, // 10% off
    SAVE20: 0.2, // 20% off
    ZEUS50: 0.5, // 50% off
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleApplyCoupon = () => {
    if (validCoupons[promoCode.toUpperCase()]) {
      setDiscount(validCoupons[promoCode.toUpperCase()]);
      setAppliedCode(promoCode.toUpperCase());
    } else {
      setDiscount(0);
      setAppliedCode("");
      alert("Invalid Promo Code ❌");
    }
  };

  const discountedTotal = subtotal - subtotal * discount;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>CartPage Page</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty 🛒</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id} style={{ marginBottom: "10px" }}>
                {item.name} × {item.quantity} = ₹{item.price * item.quantity}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{ marginLeft: "10px" }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <h3>Subtotal: ₹{subtotal}</h3>

          <div style={{ marginTop: "1rem" }}>
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter Promo Code"
            />
            <button onClick={handleApplyCoupon} style={{ marginLeft: "10px" }}>
              Apply
            </button>
          </div>

          {appliedCode && (
            <p style={{ color: "green" }}>
              ✅ Coupon <b>{appliedCode}</b> applied ({discount * 100}% off)
            </p>
          )}

          <h2>Total: ₹{discountedTotal.toFixed(2)}</h2>

          <button
            onClick={() => {
              alert("Order placed successfully 🎉");
              clearCart();
            }}
            style={{ marginTop: "20px", padding: "10px", background: "green", color: "white" }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;