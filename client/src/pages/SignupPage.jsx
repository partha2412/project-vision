import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

const SignupPage = () => {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      
      {/* Left Side Image */}
      <div className="w-1/2 hidden md:block">
        <img
          src="https://s3.zeelool.com/admin/product/group/cca5c1942d0476d07a9db831b7cdddd8.jpg"
          alt="Background"
          className="h-screen w-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-10 rounded-2xl bg-white shadow-xl">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
            Create Account
          </h1>

          {/* Profile Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <label className="relative cursor-pointer group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-md flex items-center justify-center bg-gray-100">
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile Preview"
                    className="w-full h-full object-fill"
                  />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
            </label>
            <p className="text-sm text-gray-600 mt-2">Upload Profile Photo</p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              console.log("User signed up!");
              navigate("/login");
            }}
          >
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent border-b-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
            />

            <button className="w-full py-3 mt-4 rounded-full text-white font-semibold bg-blue-500 hover:bg-blue-600 hover:scale-105 transition transform shadow-md">
              Sign Up
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
