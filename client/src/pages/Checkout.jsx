import React, { useState, useEffect } from "react";

const Checkout = () => {
  // Dummy cart items
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Product 1", price: 20, quantity: 1 },
    { id: 2, name: "Product 2", price: 15, quantity: 2 },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("online"); // default online
  const [showOnlineOptions, setShowOnlineOptions] = useState(true);

  // Calculate total
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Handle invoice generation (dummy)
  const handleGenerateInvoice = () => {
    alert("Invoice generated! Total amount: $" + totalAmount);
  };

  // Handle payment method change
  const handlePaymentChange = (method) => {
    setPaymentMethod(method);
    setShowOnlineOptions(method === "online");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left: Delivery & Payment */}
        <div className="p-8 space-y-8">
          {/* Delivery Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Delivery Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="First name"
              />
              <input
                className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Last name"
              />
            </div>
            <input
              className="border rounded-md p-4 w-full mt-4 text-base focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Address"
            />
            <input
              className="border rounded-md p-4 w-full mt-4 text-base focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="City"
              />
              <input
                className="border rounded-md p-4 w-full text-base focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="PIN code"
              />
            </div>
            <input
              className="border rounded-md p-4 w-full mt-4 text-base focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Phone"
            />
          </div>

          {/* Payment Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer border rounded-md p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "online"}
                  onChange={() => handlePaymentChange("online")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  Online Payment (UPI, Cards, Wallets)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer border rounded-md p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => handlePaymentChange("cod")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Cash on Delivery</span>
              </label>
            </div>

            {/* Online Payment Options */}
            {showOnlineOptions && (
              <div className="mt-4 space-y-2">
                <h3 className="font-medium text-gray-700">Select Payment Option:</h3>
                <label className="flex items-center gap-2 cursor-pointer border rounded-md p-2 hover:bg-gray-50">
                  <input type="radio" name="onlineOption" className="text-blue-600" />
                  <span>PhonePe</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer border rounded-md p-2 hover:bg-gray-50">
                  <input type="radio" name="onlineOption" className="text-blue-600" />
                  <span>Google Pay</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer border rounded-md p-2 hover:bg-gray-50">
                  <input type="radio" name="onlineOption" className="text-blue-600" />
                  <span>Paytm</span>
                </label>
              </div>
            )}
          </div>

          {/* Confirm Button */}
          <div className="pt-6">
            <button
              onClick={handleGenerateInvoice}
              className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200"
            >
              Place Order & Generate Invoice
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-gray-50 p-8 border-l space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-gray-700"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}

              <div className="border-t pt-4 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>${totalAmount}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
