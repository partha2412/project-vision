import React, { useState, useEffect, useRef } from 'react';
import right from "../assets/icon/right-arrow-svgrepo-com.svg";
import left from "../assets/icon/left-arrow-svgrepo-com.svg";

const Carousl_SingleProduct = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slideInterval = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        startAutoSlide();
        return () => stopAutoSlide();
    }, [currentIndex]);

    const startAutoSlide = () => {
        stopAutoSlide();
        slideInterval.current = setInterval(() => {
            nextSlide();
        }, 5000);  // Changed from 3000ms to 5000ms
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

    if (!images || images.length === 0) {
        return (
            <div className="w-full h-56 flex items-center justify-center bg-gray-100 text-gray-500">
                No Images
            </div>
        );
    }

    return (
        <div
            className="relative w-full h-56 overflow-hidden rounded-lg shadow-md bg-gray-50"
            onMouseEnter={stopAutoSlide}
            onMouseLeave={startAutoSlide}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div
                className="h-full flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`slide-${idx}`}
                        className="w-full h-full flex-shrink-0 object-contain object-center"
                    />
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-opacity-50 hover:bg-opacity-80 p-1 rounded-full"
            >
                <img src={left} alt="Previous" className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-opacity-50 hover:bg-opacity-80 p-1 rounded-full"
            >
                <img src={right} alt="Next" className="w-6 h-6" />
            </button>

            <div className="absolute bottom-2 w-full flex justify-center gap-2">
                {images.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`h-2 w-2 rounded-full cursor-pointer transition-all duration-300 ${currentIndex === idx ? 'bg-black w-4' : 'bg-gray-400'}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Carousl_SingleProduct;
