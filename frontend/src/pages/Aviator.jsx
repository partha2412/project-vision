import React from "react";
import airflex1 from "../photo/airflex.webp";
import airflex2 from "../photo/aviator.webp"; 
import airflex3 from "../photo/blend.webp"; 
import unnamed from "../photo/unnamed.webp"
import one from "../photo/1.webp"
import two from "../photo/2.webp"
import three from "../photo/3.webp"
import four from "../photo/4.webp"
import five from "../photo/5.webp"
import LowerNavbar from "./LowerNavbar";
import { CiHeart } from "react-icons/ci";
import av1 from "../photo/av1.webp"
import av2 from "../photo/av2.webp"
import av3 from "../photo/av3.webp"
import av4 from "../photo/av3.webp"





// 👉 replace with real Airflex product images

const products = [
  {
    id: 1,
    name: "Airflex Classic Frame",
    price: "₹1,999",
    image: av1,
  },
  {
    id: 2,
    name: "Airflex Lightweight Aviator",
    price: "₹2,499",
    image: av2,
  },
  {
    id: 3,
    name: "Airflex Premium Blend",
    price: "₹2,999",
    image: av3,
  },
  {
    id: 4,
    name: "Airflex Premium Blend",
    price: "₹2,999",
    image: av4,
  },
    
];

const Aviator = () => {
  return (
    <div className="p-6">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Aviator Collection</h1>
        <p className="text-gray-600 mt-2">
          Discover ultra-lightweight and stylish frames for everyday comfort.
        </p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl shadow-sm p-4 flex flex-col items-center hover:shadow-lg transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-40 h-40 object-contain mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.price}</p>

            
            <div className="flex gap-3 mt-4">
              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Add to Cart
              </button>
              <button className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100">
               <CiHeart />
              </button>
            </div>
          </div>
        ))}
       
      </div>
       <LowerNavbar/>
    </div>
  );
};

export default Aviator;
