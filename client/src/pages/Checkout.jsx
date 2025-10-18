import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Checkout = () => {
  const { state } = useLocation();
  const { totalAmount = 0, items = [] } = state || {};

  const [paymentMethod, setPaymentMethod] = useState("Online Payment");

  const itemsPrice = totalAmount;
  const taxPrice = itemsPrice * 0.05;
  const shippingPrice = 5;
  const grandTotal = itemsPrice + taxPrice + shippingPrice;

  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    const address = document.querySelector('input[placeholder="Address"]').value;
    const city = document.querySelector('input[placeholder="City"]').value;
    const stateVal = document.querySelector('input[placeholder="State"]').value;
    const postalCode = document.querySelector('input[placeholder="PIN code"]').value;
    const country = document.querySelector('input[placeholder="Country"]').value;

    const shippingAddress = { address, city, state: stateVal, postalCode, country };

    const orderData = {
      user: "670123xyz123",
      orderItems: items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalAmount: grandTotal,
      notes: "Handle with care",
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders/create",
        orderData
      );
      alert(`✅ ${response.data.message}\nTotal: ₹${grandTotal.toFixed(2)}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert(
        "❌ Failed to place order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT SECTION */}
        <div className="p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Shipping Information
            </h2>
            <input
              type="text"
              placeholder="Address"
              className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="City"
                className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="State"
                className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="PIN code"
                className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Country"
                className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer border rounded-md p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Online Payment"}
                  onChange={() => handlePaymentChange("Online Payment")}
                />
                <span>Online Payment (UPI, Cards)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer border rounded-md p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Cash on Delivery"}
                  onChange={() => handlePaymentChange("Cash on Delivery")}
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full mt-6 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-600 transition duration-200"
          >
            Place Order
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-gray-50 p-8 border-l space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>
          {items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-gray-700"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-2"
                  />
                  <span className="flex-1">{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Items:</span>
                  <span>₹{itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax (5%):</span>
                  <span>₹{taxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping:</span>
                  <span>₹{shippingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800 mt-2">
                  <span>Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
