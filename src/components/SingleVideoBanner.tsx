"use client";

import Link from "next/link";

// Slide type for single video banner
export interface VideoSlide {
  id: number;
  title?: string;
  description?: string;
  video: string;  // URL to the video file
  poster?: string; // URL to the poster image
  url: string;
  bg?: string;
  alt?: string;  // Optional, could be used for accessibility
}

interface SingleVideoBannerProps {
  slide: VideoSlide;
  className?: string;
}

const SingleVideoBanner = ({ slide, className = "" }: SingleVideoBannerProps) => {
  if (!slide) return null;

  return (
    <div className={`relative md:hidden overflow-hidden rounded-3xl w-full mt-6 ${className}`}>
      <Link href={slide.url || "#"} className="block w-full h-full">
        <div className="relative w-full pb-[177.78%] md:pb-[56.25%]">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={slide.video}
            poster={slide.poster}
            autoPlay
            loop
            muted
            playsInline
          />
          {(slide.title || slide.description) && (
            <div className="absolute bottom-1 flex flex-col p-2">
              {slide.title && (
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  {slide.title}
                </h2>
              )}
              {slide.description && (
                <p className="text-lg md:text-xl text-gray-700 mb-4">
                  {slide.description}
                </p>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default SingleVideoBanner;