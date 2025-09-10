import React, { useState, useEffect, useRef } from 'react';
import right from "../assets/icon/right-arrow-svgrepo-com.svg"
import left from "../assets/icon/left-arrow-svgrepo-com.svg"

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideInterval = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Auto slide every 3 seconds (optional)    
    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, [currentIndex]);

    const startAutoSlide = () => {
        stopAutoSlide();
        slideInterval.current = setInterval(() => {
            nextSlide();
        }, 3000);
    };

    const stopAutoSlide = () => {
        if (slideInterval.current) clearInterval(slideInterval.current);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Handle touch for swiping
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
        const distance = touchStartX.current - touchEndX.current;
        if (distance > 50) nextSlide();
        if (distance < -50) prevSlide();
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Slide images */}
            <div
                className="h-full flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`slide-${idx}`}
                        className="w-full h-full flex-shrink-0 object-cover object-center"
                    />

                ))}
            </div>

            {/* Navigation Buttons */}
                

            {/* Left button */}
            <button
                onClick={prevSlide}
                className="absolute cursor-pointer duration-200 top-1/2 left-3 transform -translate-y-1/2  bg-opacity-50 text-white w-20 h-20 flex items-center justify-center hover:bg-opacity-80"
            >
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeLinejoin="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg> */}

                {/* <svg viewBox="-19.04 0 75.803 75.803" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Group_64" data-name="Group 64" transform="translate(-624.082 -383.588)"> <path id="Path_56" data-name="Path 56" d="M660.313,383.588a1.5,1.5,0,0,1,1.06,2.561l-33.556,33.56a2.528,2.528,0,0,0,0,3.564l33.556,33.558a1.5,1.5,0,0,1-2.121,2.121L625.7,425.394a5.527,5.527,0,0,1,0-7.807l33.556-33.559A1.5,1.5,0,0,1,660.313,383.588Z" fill="#0c2c67"></path> </g> </g></svg> */}
                    
                <img src={left} ></img>


            </button>
            {/* Right button */}
            <button
                onClick={nextSlide}
                className="absolute cursor-pointer duration-200 top-1/2 right-3 transform -translate-y-1/2 bg-opacity-50 text-white w-20 h-20 flex items-center justify-center hover:bg-opacity-80"
            >
                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg> */}

                {/* <svg viewBox="-19.04 0 75.804 75.804" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#0c2c67"></path> </g> </g></svg> */}
                
                <div>
                    <img src={right} ></img>
                </div>
                
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 w-full flex justify-center gap-2">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-500 ${currentIndex === idx ? 'bg-black w-4' : 'bg-gray-400'
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Carousel;

