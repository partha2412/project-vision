import React from 'react';

import { IoCartOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const navigate = useNavigate();
  return (
    <div>
  {/* Header */}
       <header className="w-full flex items-center p-4 bg-white shadow-md z-50">
         <div className="text-2xl md:text-5xl font-extrabold tracking-widest text-gray-900 uppercase">
           Vision
         </div>
 
         {/* Navbar */}
         <nav className="flex items-center space-x-2 md:space-x-4 text-black font-medium ml-auto">
           {/* Login */}
           <button
            
             className="relative px-2 md:px-3 py-1 rounded-sm group text-sm md:text-base"
           >
             <span className="relative z-10">Trach Order</span>
             <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
           </button>
 
           {/* Home */}
          <button className="relative py-1 px-2 text-sm md:text-base font-medium group">
  <Link to="/login">
    Sign In & Sign Up
    <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>
  </Link>
</button>
 
       
 
           {/* Heart Icon */}
           <button 
                   onClick={()=>navigate("/wishlist")} 
           className="relative py-1 px-2 group">
             <span
     
             className="relative z-10 text-[22px] md:text-[28px]">
               <CiHeart />
             </span>
             <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>
           </button>
 
           {/* Cart Icon */}
           <button className="relative py-1 px-2 group">
             <span className="relative z-10 text-[22px] md:text-[28px]">
               <IoCartOutline />
             </span>
             <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-slate-500 transition-all duration-300 group-hover:w-full"></span>
           </button>
         </nav>
       </header>
    </div>
  )
}

export default Navbar
