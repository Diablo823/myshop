"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export default function Custom404(){
  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-yellow-500 to-red-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 leading-none">
            404
          </h1>
        </motion.div>

        {/* Animated Content */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200">
              Oops! Page Not Found
            </h2>
            <p className="text-sm sm:text-lg text-slate-700 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              The page or product which you're looking for doesn't exist. It might have been removed, renamed, or is temporarily unavailable. Go back to the homepage or try searching for what you need.
            </p>
          </div>

          {/* Animated Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="flex flex-row gap-4 justify-center items-center pt-4"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-gray-800 hover:from-gray-800 hover:to-yellow-600 duration-200 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all w-fit sm:w-auto"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-900 via-gray-600 to-gray-900 hover:from-gray-900 hover:via-gray-600 hover:to-blue-900  dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-100 dark:text-slate-200 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 w-fit sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-600 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-1/3 right-1/4 w-3 h-3 bg-gray-700 rounded-full"
          />
          <motion.div
            animate={{
              y: [0, -25, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-black rounded-full opacity-80"
          />
        </div>
      </div>
    </div>
  )
}