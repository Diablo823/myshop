import Image from 'next/image';
import React from 'react';

const Loading = () => {
  return (
    <div className="h-[calc(100vh-136px)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated rings around logo */}
        <div className="relative">
          {/* Outer ring */}
          <div className="absolute inset-0 w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-blue-200 animate-spin" 
               style={{animationDuration: '3s'}}></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-blue-400 animate-spin" 
               style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
          
          {/* Logo container */}
          <div className="relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center">
            <div className="relative w-12 h-12 md:w-16 md:h-16 animate-pulse">
              <Image
                src="https://ik.imagekit.io/5ok2lashts/loadlogo.png?updatedAt=1736980178600"
                alt="Loading animation"
                fill
                sizes="(max-width: 768px) 64px, 64px"
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Loading text with dots animation */}
        <div className="flex items-center gap-1">
          <span className="text-lg md:text-xl font-semibold tracking-wide text-gray-700">
            Loading
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" 
                 style={{animationDelay: '0ms'}}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" 
                 style={{animationDelay: '150ms'}}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" 
                 style={{animationDelay: '300ms'}}></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-32 md:w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;