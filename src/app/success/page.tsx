"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  FaCheckCircle,
  FaBox,
  FaTruck,
  FaStar,
  FaHeart,
  FaShoppingBag,
} from "react-icons/fa";
import Link from "next/link";
import Confetti from "react-confetti";
import { useRouter, useSearchParams } from "next/navigation";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const controls = useAnimation();

  useEffect(() => {
    if (!orderId) return;

    const timer = setTimeout(() => {
      router.push("/orders/" + orderId);
    }, 8000);

    return () => clearTimeout(timer);
  }, [orderId, router]);

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0, transition: { duration: 0.5 } });
      await controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3 },
      });
    };
    sequence();
  }, [controls]);

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-3 md:p-0 overflow-hidden">
      <Confetti width={2000} height={1000} numberOfPieces={350} />

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-2 sm:p-12 mx-4 max-w-lg w-full text-center z-10"
      >
        {/* Floating hearts animation */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-300/30 text-xl"
              initial={{ y: "100%", x: Math.random() * 100 + "%" }}
              animate={{
                y: "-100%",
                x: [
                  Math.random() * 100 + "%",
                  Math.random() * 100 + "%",
                  Math.random() * 100 + "%",
                ],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.8,
                ease: "linear",
              }}
            >
              <FaHeart />
            </motion.div>
          ))}
        </div>

        {/* Success Icon with glow effect */}
        <motion.div
          initial={{ scale: 0, rotate: 45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <FaCheckCircle className="relative text-green-400 text-7xl sm:text-8xl mx-auto drop-shadow-2xl" />
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Order Placed!
          </h1>
          <p className="text-lg text-purple-200 font-semibold">
            Your Order is Confirmed!
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-white/70 texxt-base leading-relaxed mb-8 px-2"
        >
          <span className="font-semibold">We're preparing your order with extra care!</span>
          <br />
          <span className="text-purple-300 font-medium">
            A confirmation email is on its way to you.
          </span>
        </motion.p>

        {/* Status indicators */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="flex justify-around items-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="cursor-pointer text-center group"
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-amber-400 rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <FaBox className="relative text-amber-400 text-4xl sm:text-5xl drop-shadow-lg" />
              </div>
              <p className="text-white font-medium text-sm">Preparing</p>
              <p className="text-purple-300 text-xs">Getting Ready</p>
            </motion.div>

            <div className="flex-1 mx-4">
              <div className="h-0.5 bg-gradient-to-r from-amber-400 to-blue-400 rounded-full"></div>
            </div>

            <motion.div
              whileHover={{ scale: 1.1, rotate: -10 }}
              className="cursor-pointer text-center group"
            >
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity"></div>
                <FaTruck className="relative text-blue-400 text-4xl sm:text-5xl drop-shadow-lg" />
              </div>
              <p className="text-white font-medium text-sm">Shipping</p>
              <p className="text-purple-300 text-xs">On The Way</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/orders/${orderId}`}
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                <FaStar className="text-yellow-300" />
                See Order
              </span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-2">
                <FaShoppingBag size={16} className="text-yellow-300" />
                Continue Shopping
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1.5, duration: 1 }}
          className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full mt-8 mx-auto"
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
