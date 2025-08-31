"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const frontendRedirectUri = "http://localhost:3000/auth/login";
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // must match backend/client secret

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("[Next.js] Code received:", code);
      setLoading(true);

      fetch("http://localhost:5218/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // required if backend uses cookies
        body: JSON.stringify({ code, redirectUri: frontendRedirectUri }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            console.error("[Next.js] Error response:", data);
            throw new Error(data.error || "Login failed");
          }
          return data;
        })
        .then((data) => {
          console.log("[Next.js] JWT received:", data.token);
          localStorage.setItem("jwt", data.token);
          alert(`Logged in as ${data.user?.name || "user"}`);
          router.push("/");
        })
        .catch((err) => {
          console.error("[Next.js] Login failed:", err);
          alert("Login failed, check console for details");
        })
        .finally(() => setLoading(false));
    }
  }, [searchParams, router]);

  const handleLogin = () => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      frontendRedirectUri
    )}&response_type=code&scope=openid email profile&access_type=offline&prompt=consent`;
    console.log("[Next.js] Redirecting to Google:", url);
    window.location.href = url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Login with Google</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Logging in..." : "Sign in with Google"}
      </button>
    </div>
  );
}
