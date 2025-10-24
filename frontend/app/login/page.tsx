"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import AuthRightPanel from "@/components/auth/auth-right-panel";
import AuthFooter from "@/components/auth/auth-footer";
import AuthHeader from "@/components/auth/auth-header";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsGoogleLoading(true);

    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Google sign-in failed. Please try again.");
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch {
      setError("An error occurred during Google sign-in.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 p-4">
      <motion.div
        className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-2xl shadow-gray-200/50 dark:shadow-gray-950/50 border border-white/20 dark:border-gray-700/30"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        {/* Left Panel - Login Form */}
        <motion.div
          className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-8 md:p-12 flex flex-col justify-center relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-gray-50/20 dark:from-transparent dark:via-gray-800/5 dark:to-gray-950/20 pointer-events-none" />

          <div className="relative z-10">
            <AuthHeader />

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
                  <p className="text-xs mt-1 opacity-80">
                    Please check your credentials and try again.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Google sign-in button */}
            <motion.div
              className="mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full h-14 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 rounded-2xl shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-300 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {isGoogleLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-gray-600 rounded-full animate-spin mr-3"></div>
                    Signing in with Google...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div
              className="relative mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/50 dark:border-gray-700/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400 font-medium">
                  Or continue with credentials
                </span>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, staggerChildren: 0.1 }}
            >
              <motion.div
                className="space-y-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Email
                </Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your Email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`pl-12 h-14 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 ${
                      error && !email.trim()
                        ? "border-red-300 dark:border-red-700 focus-visible:ring-red-500/20"
                        : "border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-gray-500/20 focus-visible:border-gray-400"
                    } text-gray-900 dark:text-gray-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-gray-950/30`}
                    aria-invalid={error && !email.trim() ? "true" : "false"}
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
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    className={`pl-12 pr-12 h-14 backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 ${
                      error && !password
                        ? "border-red-300 dark:border-red-700 focus-visible:ring-red-500/20"
                        : "border-gray-200/50 dark:border-gray-700/50 focus-visible:ring-gray-500/20 focus-visible:border-gray-400"
                    } text-gray-900 dark:text-gray-100 rounded-2xl focus-visible:ring-4 focus-visible:ring-offset-0 shadow-lg shadow-gray-200/20 dark:shadow-gray-950/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-gray-950/30`}
                    aria-invalid={error && !password ? "true" : "false"}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    data-testid="toggle-password"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500/20 focus:ring-4 border-gray-300 dark:border-gray-600 rounded transition-all"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-600 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="/forget-password"
                    className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <motion.button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full h-14 backdrop-blur-sm bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 dark:from-gray-700 dark:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 text-white rounded-2xl shadow-xl shadow-gray-900/20 dark:shadow-gray-950/40 transition-all duration-300 font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600/20"
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
                    <div className="flex items-center justify-center text-white">
                      Login
                    </div>
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
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  Sign up here
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
