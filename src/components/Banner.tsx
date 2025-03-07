"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

// Define the slide type
export interface Slide {
  id: number;
  title?: string;
  description?: string;
  img: string;
  url: string;
  bg: string;
}

interface BannerProps {
  slides: Slide[];
  autoPlayInterval?: number; // Optional prop for customizing slideshow timing
  showControls?: boolean; // Optional prop to show/hide navigation buttons
  height: string;
}

const Banner = ({
  slides,
  autoPlayInterval = 5000,
  showControls = true,
  height,
}: BannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (autoPlayInterval > 0) {
      const timer = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(timer);
    }
  }, [nextSlide, autoPlayInterval]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  });

  if (!slides.length) {
    return null;
  }

  return (
    <div
      className={`relative ${height} overflow-hidden rounded-3xl w-full mt-1`}
      {...handlers}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <Link
            key={slide.id}
            href={slide.url}
            className="w-full h-full flex-shrink-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.img || "/placeholder.svg"}
                alt={slide.title || "Slide"}
                fill
                style={{ objectFit: "cover" }}
                priority={slide.id === 1}
              />
              <div className={`absolute inset-0`}></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-700 mb-4">
                  {slide.description}
                </p>
                {/* <button className="bg-gray-800 hover:bg-gray-950 text-white font-bold py-2 px-4 rounded transition duration-300">
                  Shop Now
                </button> */}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {showControls && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}
    </div>
  );
};

export default Banner;

/* ${slide.bg} opacity-0 */