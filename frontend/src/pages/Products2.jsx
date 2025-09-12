import React from "react";
//import Navbar from "./Navbar";

const products = [
  {
    id: 1,
    name: "Face shaper",
    price: "₹999",
    image:
      "https://rukminim2.flixcart.com/image/612/612/l29c9e80/massager/7/c/z/massager-roller-stone-marble-clt-508-health-beauty-cltllzen-original-imagdn4sysat8gwu.jpeg?q=70"},
  {
    id: 2,
    name: "Hydrating Moisturizer",
    price: "₹799",
    image:
   "https://i5.walmartimages.com/seo/CeraVe-Mineral-Sunscreen-Stick-SPF-50-Body-Face-Sunblock-for-Sensitive-Skin-Kids-Adults-0-47-oz_8029851c-c066-4d60-9aa5-24756cccd24c.7b700e2a64946f915615751231becd98.jpeg?odnHeight=576&odnWidth=576&odnBg=FFFFFF"  },
  {
    id: 3,
    name: "Vitamin C Cleanser",
    price: "₹599",
    image:
   "https://store-cdn-media.dermpro.com/catalog/product/cache/666c2cbe963dbde95a4b1d1f124f6d1f/c/e/cerave-foaming-facial-cleanser-12oz_1.png"  },
  {
    id: 4,
    name: "Night Repair Cream",
    price: "₹1199",
    image:
  "https://assets.myntassets.com/dpr_2,q_60,w_210,c_limit,fl_progressive/assets/images/15587272/2025/3/31/9c495fda-146a-44b8-bcca-bda5d528d8cb1743400592089-DOT--KEY-Vitamin-CE-Oil-Free-Moisturizer-For-Glowing-Skin--F-1.jpg"  },

];

export default function ProductsPage() {
  return (
    <>
    {/* <Navbar/> */}
    <div className="min-h-screen bg-gray-50 py-10 px-6">
     

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 border-0">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-50 object-contain rounded-lg mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-600">{product.name}</h2>
            <p className="text-gray-600">{product.price}</p>
            <button className="mt-3 w-full bg-gray-900 text-white py-2 rounded-xl hover:bg-gray-600 duration-300">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
  <button className="px-4 py-2 rounded-xl hover:bg-gray-300 hover:text-black bg-gray-200 text-gray-700 font-medium shadow-lg duration-300">
    View all products
  </button>
</div>
    </div>
    



    
    </>
  );
}