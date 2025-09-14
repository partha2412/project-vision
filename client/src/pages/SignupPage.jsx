import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("user"); // default form

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

      {/* Right Side */}
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

        {/* User Signup Form */}
        {activeForm === "user" && (
          <div className="w-full max-w-md bg-white/60 rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Create User Account
            </h1>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("User signed up!");
                navigate("/login");
              }}
            >
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-black transition"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-black transition"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-black transition"
              />
              <button className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 transition transform shadow-xl">
                Sign Up
              </button>
            </form>
          </div>
        )}

        {/* Admin Signup Form */}
        {activeForm === "admin" && (
          <div className="w-full max-w-md bg-white/60 rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
              Create Admin Account
            </h1>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Admin signed up!");
                navigate("/login");
              }}
            >
              <input
                type="text"
                placeholder="Admin Name"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-black transition"
              />
              <input
                type="email"
                placeholder="Admin Email"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-black transition"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-black transition"
              />
              <input
                type="text"
                placeholder="Secret Key"
                className="w-full border-b-2 border-gray-400 focus:outline-none focus:border-black transition"
              />
              <button className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-gradient-to-r from-red-500 to-yellow-500 hover:scale-105 transition transform shadow-xl">
                Sign Up
              </button>
            </form>
          </div>
        )}

        {/* Login Link */}
        <p className="text-gray-900 text-sm mt-6 text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline cursor-pointer font-semibold text-blue-500"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
