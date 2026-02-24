import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import left from "../../assets/icon/left-arrow-svgrepo-com.svg";
import right from "../../assets/icon/right-arrow-svgrepo-com.svg";
import { fetchProducts } from "../../api/productApi";

const Slide2 = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [products, setProducts] = useState([]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll loop
  useEffect(() => {
    let interval;
    if (!isHovered) {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

          // If reached end → reset back to start
          if (scrollLeft + clientWidth >= scrollWidth) {
            scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
          }
        }
      }, 2000); // auto scroll every 2.5s
    }
    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    const data = await fetchProducts();
    const allProducts = data.products || data;

    // group by productType
    const map = new Map();

    allProducts.forEach(product => {
      if (!map.has(product.productType)) {
        map.set(product.productType, product);
      }
    });

    // one product per unique type
    const uniqueTypeProducts = Array.from(map.values());

    setProducts(uniqueTypeProducts);
  };

  return (
    <div
      className="w-full bg-white flex items-center p-6 relative "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Side Text */}
      <div className="hidden md:block min-w-[200px] mr-6">
        <h1 className="text-3xl md:text-4xl text-black font-bold leading-snug">
          WEAR THE TREND
        </h1>
        <p className="text-sm text-gray-700 font-semibold mt-2">
          Our hottest collections
        </p>
      </div>

      {/* Scroll Buttons */}
      <button
  onClick={() => scroll("left")}
  className="absolute left-2 md:left-[220px] z-20 px-3 py-2 rounded-full shadow-md bg-white/90 hover:bg-gray-200"
>
        <div className="size-8">
          <img src={left} alt="left" />
        </div>
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-4 z-10 px-3 py-2 rounded-full shadow-md duration-300 cursor-pointer hover:bg-gray-200"
      >
        <div className="size-8">
          <img src={right} alt="right" />
        </div>
      </button>

      {/* Right Side Images */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
      >
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="flex-shrink-0 w-44 sm:w-80 bg-gray-100 hover:bg-white duration-300 cursor-pointer rounded-xl flex flex-col items-center p-4 shadow-sm hover:shadow-md transition"
          >
            {/* Image Container */}
            <div className="w-full h-48 sm:h-56 flex items-center justify-center mb-4">
              <img
                src={product.images[0]}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Title */}
            <div className="text-base sm:text-lg font-semibold capitalize text-gray-800">
              {product.productType}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slide2;
