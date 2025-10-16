"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  AlertCircle,
  HelpCircle,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4">
      <motion.div
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/30 border border-slate-200/50 dark:border-slate-700/50"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        {/* Left Panel - Login Form */}
        <motion.div
          className="backdrop-blur-sm bg-white/95 dark:bg-slate-900/95 p-8 md:p-12 flex flex-col justify-center relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-indigo-950/20 pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-500 bg-clip-text text-transparent">
                NoPolin HUB
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mt-2" />
            </motion.div>

            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Your centralized solution to reduce queues and optimize
                transport across Sri Lanka.
              </p>
            </motion.div>

            {/* Error message display */}
            {error && (
              <motion.div
                className="mb-6 p-4 backdrop-blur-sm bg-red-50/90 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/50 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 shadow-lg shadow-red-100/20 dark:shadow-red-950/20"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{error}</p>
                  <p className="text-xs mt-1 opacity-80">
                    Please check your credentials and try again.
                  </p>
                </div>
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, staggerChildren: 0.1 }}
            >
              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Label
                  htmlFor="username"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Username
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your email"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`pl-12 h-14 backdrop-blur-sm bg-white dark:bg-slate-800 border-2 ${
                      error && !username.trim()
                        ? "border-red-300 dark:border-red-700 focus-visible:ring-red-500/20"
                        : "border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    } text-slate-900 dark:text-slate-100 rounded-xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-sm transition-all duration-200 hover:shadow-md`}
                    aria-invalid={error && !username.trim() ? "true" : "false"}
                  />
                </div>
              </motion.div>

              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`pl-12 pr-12 h-14 backdrop-blur-sm bg-white dark:bg-slate-800 border-2 ${
                      error && !password
                        ? "border-red-300 dark:border-red-700 focus-visible:ring-red-500/20"
                        : "border-slate-200 dark:border-slate-700 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"
                    } text-slate-900 dark:text-slate-100 rounded-xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-sm transition-all duration-200 hover:shadow-md`}
                    aria-invalid={error && !password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center justify-between"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500/20 focus:ring-4 border-slate-300 dark:border-slate-600 rounded transition-all"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-slate-600 dark:text-slate-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="/forget-password"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 backdrop-blur-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-blue-900/40 transition-all duration-300 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-3"></div>
                      Logging in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Login
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.div
              className="mt-10 pt-8 border-t border-slate-200/50 dark:border-slate-700/50"
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
          </div>
        </motion.div>

        {/* Right Panel - Background Image */}
        <motion.div
          className="relative hidden lg:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-700/40 backdrop-blur-[2px] z-10"></div>

          {/* Background image */}
          <Image
            src="/login/sri-lanka.png"
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
                Smarter Transport, Fewer Queues
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
                    Centralized Control
                  </span>
                </div>
              </motion.div>

              <p className="text-white text-base drop-shadow-lg leading-relaxed max-w-md">
                Track vehicles, manage lines, and improve efficiency across Sri
                Lanka — all in one unified platform.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
