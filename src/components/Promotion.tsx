"use client";
import React, { useEffect, useRef, useSyncExternalStore } from 'react';

interface PromotionProps {
  days: number;
  startDate: string;
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

const getSharedTargetDate = (startDate: string, days: number): Date => {
  const START_DATE = new Date(startDate);
  return new Date(START_DATE.getTime() + days * 24 * 60 * 60 * 1000);
};

const useIsClient = () =>
  useSyncExternalStore(
    () => () => { },
    () => true,
    () => false
  );

// Ref-based countdown — zero React re-renders on every tick
const useCountdownRefs = (startDate: string, days: number, enabled: boolean) => {
  const refs = {
    days: useRef<HTMLHeadingElement>(null),
    hours: useRef<HTMLHeadingElement>(null),
    minutes: useRef<HTMLHeadingElement>(null),
    seconds: useRef<HTMLHeadingElement>(null),
  };

  useEffect(() => {
    if (!enabled) return;
    const pad = (n: number) => String(n).padStart(2, '0');

    const update = () => {
      const diff = getSharedTargetDate(startDate, days).getTime() - Date.now();
      const total = diff > 0 ? Math.floor(diff / 1000) : 0;
      if (refs.days.current) refs.days.current.textContent = pad(Math.floor(total / 86400));
      if (refs.hours.current) refs.hours.current.textContent = pad(Math.floor((total % 86400) / 3600));
      if (refs.minutes.current) refs.minutes.current.textContent = pad(Math.floor((total % 3600) / 60));
      if (refs.seconds.current) refs.seconds.current.textContent = pad(total % 60);
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [enabled, startDate, days]);

  return refs;
};

const StatBox = React.memo(({
  label,
  valueRef,
}: {
  label: string;
  valueRef: React.RefObject<HTMLHeadingElement>;
}) => (
  <div className="group relative flex-1">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg md:rounded-2xl opacity-30 group-hover:opacity-60 transition duration-500" />
    <div className="relative bg-white/5 border border-white/10 rounded-lg md:rounded-2xl p-2 md:p-4 lg:p-6 text-center hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:border-white/20">
      <h4
        ref={valueRef}
        className="font-bold text-xl md:text-3xl lg:text-4xl bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent mb-0.5 md:mb-2 tabular-nums"
      >
        00
      </h4>
      <p className="text-[9px] md:text-xs lg:text-sm uppercase tracking-wider text-slate-400 font-medium">
        {label}
      </p>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 md:w-8 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  </div>
));

StatBox.displayName = 'StatBox';

const Promotion = ({
  days,
  startDate,
  title = "Deals of the Month",
  description = "Get ready for a shopping experience like never before with our Deals of the Month! Every purchase comes with exclusive perks and offers, making this month a celebration of savvy choices and amazing deals. Don't miss out.",
  className = "",
  children,
}: PromotionProps) => {
  const isClient = useIsClient();
  const timerRefs = useCountdownRefs(startDate, days, isClient);

  return (
    <section
      className={`relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 ${className}`}
    >
      <div className="p-4 md:p-8 lg:p-12">
        {/* Static grid pattern — no animation, no cost */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />

        <div className="relative z-10 flex flex-col justify-center gap-4 md:gap-8 w-full">
          <div className="space-y-2 md:space-y-4">
            <div className="inline-block">
              {/* Lightweight pulse — tiny element, no blur, safe */}
              <div className="h-0.5 md:h-1 w-12 md:w-16 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full mb-2 md:mb-4 animate-pulse" />
            </div>
            <h3 className="text-xl md:text-3xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent tracking-tight">
              {title}
            </h3>
            <p className="text-xs md:text-sm lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex gap-1.5 md:gap-3 lg:gap-4">
            <StatBox label="Days" valueRef={timerRefs.days} />
            <StatBox label="Hours" valueRef={timerRefs.hours} />
            <StatBox label="Mins" valueRef={timerRefs.minutes} />
            <StatBox label="Secs" valueRef={timerRefs.seconds} />
          </div>
        </div>

        {/* Removed: two w-96 h-96 blur-2xl + animate-pulse decorative blobs — primary cause of scroll lag */}
      </div>

      {children && (
        <div className="relative z-10 px-2 md:px-4 pb-4 md:pb-8 lg:pb-12">
          {children}
        </div>
      )}
    </section>
  );
};

export default Promotion;
