"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaStar,
  FaShoppingBag,
  FaGem,
} from "react-icons/fa";
import Link from "next/link";
import Confetti from "react-confetti";
import { useRouter, useSearchParams } from "next/navigation";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const controls = useAnimation();
  const [mounted, setMounted] = useState(false);

  // Generate random positions only on client side after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!orderId) return;

    const timer = setTimeout(() => {
      router.push("/orders/" + orderId);
    }, 8000);

    return () => clearTimeout(timer);
  }, [orderId, router]);

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });
      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.4 },
      });
    };
    sequence();
  }, [controls]);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-neutral-900 to-black flex flex-col items-center justify-center p-3 md:p-0 overflow-hidden">
      <Confetti 
        width={2000} 
        height={1000} 
        numberOfPieces={200}
        colors={['#D4AF37', '#FFD700', '#C0C0C0', '#E5E4E2', '#B87333']}
        gravity={0.15}
      />

      {/* Elegant background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-600/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-neutral-600/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-700/5 rounded-full mix-blend-overlay filter blur-3xl"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="relative bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-2xl border border-amber-700/20 rounded-3xl shadow-[0_0_80px_rgba(212,175,55,0.15)] p-4 sm:p-8 mx-4 max-w-2xl w-full text-center z-10"
      >
        {/* Floating gems animation */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {mounted && [...Array(8)].map((_, i) => {
            const randomX = Math.random() * 100;
            const randomDuration = 8 + Math.random() * 4;
            return (
              <motion.div
                key={i}
                className="absolute text-amber-400/20 text-2xl"
                initial={{ y: "100%", x: randomX + "%" }}
                animate={{
                  y: "-100%",
                  x: [
                    randomX + "%",
                    (randomX + 15) % 100 + "%",
                    randomX + "%",
                  ],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: "linear",
                }}
              >
                <FaGem />
              </motion.div>
            );
          })}
        </div>

        {/* Premium Success Icon */}
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 150,
            damping: 15,
          }}
          className="relative mb-4"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full blur-2xl opacity-40 animate-pulse"></div>
          <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-2xl">
            <FaCheckCircle className="text-white text-4xl sm:text-5xl drop-shadow-xl" />
          </div>
        </motion.div>

        {/* Elegant heading */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="text-3xl sm:text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 mb-2 tracking-wide">
            Order Placed
          </h1>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-2"></div>
          <p className="text-base sm:text-lg text-neutral-300 font-light tracking-wide">
            Thank you for your purchase
          </p>
          <p className="text-base sm:text-lg text-neutral-300 font-light tracking-wide">
            Your order is being processed
          </p>
        </motion.div>

        {/* Order number */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-4"
        >
          {/* <p className="text-neutral-400 text-xs uppercase tracking-widest mb-1">Order Number</p>
          <p className="text-amber-300 text-lg sm:text-xl font-light tracking-wider">{orderId}</p> */}
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-neutral-300 text-sm leading-relaxed mb-6 px-2"
        >
          <p className="font-light mb-2">
            Your order has been received and is being carefully prepared.
          </p>
          <p className="text-amber-200/80 text-xs font-light">
            A detailed confirmation has been sent to your email address. <br />(Pleace check your spam folder if you don't see it shortly.)
          </p>
        </motion.div>

        {/* Premium Status Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="bg-gradient-to-br from-neutral-800/40 to-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 border border-amber-700/10 shadow-inner"
        >
          <div className="flex justify-between items-center relative">
            {/* Connection line */}
            <div className="absolute top-6 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-amber-400/30 via-yellow-500/30 to-amber-400/30"></div>
            
            <motion.div
              whileHover={{ scale: 1.08, y: -5 }}
              className="cursor-pointer text-center group z-10 flex-1"
            >
              <div className="relative mb-2 inline-flex">
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-xl group-hover:bg-amber-400/50 transition-all duration-300"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-lg">
                  <FaBox className="text-white text-lg" />
                </div>
              </div>
              <p className="text-amber-200 font-light text-xs tracking-wide">Preparing</p>
              <p className="text-neutral-400 text-[10px] mt-0.5">Preparing with care</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, y: -5 }}
              className="cursor-pointer text-center group z-10 flex-1"
            >
              <div className="relative mb-2 inline-flex">
                <div className="absolute inset-0 bg-neutral-400/20 rounded-full blur-xl group-hover:bg-neutral-400/40 transition-all duration-300"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center shadow-lg border border-neutral-600/50">
                  <FaTruck className="text-neutral-300 text-lg" />
                </div>
              </div>
              <p className="text-neutral-300 font-light text-xs tracking-wide">Shipping</p>
              <p className="text-neutral-400 text-[10px] mt-0.5">Express delivery</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, y: -5 }}
              className="cursor-pointer text-center group z-10 flex-1"
            >
              <div className="relative mb-2 inline-flex">
                <div className="absolute inset-0 bg-neutral-400/20 rounded-full blur-xl group-hover:bg-neutral-400/40 transition-all duration-300"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center shadow-lg border border-neutral-600/50">
                  <FaStar className="text-neutral-300 text-lg" />
                </div>
              </div>
              <p className="text-neutral-300 font-light text-xs tracking-wide">Delivered</p>
              <p className="text-neutral-400 text-[10px] mt-0.5">At your doorstep</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Premium Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={`/orders/${orderId}`}
              className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-500 hover:via-yellow-500 hover:to-amber-500 text-black font-light py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] overflow-hidden text-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <FaStar className="text-amber-900 relative z-10 text-sm" />
              <span className="relative z-10 tracking-wide">View Order Details</span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="group relative inline-flex items-center justify-center gap-2 bg-transparent hover:bg-neutral-800/50 text-neutral-200 font-light py-3 px-8 rounded-full transition-all duration-300 border border-amber-700/30 hover:border-amber-600/50 text-sm"
            >
              <FaShoppingBag className="text-amber-400 text-sm" />
              <span className="tracking-wide">Continue Shopping</span>
            </Link>
          </motion.div>
        </div>

        {/* Bottom elegant accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1.2, ease: "easeInOut" }}
          className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mt-4 mx-auto"
        ></motion.div>
      </motion.div>

      {/* Elegant bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="text-neutral-500 text-xs tracking-widest uppercase mt-6 font-light"
      >
        Exceptional Quality • Premium Experience
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="text-neutral-500 text-xs tracking-widest uppercase mt-4 font-light"
      >
        US CARTEL
      </motion.p>
    </div>
  );
};

export default ThankYouPage;