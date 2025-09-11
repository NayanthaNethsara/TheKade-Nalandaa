"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CitizenDashboard from "@/components/citizen-dashboard";
import AdminDashboard from "@/components/admin-dashboard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent border-gray-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return session.user.role === "Admin" ? (
    <AdminDashboard />
  ) : (
    <CitizenDashboard />
  );
}
