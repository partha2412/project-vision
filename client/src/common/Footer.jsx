import React from 'react'
import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="w-full bg-black text-white px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Column 1 */}
      <div>
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
      <div>
        <h3 className="font-bold mb-2">Knowledge</h3>
        <p>FAQs</p>
        <p>Return & Refund Policy</p>
        <p>Track Order</p>
        <p>Help Center</p>
      </div>

      {/* Column 3 */}
      <div>
        <h3 className="font-bold mb-2">Contact Us</h3>
        <p>Need help fast? Fill out our form or email help@beminimalist.co</p>

        <div className="mt-6 flex items-center space-x-4 text-2xl">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaFacebook />
          </a>
          <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaWhatsapp />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
            <FaInstagram />
          </a>
        </div>
      </div>

    </div>
  )
}

export default Footer