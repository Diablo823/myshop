"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface ProductImagesProps {
  items: any[];
  currentIndex?: number;
  setCurrentIndex?: (index: number) => void;
}

const ProductImages = ({ items, currentIndex = 0, setCurrentIndex }: ProductImagesProps) => {
  const [index, setIndex] = useState(currentIndex);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  const handleIndexChange = (newIndex: number) => {
    const safeIndex = Math.max(0, Math.min(newIndex, items.length - 1));
    setIndex(safeIndex);
    if (setCurrentIndex) {
      setCurrentIndex(safeIndex);
    }
  };

  const nextSlide = () => {
    const newIndex = (index + 1) % items.length;
    handleIndexChange(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (index - 1 + items.length) % items.length;
    handleIndexChange(newIndex);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: false,
    trackTouch: true,
    preventScrollOnSwipe: false
  });

  const safeIndex = Math.max(0, Math.min(index, items.length - 1));

  const slides = items.map((item: any) => ({
    src: item.image?.url,
    alt: item.image?.altText || "US Cartel product image",
  }));

  return (
    <div className="w-full">
      {/* MAIN IMAGE - SQUARE ASPECT RATIO */}
      <div
        className="w-full aspect-square relative group overflow-hidden rounded-lg bg-gray-50"
        {...handlers}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {items.map((item: any, idx: number) => (
            <div
              key={item._id || idx}
              className="relative w-full h-full flex-shrink-0"
            >
              <Image
                src={item.image?.url}
                alt={item.image?.altText || "US Cartel product image"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                priority={idx === safeIndex}
                className="object-cover cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 
                         transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 
                         transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {items.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {safeIndex + 1} / {items.length}
          </div>
        )}
      </div>

      {/* SMALL IMAGES */}
      <div className="flex gap-4 mt-4 pt-1 px-2 overflow-x-auto pb-1 scrollbar-hide">
        {items.map((item: any, idx: number) => (
          <div
            className={`w-12 h-12 relative flex-shrink-0 transition-all duration-300 ${idx === safeIndex
              ? "ring-2 ring-black rounded-lg ring-offset-2"
              : "opacity-70 hover:opacity-100"
              }`}
            key={item._id || idx}
            onClick={() => handleIndexChange(idx)}
          >
            <Image
              src={item.image?.url}
              alt={item.image?.altText || "US Cartel products"}
              fill
              sizes="80px"
              loading="lazy"
              className="object-cover rounded-lg cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* LIGHTBOX WITH ZOOM */}
      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={slides}
        index={safeIndex}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        on={{
          view: ({ index: lightboxIndex }) => {
            handleIndexChange(lightboxIndex);
          },
        }}
        carousel={{
          finite: false,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
      />
    </div>
  );
};

export default ProductImages;
