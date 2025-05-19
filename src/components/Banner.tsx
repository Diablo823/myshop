"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import { Progress } from "@/components/ui/progress";

// Define the slide type
export interface Slide {
  id: number;
  title?: string;
  description?: string;
  img: string;
  url: string;
  bg: string;
  alt: string;
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
  // Create an expanded slides array for seamless looping
  const slidesRef = useRef<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1); // Start at index 1 (first real slide)
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressStartTimeRef = useRef<number | null>(null);
  const transitionRef = useRef(true);
  const slideCountRef = useRef(slides.length);

  // Initialize the expanded slides array with clones at beginning and end
  useEffect(() => {
    // First slide as last slide and last slide as first slide for looping
    slidesRef.current = [
      { ...slides[slides.length - 1], id: -1 }, // Last slide clone at start
      ...slides,
      { ...slides[0], id: -2 }, // First slide clone at end
    ];
    slideCountRef.current = slides.length;
  }, [slides]);

  const resetProgress = useCallback(() => {
    setProgress(0);
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    progressStartTimeRef.current = null;
  }, []);

  const startProgressTimer = useCallback(() => {
    if (autoPlayInterval <= 0) return;

    resetProgress();
    progressStartTimeRef.current = Date.now();
    
    progressTimerRef.current = setInterval(() => {
      if (progressStartTimeRef.current) {
        const elapsed = Date.now() - progressStartTimeRef.current;
        const newProgress = Math.min((elapsed / autoPlayInterval) * 100, 100);
        setProgress(newProgress);
      }
    }, 16); // Update roughly 60 times per second
  }, [autoPlayInterval, resetProgress]);

  // Handle the "snap back" when reaching cloned slides
  const handleTransitionEnd = useCallback(() => {
    if (!transitionRef.current) return;
    
    // If we're at the last clone (end), jump to the real first slide
    if (currentIndex >= slidesRef.current.length - 1) {
      transitionRef.current = false;
      setCurrentIndex(1);
      setTimeout(() => {
        transitionRef.current = true;
      }, 50);
    }
    
    // If we're at the first clone (beginning), jump to the real last slide
    if (currentIndex <= 0) {
      transitionRef.current = false;
      setCurrentIndex(slidesRef.current.length - 2);
      setTimeout(() => {
        transitionRef.current = true;
      }, 50);
    }
    
    setIsTransitioning(false);
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
    startProgressTimer();
  }, [isTransitioning, startProgressTimer]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
    startProgressTimer();
  }, [isTransitioning, startProgressTimer]);

  // Go to a specific slide (for indicator clicks)
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    // +1 because of the cloned first slide
    setCurrentIndex(index + 1);
    startProgressTimer();
  }, [isTransitioning, startProgressTimer]);

  // Get the actual slide index (accounting for cloned slides)
  const getRealIndex = useCallback(() => {
    if (currentIndex <= 0) return slideCountRef.current - 1;
    if (currentIndex >= slideCountRef.current + 1) return 0;
    return currentIndex - 1;
  }, [currentIndex]);

  const realIndex = getRealIndex();

  useEffect(() => {
    startProgressTimer();
    
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
    };
  }, [currentIndex, startProgressTimer]);

  useEffect(() => {
    if (autoPlayInterval > 0) {
      const timer = setTimeout(nextSlide, autoPlayInterval);
      return () => clearTimeout(timer);
    }
  }, [nextSlide, autoPlayInterval, currentIndex]);

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
        className={`flex h-full ${transitionRef.current ? 'transition-transform duration-500 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentIndex * 100 / slidesRef.current.length}%)`, width: `${slidesRef.current.length * 100}%` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slidesRef.current.map((slide, index) => (
          <Link
            key={`slide-${slide.id}-${index}`}
            href={slide.url}
            className="h-full"
            style={{ width: `${100 / slidesRef.current.length}%` }}
          >
            <div className="relative w-full h-full">
              <Image
                src={slide.img || "/placeholder.svg"}
                alt={slide.alt || "Slide"}
                fill
                style={{ objectFit: "cover" }}
                priority={index === 1} // First real slide
              />
              <div className={`absolute inset-0`}></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-700 mb-4">
                  {slide.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Multiple progress indicators - one for each real slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
          <div className="flex gap-1 md:gap-2">
            {slides.map((_, index) => (
              <div 
                key={index} 
                className="w-12 md:w-16"
                onClick={() => goToSlide(index)}
              >
                <Progress 
                  value={index === realIndex ? progress : (index < realIndex ? 100 : 0)} 
                  className={`h-1 cursor-pointer ${
                    index === realIndex 
                      ? "bg-gray-300 bg-opacity-50" 
                      : "bg-gray-300 bg-opacity-30"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
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