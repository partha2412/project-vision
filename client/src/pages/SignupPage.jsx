import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser, googleSignup } from "../api/userApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "@react-oauth/google";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle normal signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await signupUser(formData);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Account created successfully!", { autoClose: 3000 });
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential:", credentialResponse.credential);
      if (!credentialResponse.credential) throw new Error("No credential returned");

      const data = await googleSignup({ token: credentialResponse.credential });
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Google Signup successful!", { autoClose: 2000 });
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google Signup failed", { autoClose: 2000 });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      <ToastContainer />

      <div className="w-1/2 hidden md:block">
        <img
          src="https://s3.zeelool.com/admin/product/group/cca5c1942d0476d07a9db831b7cdddd8.jpg"
          alt="Background"
          className="h-screen w-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-10 rounded-2xl bg-white shadow-xl">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
            Create Account
          </h1>

          {/* Regular Signup Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {["firstname", "lastname", "email", "password"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                required
              />
            ))}

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              disabled={loading}
              className={`w-full py-3 mt-4 rounded-full text-white font-semibold ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              } hover:scale-105 transition transform shadow-md`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Signup Button */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Login failed", { autoClose: 2000 })}
          />

          <p className="text-gray-700 text-sm mt-6 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="underline cursor-pointer font-semibold text-blue-600 hover:text-blue-800"
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
