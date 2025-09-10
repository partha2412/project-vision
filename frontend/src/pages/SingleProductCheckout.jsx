import React, { useState } from "react";

const SingleProductCheckout = ({ product }) => {
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    alert(`Order placed for ${product.name}!`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        
        {/* ✅ Left Section: Product + Delivery */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          {/* Product Info */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-40 h-40 object-contain"
            />
            <div className="flex flex-col justify-between">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-700 text-lg mt-2">{product.price}</p>
            </div>
          </div>

          {/* Delivery Form */}
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
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
              placeholder="PIN Code"
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

          {/* Payment */}
          <h2 className="text-xl font-bold mb-2">Payment</h2>
          <div className="space-y-2 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={form.payment === "razorpay"}
                onChange={handleChange}
              />
              Razorpay (UPI, Cards, Wallets, NetBanking)
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

          <button
            onClick={handlePlaceOrder}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Place Order
          </button>
        </div>

        {/* ✅ Right Section: Price Summary */}
        <div className="w-full md:w-96 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Price Details</h2>
          <div className="flex justify-between mb-2">
            <span>Price</span>
            <span>{product.price}</span>
          </div>
          <div className="flex justify-between mb-2 text-green-600">
            <span>Discount</span>
            <span>- ₹500</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total</span>
            <span>₹{parseInt(product.price.replace("₹", "")) - 500}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductCheckout;
