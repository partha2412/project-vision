import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchProducts } from "../../api/productApi";
import { IoIosMale, IoIosFemale } from "react-icons/io";
import { FaChild } from "react-icons/fa";

// Skeleton for a single product card
const SkeletonProductCard = () => (
  <div className="bg-white rounded-2xl p-4 shadow-md">
    <div className="w-full h-44 sm:h-52 rounded-xl bg-gray-200 animate-pulse mb-4" />
    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-2" />
    <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
  </div>
);

// Skeleton for a full category section
const SkeletonCategoryBlock = () => (
  <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
    {/* Header */}
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
      <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
    </div>

    {/* Cards grid */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  </div>
);

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
      const products = data.products || data;

      
      const grouped = {};
      products.forEach((product) => {
        const cat = product.category?.toLowerCase() || "others";
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(product);
      });

      
      const categoryOrder = ["men", "women", "unisex", "unisex kids", "others"];
      
      const orderedGrouped = {};
      categoryOrder.forEach((cat) => {
        if (grouped[cat]) orderedGrouped[cat] = grouped[cat];
      });
      
      Object.keys(grouped).forEach((cat) => {
        if (!orderedGrouped[cat]) orderedGrouped[cat] = grouped[cat];
      });

      setCategories(orderedGrouped);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };


  
  return (
    <div className="p-8 space-y-12 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {loading
        ? // Show 3 skeleton category blocks while loading
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCategoryBlock key={i} />
          ))
        : Object.entries(categories).map(([category, products]) => (
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
                  {category === "unisex" && <p className="text-4xl">U</p>}
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
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-xl cursor-pointer"
                  >
                    <div className="relative w-full h-44 sm:h-52 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4 overflow-hidden">
                      <img
                        src={item.images[0]}
                        alt={item.title || item.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                      {item.title || item.name}
                    </h3>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-teal-600 font-bold text-sm sm:text-base">
                        ₹{item.discountPrice}
                      </p>
                      {((item.price - item.discountPrice) / item.price) * 100 > 40 && (
                        <span className="text-sm px-2 py-1 rounded-full bg-teal-50 text-teal-700">
                          Offer
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
    </div>
  );
};

export default CategorySection;
