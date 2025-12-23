"use client"

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Button } from "../ui/button";

interface CategoryItem {
  _id?: string | null;
  slug?: string | null;
  name?: string | null;
  media?: {
    mainMedia?: {
      image?: {
        url?: string | null;
      }
    }
  }
}

interface CategoryListClientProps {
  initialCategories: CategoryItem[];
}

export default function CategoryListClient({ initialCategories }: CategoryListClientProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const cardWidth = 96; // Approximate card width including gap (80px card + 16px gap)
      const scrollAmount = cardWidth * 3; // Scroll 3 cards at a time for better UX

      scrollContainer.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative mt-6 px-0.5">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-2 snap-x snap-mandatory"
      >
        {initialCategories.map((item) => (
          <Link
            href={`/list?cat=${item.slug || ''}`}
            key={item._id || ''}
            className="flex flex-col items-center flex-shrink-0 w-20 snap-center group rounded-3xl"
          >
            <div className="relative w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden group-hover:shadow-md transition-shadow">
              <Image
                src={item.media?.mainMedia?.image?.url || "/category.png"}
                alt={item.name || "category"}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-[10px] text-center font-semibold text-gray-900 group-hover:text-black transition-colors">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
      {/* Scroll buttons - positioned absolutely for overlay on larger screens */}
      <div className="absolute top-1/2 -translate-y-1/2 left-2 hidden md:flex z-10">
        <Button
          onClick={() => scroll('left')}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          <FaArrowLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 hidden md:flex z-10">
        <Button
          onClick={() => scroll('right')}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          <FaArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}