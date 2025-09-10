import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AuthRightPanel() {
  return (
    <>
      <motion.div
        className="relative hidden lg:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-700/40 backdrop-blur-[1px] z-10"></div>

        {/* Background image */}
        <Image
          src="/login/girl-reading-book.jpg"
          alt="Login background"
          fill
          className="object-cover object-center z-0"
          priority
        />

        {/* Foreground content */}
        <div className="absolute inset-0 flex flex-col justify-between z-20 p-12">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white drop-shadow-2xl">
              A Universe of Books, One Click Away
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.div
              className="flex"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
            >
              <div className="inline-flex items-center px-8 py-3 rounded-full backdrop-blur-md bg-white/20 text-white border border-white/30 shadow-xl shadow-gray-900/20">
                <span className="text-sm font-semibold">
                  Your Personal Library
                </span>
              </div>
            </motion.div>

            <p className="text-white text-base drop-shadow-lg leading-relaxed max-w-md">
              Discover, read, and enjoy thousands of e-books anytime, anywhere —
              your personal library in the cloud.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
