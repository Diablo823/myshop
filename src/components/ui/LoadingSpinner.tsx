import Image from 'next/image';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-2">
      <div className="animate-pulse relative w-16 h-16 md:w-24 md:h-24">
          <Image
            src="https://ik.imagekit.io/5ok2lashts/loadlogo.png?updatedAt=1736980178600"  // Replace with your image path
            alt="Loading animation"
            fill
            sizes="(max-width: 768px) 96px, 96px"
            priority // Since this is a loader, we want it to load immediately
            className="object-contain"
          />
        </div>
        <span className="text-sm md:text-lg font-semibold tracking-wide text-gray-800">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

{/* <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" /> */}