import Image from 'next/image';
import React from 'react';

const Loading = () => {
  return (
    <div className="h-[calc(100vh-136px)] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-amber-50/30 relative overflow-hidden">
      {/* Elegant background elements - subtle */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-100/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gray-100/50 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <div className="relative flex flex-col items-center gap-6 md:gap-8 z-10">
        {/* Animated rings around logo */}
        <div className="relative">
          {/* Outermost glow ring */}
          <div className="absolute inset-0 w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-amber-200/30 to-yellow-300/30 blur-xl animate-pulse"></div>

          {/* Outer ring - Gold */}
          <div
            className="absolute inset-0 w-20 h-20 md:w-32 md:h-32 rounded-full border-2 border-amber-400/50 animate-spin"
            style={{ animationDuration: '4s' }}
          ></div>

          {/* Middle ring - Gray */}
          <div
            className="absolute inset-1.5 w-17 h-17 md:inset-2 md:w-28 md:h-28 rounded-full border-2 border-gray-300/50 animate-spin"
            style={{ animationDuration: '3s', animationDirection: 'reverse' }}
          ></div>

          {/* Inner ring - Gold accent */}
          <div
            className="absolute inset-3 w-14 h-14 md:inset-4 md:w-24 md:h-24 rounded-full border border-amber-500/40 animate-spin"
            style={{ animationDuration: '2s' }}
          ></div>

          {/* Logo container with premium backdrop */}
          <div className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200/50 shadow-lg"></div>
            <div className="relative w-11 h-11 md:w-18 md:h-18 animate-pulse">
              <Image
                //src="https://ik.imagekit.io/5ok2lashts/loadlogo.png?updatedAt=1736980178600"
                src='/logo.webp'
                alt="Loading animation"
                fill
                sizes="(max-width: 768px) 44px, 72px"
                priority
                className="object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]"
              />
            </div>
          </div>
        </div>

        {/* Loading text with elegant styling */}
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-lg md:text-2xl font-light tracking-[0.25em] md:tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600">
              LOADING
            </span>
            <div className="flex gap-1 md:gap-1.5">
              <div
                className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full animate-bounce shadow-[0_0_6px_rgba(212,175,55,0.4)]"
                style={{ animationDelay: '0ms' }}
              ></div>
              <div
                className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full animate-bounce shadow-[0_0_6px_rgba(212,175,55,0.4)]"
                style={{ animationDelay: '150ms' }}
              ></div>
              <div
                className="w-1 h-1 md:w-1.5 md:h-1.5 bg-amber-500 rounded-full animate-bounce shadow-[0_0_6px_rgba(212,175,55,0.4)]"
                style={{ animationDelay: '300ms' }}
              ></div>
            </div>
          </div>

          {/* Elegant divider */}
          <div className="w-40 md:w-48 h-[1px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent"></div>
        </div>

        {/* Premium progress bar */}
        <div className="relative w-40 md:w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden border border-amber-200/50 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-60"></div>
        </div>

        {/* Subtle tagline */}
        <p className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase font-light mt-2 md:mt-4">
          Preparing Your Experience
        </p>
      </div>
    </div>
  );
};

export default Loading;