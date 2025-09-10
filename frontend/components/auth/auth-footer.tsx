import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, Mail, Phone } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthFooter() {
  return (
    <motion.div
      className="mt-10 pt-8 border-t border-gray-200/30 dark:border-gray-700/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3 backdrop-blur-sm bg-white/40 dark:bg-gray-800/40 px-4 py-2 rounded-full border border-white/20 dark:border-gray-700/20 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
        >
          <ThemeToggle />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Theme
          </span>
        </motion.div>

        <motion.div
          className="flex items-center space-x-6"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
        >
          <a
            href="/help"
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors group"
          >
            <HelpCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Help</span>
          </a>
          <a
            href="tel:+94112345678"
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors group"
          >
            <Phone className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Support</span>
          </a>
          <a
            href="mailto:support@nopolin.lk"
            className="flex items-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors group"
          >
            <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Contact</span>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
