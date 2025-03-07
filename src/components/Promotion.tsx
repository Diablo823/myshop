"use client";
import React, { useEffect, useState } from 'react';

interface PromotionProps {
  days: number;
  title?: string;
  description?: string;
  className?: string;
}

const Promotion = ({
  days,
  title = "Deals of the Month",
  description = "Get ready for a shopping experience like never before with our Deals of the Month! Every purchase comes with exclusive perks and offers, making this month a celebration of savvy choices and amazing deals. Don't miss out.",
  className = "",
}: PromotionProps) => {
  const [isClient, setIsClient] = useState(false);
  const [time, setTime] = useState({
    days,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    setIsClient(true);

    // Check localStorage only on client-side
    if (typeof window !== 'undefined') {
      const savedTimerData = localStorage.getItem(`promotion-${days}`);
      const savedTargetDate = localStorage.getItem(`promotionTarget-${days}`);

      if (savedTimerData && savedTargetDate) {
        const parsedTime = JSON.parse(savedTimerData);
        setTime(parsedTime);
        setTargetDate(new Date(savedTargetDate));
        return;
      }
    }

    // If no saved data, create initial target date
    const initialTargetDate = new Date();
    initialTargetDate.setDate(initialTargetDate.getDate() + days);
    setTargetDate(initialTargetDate);
  }, [days]);

  useEffect(() => {
    if (!isClient || !targetDate) return;

    const updateTimeRemaining = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        const newTargetDate = new Date();
        newTargetDate.setDate(newTargetDate.getDate() + days);
        setTargetDate(newTargetDate);
        
        const resetTime = {
          days,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
        setTime(resetTime);
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`promotion-${days}`);
          localStorage.removeItem(`promotionTarget-${days}`);
        }
      } else {
        const totalSeconds = Math.floor(difference / 1000);
        const remainingDays = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const newTime = {
          days: remainingDays,
          hours,
          minutes,
          seconds,
        };

        setTime(newTime);

        if (typeof window !== 'undefined') {
          localStorage.setItem(`promotion-${days}`, JSON.stringify(newTime));
          localStorage.setItem(`promotionTarget-${days}`, targetDate.toISOString());
        }
      }
    };

    const timerId = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(timerId);
  }, [isClient, targetDate, days]);

  // Render initial state on server, client state after hydration
  if (!isClient) {
    return (
      <section className={`flex flex-col md:flex-row items-center justify-between gap-8 ${className}`}>
        <div className="flex flex-col justify-center gap-8 w-full md:w-1/2">
          <h3 className="text-2xl md:text-3xl font-normal">{title}</h3>
          <p className="text-sm md:text-lg">{description}</p>
          <div className="flex gap-2">
            <StatBox label="Days" value={days} />
            <StatBox label="Hours" value={0} />
            <StatBox label="Minutes" value={0} />
            <StatBox label="Seconds" value={0} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex flex-col justify-center gap-4 w-full md:w-1/2">
        <h3 className="text-lg md:text-xl font-bold">{title}</h3>
        <p className="text-sm md:text-lg">{description}</p>
        <div className="flex gap-2">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </div>
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: number }) => (
  <div className="border border-gray-300 rounded-lg p-4 text-center min-w-[80px]">
    <h4 className="font-bold text-sm md:text-lg">{value}</h4>
    <p className="text-xs md:text-base">{label}</p>
  </div>
);

export default Promotion;