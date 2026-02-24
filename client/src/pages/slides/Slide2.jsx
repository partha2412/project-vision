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
      <div className="min-w-[200px] mr-6">
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
        className="absolute left-[220px] z-10 px-3 py-2 rounded-full  shadow-md duration-300 cursor-pointer hover:bg-gray-200"
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
            className="flex-shrink-0 w-40 sm:w-80 bg-gray-200 hover:bg-gray-100 duration-300 cursor-pointer rounded-lg flex flex-col items-center justify-between p-3"
          >
            <div className="text-lg mb-3 font-semibold capitalize">
              {product.productType}
            </div>
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-28 object-contain"
            />

            {/* <button
              className="mt-5 px-3 py-2 bg-black hover:bg-gray-500 duration-300 cursor-pointer text-white text-sm font-semibold rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${item._id}`);
              }}
            >
              Explore
            </button> */}

          </div>
        ))}
      </div>
    </div>
  );
};

export default Slide2;
