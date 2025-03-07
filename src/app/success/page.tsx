"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { FaCheckCircle, FaBox, FaTruck } from "react-icons/fa";
import Link from "next/link";
import Confetti from "react-confetti";
import { useRouter, useSearchParams } from "next/navigation";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const controls = useAnimation();

  // const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // useEffect(() => {
  //   // Set dimensions after component mounts (client-side only)
  //   setDimensions({
  //     width: window.innerWidth,
  //     height: window.innerHeight
  //   });
  // }, []);

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
    <div className="fixed inset-0 w-full h-full bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4 md:p-0 overflow-hidden">
      
        <Confetti 
          width={2000}
          height={1000}
          numberOfPieces={350}
        />
      

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl p-4 sm:p-8 mx-4 max-w-md w-full text-center z-10"
      >
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
          <FaCheckCircle className="text-amber-500 text-5xl sm:text-6xl mx-auto mb-4 sm:mb-6" />
        </motion.div>

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

        <div className="flex justify-around mb-6 sm:mb-8">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="cursor-pointer"
          >
            <FaBox className="text-amber-400 text-3xl sm:text-4xl" />
            <p className="text-xs sm:text-sm mt-2">Packing</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: -10 }}
            className="cursor-pointer"
          >
            <FaTruck className="text-amber-400 text-3xl sm:text-4xl" />
            <p className="text-xs sm:text-sm mt-2">Shipping</p>
          </motion.div>
        </div>

        <div className="flex justify-between">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href={`/orders/${orderId}`}
              className="inline-block bg-amber-500 text-white font-bold py-2 px-4 rounded-xl transition duration-300 text-sm"
            >
              See Order
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
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