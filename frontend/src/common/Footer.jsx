import React from 'react'
import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <>  
     <div className="h-[250px] bg-black text-white px-8 py-6 flex flex-ro md:flex-row  gap-10 justify-between">
      
      {/* Column 1 */}
      <div className="mb-4 md:mb-0 ">
        <h3 className="font-bold mb-2">Company Overview</h3>
        <p>About Us</p>
        <p>Our Values</p>
        <p>Terms & Conditions</p>
        <p>Disclaimer</p>
        <p>Corporate Information</p>
        <p>Media Outreach</p>
        <p>Distributor Queries</p>
      </div>

      {/* Column 2 */}
      <div className="mb-4 md:mb-0">
        <h3 className="font-bold mb-2">Knowledge</h3>
        <p>FAQs</p>
        <p>Return & Refund Policy</p>
        <p>Track Order</p>
        <p>Help Center</p>
      </div>

      {/* Column 3 */}
      <div className="mb-4 md:mb-0">
        <h3 className="font-bold mb-2">Contact Us</h3>
        <p>Need help fast? Fill out our form or email help@beminimalist.co</p>
      </div>

      {/* Social Icons */}
      <div className="flex items-center space-x-4 text-2xl">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300  bg-blue-600">
          <FaFacebook />
        </a>
        <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 bg-green-400 ">
          <FaWhatsapp />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 bg-pink-600">
          <FaInstagram />
        </a>
      </div>

    </div>
     </>
   
  )
}

export default Footer