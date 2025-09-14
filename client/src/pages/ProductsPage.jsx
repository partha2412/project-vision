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
    console.log(showOptions);


    return (
        <div className='flex relative'>
            <div className="absolute z-50">
                <button onClick={() => setShowOptions(!showOptions)} className="p-4 bg-gradient-to-r from-violet-400/70 to-blue-400/40">
                    <div className="flex flex-col gap-1">
                        <div className="w-7 h-1 p-[2px] bg-pink-100"></div>
                        <div className="w-7 h-1 p-[2px] bg-pink-100"></div>
                        <div className="w-7 h-1 p-[2px] bg-pink-100"></div>
                    </div>
                </button>
            </div>
            <div className={`absolute z-30 top-0 left-0 h-full w-64 flex bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${showOptions ? "translate-x-0" : "-translate-x-full"}`}>
                <LeftOptions />
            </div>
            <Products data={dataset} />
        </div>
    )
}

export default ProductsPage
