import React from "react";

const Checkout = () => {
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
                  defaultChecked
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">
                  Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer border rounded-md p-4 hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-6">
            <button className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition duration-200">
              Place Order
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-gray-50 p-8 border-l space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span>Product 1</span>
              <span>$20.00</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Product 2</span>
              <span>$15.00</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>$40.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;