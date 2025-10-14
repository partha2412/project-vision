import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/userApi"; // make sure this calls your backend login API
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("user"); // user or admin
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secretkey: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const loginPayload = {
        email: formData.email,
        password: formData.password,
      };
      if (activeForm === "admin") loginPayload.secretkey = formData.secretkey;

      const data = await loginUser(loginPayload); // call backend API

      // Save user and token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success(
        `${activeForm === "admin" ? "Admin" : "User"} logged in successfully!`,
        { position: "top-right", autoClose: 2000 }
      );

      // Redirect after short delay
      setTimeout(() => {
        navigate(activeForm === "admin" ? "/admindashboard" : "/dashboard");
      }, 2000);

    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Login failed";
      toast.error(errorMessage, { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <ToastContainer />

      {/* Left Side Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src="https://s3.zeelool.com/admin/product/group/cca5c1942d0476d07a9db831b7cdddd8.jpg"
          alt="Background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md p-10">
        {/* Toggle User/Admin */}
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

        {/* Form */}
        <div className="w-full max-w-md bg-white/60 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
            {activeForm === "user" ? "User Login" : "Admin Login"}
          </h2>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 focus:outline-none focus:border-blue-400 transition"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 focus:outline-none focus:border-blue-400 transition"
              required
            />
            {activeForm === "admin" && (
              <input
                type="text"
                name="secretkey"
                placeholder="Secret Key"
                value={formData.secretkey}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-400 text-gray-900 focus:outline-none focus:border-blue-400 transition"
                required
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 transition transform shadow-xl"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

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
    </div>
  );
};

export default Login;
