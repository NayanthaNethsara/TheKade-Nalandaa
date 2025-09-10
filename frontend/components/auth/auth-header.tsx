import React from "react";
import { motion } from "framer-motion";

export default function AuthHeader() {
  return (
    <>
      {" "}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-black bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          Nalandaa - TheKade
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full mt-2" />
      </motion.div>
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
          Access your favorite books anytime, anywhere. Discover, read, and
          enjoy a world of stories in one place.
        </p>
      </motion.div>
    </>
  );
}
