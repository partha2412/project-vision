import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";
import { clearCart } from "../api/cartApi";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Checkout = () => {
  const { state } = useLocation();
  const { totalAmount = 0, items = [] } = state || {};
  const navigate = useNavigate();
  const { fetchCart } = useContext(CartContext)
  const [paymentMethod, setPaymentMethod] = useState("Online Payment");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Decode userId from token on component mount
  useEffect(() => {
    fetchCart();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to place an order");
      navigate("/login");
      return;
    }
    try {
      const decoded = jwt_decode(token);
      setUserId(decoded.id); // Make sure your JWT has id field
    } catch (err) {
      console.error("Invalid token", err);
      alert("❌ Invalid token, please log in again");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handlePaymentChange = (method) => setPaymentMethod(method);

  const handlePlaceOrder = async () => {
    if (!userId) return;

    const address = document.querySelector('input[placeholder="Address"]').value;
    const city = document.querySelector('input[placeholder="City"]').value;
    const stateVal = document.querySelector('input[placeholder="State"]').value;
    const postalCode = document.querySelector('input[placeholder="PIN code"]').value;
    const country = document.querySelector('input[placeholder="Country"]').value;

    if (!address || !city || !stateVal || !postalCode || !country) {
      return toast.error("❌ Please fill in all shipping fields");
    }

    if (items.length === 0) {
      return toast.error("❌ Your cart is empty");
    }

    const shippingAddress = { address, city, state: stateVal, postalCode, country };

    const orderItems = items.map((item) => ({
      product: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const token = localStorage.getItem("token");
    if (!token) return toast.error("❌ You must be logged in to place an order");

    const orderData = { user: userId, orderItems, shippingAddress, paymentMethod, totalAmount };

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await api.post(
        "/order/create",
        orderData,
        config
      );

      toast.success(` ${response.data.message} \nTotal: ₹${totalAmount.toFixed(2)}`);
      // Wait 2 seconds before navigating
      setTimeout(async () => {
        await clearCart();  // Refresh cart in context
        navigate("/ordersuccess");
      }, 2000);
    } catch (error) {
      console.log(error);
      
      toast.error(
        "❌ Failed to place order: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center p-4">
      <ToastContainer />
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT SECTION */}
        <div className="p-8 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Information</h2>
            <input type="text" placeholder="Address" className="border rounded-md p-4 w-full mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="City" className="border rounded-md p-4" />
              <input type="text" placeholder="State" className="border rounded-md p-4" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="PIN code" className="border rounded-md p-4" />
              <input type="text" placeholder="Country" className="border rounded-md p-4" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "Online Payment"}
                  onChange={() => handlePaymentChange("Online Payment")}
                />
                <span>Online Payment (UPI, Cards)</span>
              </label>
              <label className="flex items-center gap-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
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
            disabled={loading}
            className="w-full mt-6 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-gray-50 p-8 border-l space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
          {items.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-gray-700">
                  <img
                    src={item.product?.images?.[0] || item.image}
                    alt={item.product?.title || item.name}
                    className="w-16 h-16 object-cover rounded mr-2"
                  />
                    <span className="flex-1">{item.product?.title || item.name} <span> {item.quantity==1?(""):(<span>x {item.quantity}</span>)  } </span> </span>
                  <span>₹{((item.product?.price || item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-500">
                  <span>Total:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
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
