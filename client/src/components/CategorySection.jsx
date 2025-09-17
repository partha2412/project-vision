import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CategorySection = () => {
  const navigate = useNavigate();

  // Example products
  const products = {
    men: [
      { id: 1, name: "Blue Block Zero Power Screen Glasses", price: "₹1000", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//l/i/peyush-bansal-shark-tank-dark-night-full-rim-hustlr-eyeglasses_csvfile-1679642300116-black2.jpg" },
      { id: 2, name: "Blue Block Zero Power Screen Glasses", price: "₹1200", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//l/i/blue-block-screen-glasses:--gunmetal-full-rim-rectangle-lenskart-blu-screen-glasses-blu-computer-glasses-lb-e17492-eyeglasses__dsc9684_12_11_2024.jpg" },
      { id: 3, name: "Blue Block Zero Power Screen Glasses", price: "₹700", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//l/i/blue-block-phone-&-computer-glasses:-light-blue-transparent-full-rim-round-lenskart-blu-lb-e14061-c1_lenskart-blu-lb-e14061-c1-eyeglasses_lenskart-blu-lb-e14061-c1-eyeglasses_eyeglasses_g_9196_325_02_2022.jpg" },
      { id: 4, name: "Green Full Rim Rectangle", price: "₹3500", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//j/i/green-brown-full-rim-rectangle-john-jacobs-tr-flex-jj-e16847-c1-eyeglasses__dsc5069_23_04_2024.jpg" },
    ],
    women: [
      { id: 1, name: "Pink Transparent Full Rim Cat Eye", price: "₹1500", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//v/i/gold-pink-transparent-full-rim-rectangle-vincent-chase-blend-edit-vc-e14974-c2-eyeglasses_g_3524_10_14_22.jpg" },
      { id: 2, name: "Gray Transparent Full Rim Square", price: "₹1500", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//l/i/lenskart-air-la-e13068-c6-eyeglasses_g_4836_03_03_2023.jpg" },
      { id: 3, name: "Sky Blue Full Rim Square", price: "₹1500", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//l/i/sky-blue-full-rim-square-lenskart-air-fusion-la-e13069-c2-eyeglasses_lenskart-air-la-e13033-c2-eyeglasses_eyeglasses_g_3588_1_05_july23.jpg" },
      { id: 4, name: "Crystal Transparent Full Rim Square", price: "₹150", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//l/i/transparent-silver-full-rim-rectangle-lenskart-air-signia-la-e14016-c1-eyeglasses_csvfile-1673003051725-g_2034_09-july.jpg" },
    ],
    kids: [
      { id: 1, name: "Blue Transparent Full Rim Rectangle", price: "₹800", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//h/i/blue-transparent-black-grey-full-rim-rectangle-kids--8-12-yrs--hooper-flexi-hooper-hp-e15084l-c3-eyeglasses_blue-transparent-black-grey-full-rim-rectangle-kids-(8-12-yrs)-hooper-flexi-hooper-hp-e15084l-c3-eyeglasses_g_5352_9_21_22_22_march23.jpg.jpg" },
      { id: 2, name: "Pink Transparent Full Rim Rectangle", price: "₹759", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//h/i/pink-transparent-purple-pink-tortoise-full-rim-rectangle-kids--5-8-yrs--hooper-tr-flex-hooper-hp-e15084m-c3-eyeglasses_g_5388.jpg" },
      { id: 3, name: "Pink Full Rim Cat Eye", price: "₹950", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//h/i/hooper-hp-e10025l-c11-eyeglasses_csvfile-1717417087656-_dsc5675.jpg" },
      { id: 4, name: "Blue Transparent Full Rim Rectangle", price: "₹800", img: "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//h/i/kids-glasses:-black-blue-transparent-black-full-rim-rectangle-kids--8-12-yrs--hooper-astra-hooper-hp-e10014l-c4_hooper-hp-e10014l-c4-eyeglasses_g_0982_22_march23.jpg.jpg" },
    ],
  };

  // Reusable category
  const renderCategory = (title, icon, items, path, buttonColor) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/80 backdrop-blur-md border-0 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition duration-300"
    >
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={icon}
          alt={title}
          className="w-20 h-20 rounded-full border-4 border-teal-500 shadow-md object-cover"
        />
        <div>
          <h2 className="text-2xl font-extrabold text-gray-800">{title}</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mt-1"></div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white border rounded-xl p-4 shadow hover:shadow-2xl cursor-pointer transition"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-36 object-contain rounded-lg mb-3"
            />
            <h3 className="text-sm font-semibold text-gray-800 truncate">
              {item.name}
            </h3>
            <p className="bg-gradient-to-r from-teal-500 to-blue-500 text-transparent bg-clip-text font-bold">
              {item.price}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => navigate(path)}
        className={`px-8 py-3 bg-gradient-to-r ${buttonColor} text-white font-semibold rounded-full shadow-md hover:shadow-2xl transition`}
      >
        View All
      </motion.button>
    </motion.div>
  );

  return (
    <div className="p-8 space-y-12 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      {renderCategory(
        "Men's Glasses",
        "https://static1.lenskart.com/media/desktop/img/Apr23/6th-apr/sleek-steel/Frame%20611.jpg",
        products.men,
        "/men",
        "from-teal-700 to-blue-400"
      )}

      {renderCategory(
        "Women's Glasses",
        "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//j/i/pink-gold-pink-full-rim-cat-eye-john-jacobs-tr-flex-jj-e14409-c6-eyeglasses_217994_1_18march25.png",
        products.women,
        "/women",
        "from-pink-500 to-rose-500"
      )}

      {renderCategory(
        "Kids' Glasses",
        "https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//model/h/i/blue-transparent-black-grey-full-rim-rectangle-kids-(8-12-yrs)-hooper-flexi-hooper-hp-e15084l-c3-eyeglasses_csvfile-1670830735097-23_nov_kids_m.f182854_204402.jpg",
        products.kids,
        "/kids",
        "from-blue-500 to-indigo-500"
      )}
    </div>
  );
};

export default CategorySection;
