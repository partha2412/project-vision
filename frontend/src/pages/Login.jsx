import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

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
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white/30 backdrop-blur-md">
        <div className="w-full max-w-md p-10">
          {/* Heading */}
          <h2 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Welcome Back
          </h2>

          {/* Login Form */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("User logged in!");
              navigate("/dashboard"); // Redirect after login
            }}
          >
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 placeholder-gray-700 focus:outline-none focus:border-blue-400 transition"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 placeholder-gray-700 focus:outline-none focus:border-blue-400 transition"
            />

            <button className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 hover:scale-105 transition transform shadow-xl">
              Log In
            </button>
          </form>

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

          <p className="text-gray-900 text-sm mt-2 text-center cursor-pointer hover:underline text-blue-500">
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;