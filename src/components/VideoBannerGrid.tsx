"use client";

import Link from "next/link";

// Define the interface for a video slide, based on slides1 but with video instead of img
export interface VideoSlide {
  id: number;
  title?: string;
  description?: string;
  video: string; // URL to the video file
  poster?: string; // Optional poster image for the video
  url: string;
  bg?: string;
  alt?: string;
}

// Component to render a single video banner item
interface VideoBannerItemProps {
  slide: VideoSlide;
  className?: string;
}

const VideoBannerItem = ({ slide, className = "" }: VideoBannerItemProps) => {
  if (!slide) return null;

  return (
    <div className={`relative overflow-hidden rounded-3xl mt-4 ${className}`}>
      <Link href={slide.url || "#"} className="block w-full h-full">
        <div className="relative w-full aspect-[9/16]">
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
            <div className="absolute bottom-3 flex flex-col p-4">
              {slide.title && (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {slide.title}
                </h2>
              )}
              {slide.description && (
                <p className="text-md md:text-lg text-gray-700">
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

// Main component to render the grid of video banners
interface VideoBannerGridProps {
  slides: VideoSlide[];
  className?: string;
}

const VideoBannerGrid = ({ slides, className = "" }: VideoBannerGridProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 ${className}`}>
      {slides.map((slide) => (
        <VideoBannerItem key={slide.id} slide={slide} />
      ))}
    </div>
  );
};

export default VideoBannerGrid;