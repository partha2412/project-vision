import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/userApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await signupUser(formData);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Show success toast
      toast.success("Account created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
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
