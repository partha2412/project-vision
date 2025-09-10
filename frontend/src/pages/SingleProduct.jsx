import React from "react";

const SingleProduct = () => {
  // Example product data (can be fetched via props or API later)
  const product = {
    image:
      "https://cdn.media.amplience.net/i/deciem/ordinary-prep-treat-seal-regimen?fmt=auto&$poi$&sm=aspect&w=1000&aspect=1:1",
    title: "The Ordinary Niacinamide Serum",
    description:
      "A lightweight serum that reduces the appearance of skin blemishes and congestion while improving overall skin texture and radiance.",
    price: "₹799",
  };

  return (
    <div >
      <div className="bg-white h-screen shadow-lg rounded-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        {/* Product Image */}
        <div className="flex justify-center items-center p-10 bg-gray-50 overflow-hidden h-72 w-100 md:h-auto">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Product Details */}
        <div className="p-8 flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {product.title}
          </h1>

          <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-gray-900 font-bold text-2xl mb-8">{product.price}</p>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-auto">
            <button className="flex-1 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition">
              Buy Now
            </button>
            <button className="flex-1 border border-gray-900 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-100 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
