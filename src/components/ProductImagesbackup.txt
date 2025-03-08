"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const ProductImages = ({ items }: { items: any }) => {
  const [index, setIndex] = useState(0);
  //const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  // Auto-play functionality
  // useEffect(() => {
  //   let intervalId: NodeJS.Timeout;
  //   if (isAutoPlaying && items.length > 1) {
  //     intervalId = setInterval(nextSlide, 5000);
  //   }
  //   return () => clearInterval(intervalId);
  // }, [isAutoPlaying, items.length]);

  // Pause auto-play on hover
  // const handleMouseEnter = () => setIsAutoPlaying(false);
  // const handleMouseLeave = () => setIsAutoPlaying(true);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true
  });

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <div 
        className="h-[400px] md:h-[500px] relative group"
        /* onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave} */
        {...handlers}
      >
        <Image
          src={items[index].image?.url}
          alt="main-img"
          fill
          sizes="50vw"
          priority
          className="object-cover object-center rounded-lg transition-transform duration-500"
        />

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 
                         transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 
                         transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {items.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {index + 1} / {items.length}
          </div>
        )}
      </div>

      {/* SMALL IMAGES */}
      <div className="flex gap-4 mt-4 pt-1 px-2 overflow-x-auto pb-1 scrollbar-hide">
        {items.map((item: any, idx: number) => (
          <div
            className={`w-16 h-16 relative flex-shrink-0 transition-all duration-300 ${
              idx === index 
                ? "ring-2 ring-pink-300 rounded-lg ring-offset-2" 
                : "opacity-70 hover:opacity-100"
            }`}
            key={item._id}
            onClick={() => setIndex(idx)}
          >
            <Image
              src={item.image?.url}
              alt="small-images"
              fill
              sizes="20vw"
              className="object-cover rounded-lg cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;