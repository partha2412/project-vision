import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../api/orderApi";

// ─── Field component ──────────────────────────────────────────────────────────
const Field = ({ label, placeholder, type = "text", inputRef, half }) => (
  <div className={`flex flex-col gap-1.5 ${half ? "" : "col-span-2"}`}>
    <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
      {label}
    </label>
    <input
      ref={inputRef}
      type={type}
      placeholder={placeholder}
      className="w-full bg-transparent border-b border-gray-200 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors duration-200"
    />
  </div>
);

// ─── Step indicator ───────────────────────────────────────────────────────────
const Step = ({ number, label, active, done }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
        done ? "bg-gray-900 text-white" : active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
      }`}
    >
      {done ? "✓" : number}
    </div>
    <span className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${active ? "text-gray-900" : "text-gray-300"}`}>
      {label}
    </span>
  </div>
);

// ─── Inline Order Success ─────────────────────────────────────────────────────
const OrderSuccessScreen = ({ orderId, grandTotal, paymentMethod, navigate }) => (
  <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
    <div className="w-full max-w-lg">

      {/* Animated check */}
      <div className="flex justify-center mb-10">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full bg-gray-900 opacity-10 animate-ping" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">
          Order Confirmed
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Thank you for<br />your purchase
        </h1>
        <p className="text-sm text-gray-400 mt-4 leading-relaxed">
          Your order has been placed successfully.<br />You'll receive a confirmation shortly.
        </p>
      </div>

      {/* Order details card */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Order Details
          </p>
        </div>

        <div className="px-6 py-5 divide-y divide-gray-50 space-y-0">
          {[
            {
              label: "Order ID",
              value: (
                <span className="font-mono text-sm font-bold text-gray-900 tracking-wider">
                  #{orderId !== "--" ? orderId.slice(-8).toUpperCase() : "--"}
                </span>
              ),
            },
            {
              label: "Amount Paid",
              value: <span className="text-sm font-bold text-gray-900">₹{grandTotal.toFixed(0)}</span>,
            },
            {
              label: "Payment Method",
              value: <span className="text-sm font-semibold text-gray-700">{paymentMethod}</span>,
            },
            {
              label: "Estimated Delivery",
              value: <span className="text-sm font-semibold text-gray-700">3–7 Business Days</span>,
            },
            {
              label: "Status",
              value: (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Processing
                </span>
              ),
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-4">
              <span className="text-sm text-gray-500">{label}</span>
              {value}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={() => navigate("/userdashboard")}
          className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-gray-700 transition-all duration-200 active:scale-[0.99]"
        >
          Track My Order
        </button>
        <button
          onClick={() => {
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="w-full py-3.5 border-2 border-gray-200 text-gray-700 rounded-xl text-sm font-bold uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all duration-200"
        >
          Continue Shopping
        </button>
      </div>

      <p className="text-center text-xs text-gray-300 mt-6">
        A confirmation has been sent to your registered address
      </p>
    </div>
  </div>
);

// ─── Main Checkout ────────────────────────────────────────────────────────────
const Checkout = () => {
  const { state } = useLocation();
  const { totalAmount = 0, items = [] } = state || {};
  const navigate = useNavigate();
  const { fetchCart } = useContext(CartContext);

  const [paymentMethod, setPaymentMethod] = useState("Online Payment");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("--");

  const addressRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const postalRef = useRef();
  const countryRef = useRef();

  useEffect(() => {
    fetchCart();
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please log in to continue"); navigate("/login"); return; }
    try {
      const decoded = jwt_decode(token);
      setUserId(decoded.id);
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!userId) return;

    const address = addressRef.current?.value;
    const city = cityRef.current?.value;
    const stateVal = stateRef.current?.value;
    const postalCode = postalRef.current?.value;
    const country = countryRef.current?.value;

    if (!address || !city || !stateVal || !postalCode || !country)
      return toast.error("Please fill in all shipping fields");
    if (items.length === 0)
      return toast.error("Your cart is empty");

    const shippingAddress = { address, city, state: stateVal, postalCode, country };
    const orderItems = items.map((item) => ({
      product: item.productId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));

    const orderData = { user: userId, orderItems, shippingAddress, paymentMethod, totalAmount };

    try {
      setLoading(true);
      const response = await placeOrder(orderData);
      setOrderId(response.order?._id || response.orderId || response._id || "--");
      setOrderPlaced(true); // ✅ swap UI to success screen
    } catch (error) {
      toast.error("Failed to place order: " + (error.message || error.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  const tax = totalAmount * 0.18;
  const shipping = totalAmount > 999 ? 0 : 99;
  const grandTotal = totalAmount + tax + shipping;

  // ── Swap to success screen on order placed ───────────────────────────────────
  if (orderPlaced) {
    return (
      <OrderSuccessScreen
        orderId={orderId}
        grandTotal={grandTotal}
        paymentMethod={paymentMethod}
        navigate={navigate}
      />
    );
  }

  // ── Checkout form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Top bar */}
      <div className="border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
          Back
        </button>

        <span className="text-sm font-bold tracking-widest uppercase text-gray-900">Checkout</span>

        <div className="hidden sm:flex items-center gap-4">
          <Step number="1" label="Shipping" active={step >= 1} done={step > 1} />
          <div className="w-8 h-px bg-gray-200" />
          <Step number="2" label="Payment" active={step >= 2} done={step > 2} />
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-16">

        {/* Left: Form */}
        <div className="space-y-12">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
              01 — Shipping Information
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6">
              <Field label="Street Address" placeholder="123 Main Street" inputRef={addressRef} />
              <Field label="City" placeholder="Mumbai" inputRef={cityRef} half />
              <Field label="State" placeholder="Maharashtra" inputRef={stateRef} half />
              <Field label="PIN Code" placeholder="400001" inputRef={postalRef} half />
              <Field label="Country" placeholder="India" inputRef={countryRef} half />
            </div>
          </section>

          <div className="h-px bg-gray-100" />

          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
              02 — Payment Method
            </h2>
            <div className="space-y-3">
              {[
                { value: "Online Payment", label: "Online Payment", sub: "UPI · Cards · Net Banking" },
                { value: "Cash on Delivery", label: "Cash on Delivery", sub: "Pay when your order arrives" },
              ].map(({ value, label, sub }) => (
                <label
                  key={value}
                  className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === value ? "border-gray-900 bg-white shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${paymentMethod === value ? "border-gray-900" : "border-gray-300"}`}>
                    {paymentMethod === value && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                  </div>
                  <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} className="sr-only" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
              loading ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.99]"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Placing Order…
              </span>
            ) : `Place Order · ₹${grandTotal.toFixed(0)}`}
          </button>

          <p className="text-center text-xs text-gray-300 -mt-6">
            By placing your order you agree to our terms & conditions
          </p>
        </div>

        {/* Right: Summary */}
        <div className="lg:border-l lg:border-gray-100 lg:pl-12">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
            Order Summary
          </h2>

          {items.length === 0 ? (
            <p className="text-sm text-gray-400">Your cart is empty.</p>
          ) : (
            <div className="space-y-5">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                    <img src={item.product?.images?.[0] || item.image} alt={item.product?.title || item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.product?.title || item.name}</p>
                    {item.quantity > 1 && <p className="text-xs text-gray-400 mt-0.5">Qty {item.quantity}</p>}
                  </div>
                  <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    ₹{((item.product?.price || item.price) * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}

              <div className="h-px bg-gray-100" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{totalAmount.toFixed(0)}</span></div>
                <div className="flex justify-between text-gray-500"><span>GST (18%)</span><span>₹{tax.toFixed(0)}</span></div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-500 font-semibold" : ""}>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between font-bold text-gray-900 text-base"><span>Total</span><span>₹{grandTotal.toFixed(0)}</span></div>
              </div>

              {shipping > 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                  Add ₹{(999 - totalAmount).toFixed(0)} more for free shipping
                </div>
              )}

              <div className="pt-4 space-y-2.5">
                {[
                  { icon: "🔒", text: "Secure 256-bit SSL encryption" },
                  { icon: "↩️", text: "Easy 30-day returns" },
                  { icon: "📦", text: "Delivery in 3–7 business days" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-xs text-gray-400">
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;