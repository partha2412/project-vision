import React, { useState } from "react";

const Checkout = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    pincode: "",
    phone: "",
    payment: "razorpay",
  });

  // Example cart items (replace with real cart data)
  const cartItems = [
    { id: 1, name: "Airflex Classic Frame", price: 1999, qty: 1 },
    { id: 2, name: "Aviator Gold Frame", price: 2499, qty: 2 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = 500;
  const total = subtotal - discount;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start py-10 px-6">
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
        
        {/* ✅ Left Section - Address & Payment */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>

          {/* Delivery Form */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={form.firstName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              value={form.lastName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
          />

          <input
            type="text"
            name="apartment"
            placeholder="Apartment, suite, etc. (optional)"
            value={form.apartment}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-4"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="pincode"
              placeholder="PIN code"
              value={form.pincode}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-6"
          />

          {/* Payment Section */}
          <h2 className="text-xl font-bold mb-2">Payment</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={form.payment === "razorpay"}
                onChange={handleChange}
              />
              Razorpay Secure (UPI, Cards, Wallets, NetBanking)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={form.payment === "cod"}
                onChange={handleChange}
              />
              Cash on Delivery (COD)
            </label>
          </div>
        </div>

        {/* ✅ Right Section - Order Summary */}
        <div className="w-full md:w-96 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          {/* Cart Items */}
          <div className="space-y-3 mb-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <p>{item.name} × {item.qty}</p>
                <p>₹{item.price * item.qty}</p>
              </div>
            ))}
          </div>

          {/* Price Details */}
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- ₹{discount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Place Order */}
          <button className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
