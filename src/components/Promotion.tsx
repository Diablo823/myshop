"use client";
import React, { useEffect, useState } from 'react';

interface PromotionProps {
  days: number;
  startDate: string; // ISO date string format: 'YYYY-MM-DDTHH:mm:ssZ'
  title?: string;
  description?: string;
  className?: string;
}

// Function to calculate a shared target date that's the same for all visitors
const getSharedTargetDate = (startDate: string, days: number): Date => {
  const START_DATE = new Date(startDate);

  // Calculate the end date by adding the specified days
  const targetDate = new Date(START_DATE.getTime() + (days * 24 * 60 * 60 * 1000));
  return targetDate;
};

const Promotion = ({
  days,
  startDate,
  title = "Deals of the Month",
  description = "Get ready for a shopping experience like never before with our Deals of the Month! Every purchase comes with exclusive perks and offers, making this month a celebration of savvy choices and amazing deals. Don't miss out.",
  className = "",
}: PromotionProps) => {
  const [isClient, setIsClient] = useState(false);
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateTimeRemaining = () => {
      const targetDate = getSharedTargetDate(startDate, days);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        // Countdown has ended
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const totalSeconds = Math.floor(difference / 1000);
        const remainingDays = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setTime({
          days: remainingDays,
          hours,
          minutes,
          seconds,
        });
      }
    };

    // Initial update
    updateTimeRemaining();

    // Update every second
    const timerId = setInterval(updateTimeRemaining, 1000);
    return () => clearInterval(timerId);
  }, [isClient, days, startDate]);

  // Render initial state on server
  if (!isClient) {
    return (
      <section className={`flex flex-col md:flex-row items-center justify-between gap-8 ${className}`}>
        <div className="flex flex-col justify-center gap-8 w-full md:w-1/2">
          <h3 className="text-2xl md:text-3xl font-normal">{title}</h3>
          <p className="text-sm md:text-lg">{description}</p>
          <div className="flex gap-2">
            <StatBox label="Days" value={0} />
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