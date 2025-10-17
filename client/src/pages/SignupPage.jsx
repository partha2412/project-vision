import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser, googleSignup } from "../api/userApi"; // API calls
import { ToastContainer, toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { AuthContext } from "../context/AuthContext"; // ✅ import AuthContext
import "react-toastify/dist/ReactToastify.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // ✅ get setUser from context

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 Normal Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await signupUser(formData);

      setUser(data.user); // ✅ update context
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🟠 Google Signup
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwt_decode(credentialResponse.credential);

      const googleUser = {
        firstname: decoded.given_name,
        lastname: decoded.family_name,
        email: decoded.email,
      };

      const data = await googleSignup(googleUser);

      if (!data.user) {
        throw new Error("Google signup failed: user not returned");
      }

      setUser(data.user); // ✅ update context
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success("Signed up with Google!", { position: "top-right" });
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Google signup failed:", error);
      toast.error("Google signup failed!");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in failed!");
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

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            {["firstname", "lastname", "email", "password"].map((field) => (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
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
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Signup Button */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              type="standard"
              theme="filled_blue"
              shape="rectangular"
              text="signup_with"
              size="large"
            />
          </div>

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
