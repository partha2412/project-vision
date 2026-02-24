import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../api/productApi";
import { IoIosMale, IoIosFemale } from "react-icons/io";
import { FaChild } from "react-icons/fa";
const CategorySection = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      const products = data.products || data; // safety

      // Group products by category
      const grouped = {};
      products.forEach((product) => {
        const cat = product.category?.toLowerCase() || "others";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(product);
      });

      // Define custom order
      const categoryOrder = ["men", "women", "unisex", "unisex kids", "others"];

      // Convert to ordered object
      const orderedGrouped = {};
      categoryOrder.forEach((cat) => {
        if (grouped[cat]) {
          orderedGrouped[cat] = grouped[cat];
        }
      });

      // Add any extra categories not listed
      Object.keys(grouped).forEach((cat) => {
        if (!orderedGrouped[cat]) {
          orderedGrouped[cat] = grouped[cat];
        }
      });

      setCategories(orderedGrouped);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading categories...</div>;
  }

  return (
    <div className="p-8 space-y-12 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {Object.entries(categories).map(([category, products]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-cyan-200 flex items-center justify-center text-3xl">
              {category === "men" && <IoIosMale />}
              {category === "women" && <IoIosFemale />}
              {category === "kids" && <FaChild />}
              {category === "unisex" && <p className="text-4xl ">U</p>}
            </div>
            <h2 className="text-2xl font-extrabold capitalize">
              {category} Glasses
            </h2>
          </div>

          {/* Products */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            {products.slice(0, 4).map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/product/${item._id}`)}
                className="bg-white border rounded-xl p-4 shadow cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={item.images[0]}
                    alt={item.title || item.name}
                    className="w-full h-36 object-contain mb-3"
                  />
                  <h3 className="text-sm font-semibold truncate">
                    {item.title || item.name}
                  </h3>
                  <p className="font-bold text-teal-600">
                    ₹{item.discountPrice}
                  </p>

                  <p className="absolute right-2 bottom-2">
                    {item.reviews.rating}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>

          {/* Button */}
          {/* <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate(`/products/${category}`)}
            className="px-8 py-3 bg-gradient-to-r from-teal-700 to-blue-400 text-white rounded-full"
          >
            View All
          </motion.button> */}
        </motion.div>
      ))}
    </div>
  );
};

export default CategorySection;
