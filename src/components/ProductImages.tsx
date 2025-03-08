"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef, TouchEvent } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useSwipeable } from "react-swipeable";

const ProductImages = ({ items }: { items: any[] }) => {
  const [index, setIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % items.length);
    resetZoom();
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
    resetZoom();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  // Swipe handlers for the main carousel
  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true
  });

  // Implement scroll lock when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      // Add styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Get the scroll position from the body's top property
      const scrollY = document.body.style.top;
      // Remove styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
    resetZoom();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1));
  };

  // Calculate distance between two touch points
  const getDistance = (touches: React.TouchList): number => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  // Handle touch start for pinch zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent browser's default zoom
    
    if (e.touches.length === 2) {
      // Initialize for pinch zoom
      setTouchDistance(getDistance(e.touches));
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      // Initialize for drag
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX, 
        y: e.touches[0].clientY 
      });
    }
  };

  // Handle touch move for pinch zoom and drag
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent browser's default behaviors
    
    if (e.touches.length === 2 && touchDistance !== null) {
      // Handle pinch zoom
      const currentDistance = getDistance(e.touches);
      const scaleFactor = 0.01; // Adjust sensitivity
      
      // Calculate new zoom level based on touch distance change
      const touchDelta = currentDistance - touchDistance;
      const newZoomLevel = Math.max(1, Math.min(3, zoomLevel + (touchDelta * scaleFactor)));
      
      setZoomLevel(newZoomLevel);
      setTouchDistance(currentDistance);
    } else if (e.touches.length === 1 && isDragging && zoomLevel > 1) {
      // Handle touch drag
      const currentTouch = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      
      setPosition({
        x: position.x + (currentTouch.x - dragStart.x),
        y: position.y + (currentTouch.y - dragStart.y)
      });
      
      setDragStart(currentTouch);
    }
  };

  // Handle touch end
  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(null);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoomLevel > 1) {
      setPosition({
        x: position.x + (e.clientX - dragStart.x),
        y: position.y + (e.clientY - dragStart.y)
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add keyboard event listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'ArrowRight':
          nextSlide();
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <div 
        className="h-[400px] md:h-[500px] relative group"
        {...handlers}
      >
        <Image
          src={items[index].image?.url}
          alt="main-img"
          fill
          sizes="50vw"
          priority
          className="object-cover object-center rounded-lg transition-transform duration-500 cursor-pointer"
          onClick={openModal}
        />

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={(e: React.MouseEvent) => {
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
              onClick={(e: React.MouseEvent) => {
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

      {/* MODAL - With touch pinch zoom support */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-lg overflow-hidden w-full max-w-3xl max-h-[90vh] md:max-h-[80vh]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <div className="text-lg font-medium">
                Image {index + 1} of {items.length}
              </div>
              
              {/* Zoom controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleZoomOut}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  aria-label="Zoom out"
                  disabled={zoomLevel <= 1}
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-sm px-2">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  aria-label="Zoom in"
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="ml-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Image container with touch support */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden" ref={imageContainerRef}>
              <div 
                className="w-full h-full overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              >
                <div 
                  className={`w-full h-full flex items-center justify-center ${zoomLevel > 1 ? 'cursor-move' : ''}`}
                >
                  <div
                    style={{
                      transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                      transition: isDragging ? 'none' : 'transform 0.1s ease',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  >
                    <Image
                      src={items[index].image?.url}
                      alt="zoomed-img"
                      width={550}
                      height={550}
                      className="object-contain touch-none"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              {items.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-800" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-800" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;