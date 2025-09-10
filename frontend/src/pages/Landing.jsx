import React from 'react'
import Carousel from './Carousl.jsx'
import Middlebar from './Middlebar.jsx'
import LowerNavbar from './LowerNavbar.jsx'
import Navbar from "./Navbar.jsx"
import BuyOneGetOne from './BuyonegetOne.jsx'

const Landing = () => {
    const images = [
        
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-harrypotter_20052025_rat.png",
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-hustlr.png",
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-celebs-style-260625.png",
    ]
    return (
        <div>
            <div className='flex flex-col '>

               <Navbar/>
                {/* Sliding 1st Slide */}
                <div className='bg-sky-400 h-155'>
                    <Carousel images={images} />
                </div>
                 <Middlebar/>
                 <BuyOneGetOne/>
                 <LowerNavbar/>
                

            </div>
        </div>
    )
}

export default Landing