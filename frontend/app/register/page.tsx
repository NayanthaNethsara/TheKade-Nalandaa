"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  CreditCard,
  AlertCircle,
  BookOpen,
  PenTool,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import AuthRightPanel from "@/components/auth/auth-right-panel";
import AuthFooter from "@/components/auth/auth-footer";

export default function Register() {
  const [isAuthor, setIsAuthor] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    nic: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (isAuthor && !formData.nic.trim()) {
      setError("NIC is required for authors");
      return;
    }
    if (isAuthor && !formData.phone.trim()) {
      setError("Phone number is required for authors");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = "/api/auth/register";
      const payload = isAuthor
        ? {
            email: formData.email,
            name: formData.name,
            password: formData.password,
            nic: formData.nic,
            phone: formData.phone,
            role: "AUTHOR",
          }
        : {
            email: formData.email,
            name: formData.name,
            password: formData.password,
            role: "READER",
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/login?message=Registration successful");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4">
      <motion.div
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/50 border border-white/20 dark:border-gray-700/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        {/* Left Panel - Registration Form */}
        <motion.div
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-8 md:p-12 flex flex-col justify-center relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-gray-50/20 dark:from-transparent dark:via-gray-800/5 dark:to-gray-950/20 pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                BookVerse
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
                Join our online e-book platform to discover, read, and share
                amazing stories from around the world.
              </p>
            </motion.div>

            {/* User Type Toggle */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center p-1 backdrop-blur-sm bg-gray-100/80 dark:bg-gray-800/80 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setIsAuthor(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    !isAuthor
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  Reader
                </button>
                <button
                  type="button"
                  onClick={() => setIsAuthor(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isAuthor
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-lg"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  <PenTool className="h-4 w-4" />
                  Author
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                {isAuthor
                  ? "Create and publish your own e-books"
                  : "Access thousands of e-books"}
              </p>
            </motion.div>

            {/* Error message display */}
            {error && (
              <motion.div
                className="mb-6 p-4 backdrop-blur-sm bg-red-50/80 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/30 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-300 shadow-lg shadow-red-100/20 dark:shadow-red-950/20"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, staggerChildren: 0.1 }}
            >
              {/* Email Field */}
              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-12 h-14 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-gray-500/20 focus-visible:border-gray-400 text-gray-900 dark:text-gray-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-gray-950/30"
                  />
                </div>
              </motion.div>

              {/* Name Field */}
              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Full Name
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-12 h-14 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-gray-500/20 focus-visible:border-gray-400 text-gray-900 dark:text-gray-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-gray-950/30"
                  />
                </div>
              </motion.div>

              {/* Author-specific fields */}
              {isAuthor && (
                <>
                  <motion.div
                    className="space-y-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <Label
                      htmlFor="nic"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      National ID (NIC)
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <Input
                        id="nic"
                        name="nic"
                        type="text"
                        placeholder="Enter your NIC number"
                        required={isAuthor}
                        value={formData.nic}
                        onChange={handleInputChange}
                        className="pl-12 h-14 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-gray-500/20 focus-visible:border-gray-400 text-gray-900 dark:text-gray-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-gray-950/30"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <Label
                      htmlFor="phone"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                      Phone Number
                    </Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors">
                        <Phone className="h-5 w-5" />
                      </div>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        required={isAuthor}
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-12 h-14 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-gray-500/20 focus-visible:border-gray-400 text-gray-900 dark:text-gray-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-gray-950/30"
                      />
                    </div>
                  </motion.div>
                </>
              )}

              {/* Password Field */}
              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-14 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-gray-500/20 focus-visible:border-gray-400 text-gray-900 dark:text-gray-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-gray-950/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Confirm Password
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-12 pr-12 h-14 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-gray-500/20 focus-visible:border-gray-400 text-gray-900 dark:text-gray-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-gray-950/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-2xl shadow-xl shadow-gray-900/20 dark:shadow-gray-950/40 transition-all duration-300 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600/20"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center text-white">
                      <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-3"></div>
                      <span className="text-white">Creating Account...</span>
                    </div>
                  ) : (
                    <span className="text-white font-semibold">
                      Create {isAuthor ? "Author" : "Reader"} Account
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
            >
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </motion.div>

            <AuthFooter />
          </div>
        </motion.div>
        <AuthRightPanel />
      </motion.div>
    </div>
  );
}
