import { useParams } from "react-router-dom";
import Products from './Products'
import LeftOptions from '../components/LeftOptions'
import { datasets } from "../datas/productsData";
import { useState } from "react";


const ProductsPage = () => {
    const { type } = useParams(); // 👈 get the value from URL
    // Pick dataset based on type
    const dataset = datasets[type]

    const [showOptions, setShowOptions] = useState(false);
    //console.log(showOptions);


    return (
        <div className='flex relative'>
           <div className="absolute left-4 top-4 z-50">
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="relative w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition duration-300"
        >
        {/* Hamburger / X */}
         <div className="space-y-1.5">
         <span
          className={`block h-0.5 w-6 rounded-full bg-gray-800 transform transition duration-300 ${
          showOptions ? "rotate-45 translate-y-2" : ""
          }`}
         ></span>
         <span
          className={`block h-0.5 w-6 rounded-full bg-gray-800 transition-opacity duration-300 ${
          showOptions ? "opacity-0" : "opacity-100"
           }`}
         ></span>
         <span
          className={`block h-0.5 w-6 rounded-full bg-gray-800 transform transition duration-300 ${
          showOptions ? "-rotate-45 -translate-y-2" : ""
          }`}
        >
        </span>
        </div>
      </button>
       </div>
            <div className={`absolute z-30 top-4 left-0 px-4 h-full w-80 flex bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${showOptions ? "translate-x-0" : "-translate-x-full"}`}>
                <LeftOptions />
            </div>
            
            <Products data={dataset} />
        </div>
    )
}

export default ProductsPage
