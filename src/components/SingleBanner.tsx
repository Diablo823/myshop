"use client";

import Image from "next/image";
import Link from "next/link";

// Simple slide type for single image banner
export interface SingleSlide {
  id: number;
  title?: string;
  description?: string;
  img: string;
  url: string;
  bg?: string;
}

interface SingleImageProps {
  slide: SingleSlide;
  height: string;
  className?: string;
}

const SingleBanner = ({
  slide,
  height,
  className = "",
}: SingleImageProps) => {
  if (!slide) return null;

  return (
    <div
      className={`relative ${height} overflow-hidden rounded-3xl w-full mt-1 ${className}`}
    >
      {/* Ensure link covers full width and height */}
      <Link
        href={slide.url || "#"}
        className="block w-full h-full"
      >
        <div className="relative w-full h-full">
          <Image
            src={slide.img || "/placeholder.svg"}
            alt={slide.title || "Banner"}
            fill
            style={{ objectFit: "cover" }}
            priority
          />

          {/* Caption overlay if provided */}
          {(slide.title || slide.description) && (
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              {slide.title && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
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

export default SingleBanner;
