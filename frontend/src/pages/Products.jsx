import { useLocation } from "react-router-dom";
import Carousel from '../components/Carousl_Products';

const Products = ({ data }) => {

 // console.log(data);
  
  function handleClick() {

  }


  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-200 to-gray-400  py-12 flex flex-col items-center">
      <h1 className="text-3xl md:text-2xl font-bold text-center text-gray-900 mb-4 tracking-wide">
        ✨ Our Premium Skincare Collection ✨
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-5 md:gap-5 p-1  ">
        {data.map((item, index) => (
          <div
            key={index}
            className="bg-white h-100 w-100  shadow-sm rounded-xl overflow-hidden hover:shadow-2xl transform transition duration-300 flex flex-col"
          >
            {/* Product Image Carousel */}
            <div className="relative w-full h-[60%] sm:h-full md:h-full justify-center items-center overflow-hidden  ">
              {Array.isArray(item.image) ? (
                <Carousel images={item.image.filter((src) => src.trim() !== "")} />
              ) : (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-contain object-center"
                />
              )}
            </div>



            {/* Product Info */}
            <div className="p-5  flex flex-col h-[40%]">

              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={i < (Number(item.star) || 0) ? "black" : "none"}
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="w-4 h-4 text-black"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                ))}

                <p>234</p>
              </div>

              {/* Details */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {item.title || "Product Title"}
                </h2>
                <p className="text-sm text-gray-600 mb-3 flex-grow">
                  {item.descriptio || "Product description goes here."}
                </p>
              </div>




              {/* Prices */}
              <div className='flex items-baseline-last gap-3'>
                <div>
                  <p className="text-gray-900 font-bold text-[20px] mb-4">
                    ₹ {item.price || "---"}
                  </p>
                </div>
                <div className="relative flex items-center text-gray-500 text-[16px] ">
                  ₹ {item.prev_price || "---"}
                  <span className="absolute left-0 top-6/11 w-full h-[1pt] bg-gray-500 "></span>
                </div>
                <div>
                  <p>(20% OFF)</p>
                </div>

              </div>



              {/* Buttons */}
              {/* <div className="flex gap-2">
                <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-700 transition">
                  Buy Now
                </button>
                <button className="flex-1 border border-gray-700 text-gray-900 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-600 hover:text-gray-200 transition duration-300">
                  Add to Cart
                </button>


              </div> */}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products
