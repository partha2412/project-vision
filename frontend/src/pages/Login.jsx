import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("user"); // "user" or "admin"

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src="https://s3.zeelool.com/admin/product/group/cca5c1942d0476d07a9db831b7cdddd8.jpg"
          alt="Background"
          className="h-screen w-full object-fill"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md p-10">
        {/* Toggle Buttons */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            onClick={() => setActiveForm("user")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeForm === "user"
                ? "bg-black text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            User
          </button>
          <button
            onClick={() => setActiveForm("admin")}
            className={`px-6 py-2 rounded-full font-semibold transition ${
              activeForm === "admin"
                ? "bg-black text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Admin
          </button>
        </div>

        {/* User Login Form */}
        {activeForm === "user" && (
          <div className="w-full max-w-md bg-white/60 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              User Login
            </h2>
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("User logged in!");
                navigate("/dashboard"); // Redirect for users
              }}
            >
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 focus:outline-none focus:border-blue-400 transition"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 focus:outline-none focus:border-blue-400 transition"
              />

              <button className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 transition transform shadow-xl">
                Log In
              </button>
            </form>
          </div>
        )}

        {/* Admin Login Form */}
        {activeForm === "admin" && (
          <div className="w-full max-w-md bg-white/60 rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Admin Login
            </h2>
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Admin logged in!");
                navigate("/admin-dashboard"); // Redirect for admins
              }}
            >
              <input
                type="email"
                placeholder="Admin Email"
                className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 focus:outline-none focus:border-blue-400 transition"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 focus:outline-none focus:border-blue-400 transition"
              />
              <input
                type="text"
                placeholder="Secret Key"
                className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 focus:outline-none focus:border-blue-400 transition"
              />

              <button className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-gradient-to-r from-red-500 to-yellow-500 hover:scale-105 transition transform shadow-xl">
                Log In
              </button>
            </form>
          </div>
        )}

        {/* Extra Links */}
        <p className="text-gray-900 text-sm mt-6 text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="underline cursor-pointer font-semibold text-blue-500"
          >
            Sign up
          </span>
        </p>

        <p
          className="text-sm mt-2 text-center cursor-pointer hover:underline text-blue-500"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
};

export default Login;
