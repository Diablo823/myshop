"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { gsap } from "gsap";
import { FaCheckCircle, FaBox, FaTruck } from "react-icons/fa";
import Link from "next/link";
//import { useParticleAnimation } from '@/hooks/useParticleAnimation'
import Confetti from "react-confetti";
import { useRouter, useSearchParams } from "next/navigation";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) return;

    const timer = setTimeout(() => {
      router.push("/orders/" + orderId);
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
  }, [orderId, router]);

  const confettiRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  //const particlesRef = useParticleAnimation(50)

  const createConfetti = () => {
    return [...Array(100)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 8 + 6,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      isCircle: Math.random() > 0.5,
      rotation: Math.random() * 360,
    }));
  };

  const [confetti, setConfetti] = React.useState(createConfetti());

  const triggerConfetti = () => {
    if (confettiRef.current) {
      const viewport = {
        height: window.innerHeight,
        width: window.innerWidth,
      };

      // Reset all confetti to the top
      gsap.set(confettiRef.current.children, {
        y: -50,
        opacity: 1,
        scale: 1,
      });

      // Animate them falling
      gsap.to(confettiRef.current.children, {
        y: viewport.height + 100,
        rotation: "random(-360, 360)",
        x: "random(-100, 100)",
        duration: "random(2, 4)",
        ease: "power2.out",
        stagger: {
          amount: 1,
          from: "random",
        },
        onComplete: function () {
          // Generate new confetti positions
          setConfetti(createConfetti());
        },
      });
    }
  };

  useEffect(() => {
    // Initial animation sequence
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
      await controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3 },
      });
    };
    sequence();

    // Trigger initial confetti
    triggerConfetti();

    // Set up interval for repeated confetti
    const confettiInterval = setInterval(triggerConfetti, 3000);

    return () => {
      clearInterval(confettiInterval);
      if (confettiRef.current) {
        gsap.killTweensOf(confettiRef.current.children);
      }
    };
  }, [controls, triggerConfetti]);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4 md:p-0 overflow-hidden">
      <Confetti width={2000} height={1000} />
      {/* Particles Animation */}
      {/* <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              background: `hsl(${Math.random() * 60 + 200}, 100%, 75%)`,
            }}
          />
        ))}
      </div> */}

      {/* Confetti */}
      <div ref={confettiRef} className="absolute inset-0 pointer-events-none">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="absolute"
            style={{
              left: piece.left,
              width: `${piece.size}px`,
              height: `${piece.size}px`,
              background: piece.color,
              borderRadius: piece.isCircle ? "50%" : "0",
              transform: `rotate(${piece.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-4 sm:p-8 mx-4 max-w-md w-full text-center z-10"
      >
        {/* Animated Check Icon */}
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          <FaCheckCircle className="text-amber-500 text-5xl sm:text-6xl mx-auto mb-4 sm:mb-6 cursor-pointer" />
        </motion.div>

        {/* Heading and Description */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-lg sm:text-xl font-bold mb-3 sm:mb-4"
        >
          Order Placed!
        </motion.h1>
        <motion.p
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-gray-600 text-sm font-semibold mb-4 sm:mb-6 px-2"
        >
          Your order has been placed and is being processed. You'll receive a
          confirmation email shortly.
        </motion.p>

        {/* Progress Icons */}
        <div className="flex justify-around mb-6 sm:mb-8">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 1.5 }}
            className="cursor-pointer"
          >
            <FaBox className="text-amber-400 text-3xl sm:text-4xl" />
            <p className="text-xs sm:text-sm mt-2">Packing</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: -10 }}
            whileTap={{ scale: 1.5 }}
            className="cursor-pointer"
          >
            <FaTruck className="text-amber-400 text-3xl sm:text-4xl" />
            <p className="text-xs sm:text-sm mt-2">Shipping</p>
          </motion.div>
        </div>

        {/* Continue Shopping Button */}
        <div className="flex justify-between">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/orders/${orderId}`}
              className="inline-block bg-amber-500 text-white font-bold py-2 px-4 rounded-xl transition duration-300 text-sm"
            >
              See Order
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-block bg-amber-500 text-white font-bold py-2 px-4 rounded-xl transition duration-300 text-sm"
            >
              Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
