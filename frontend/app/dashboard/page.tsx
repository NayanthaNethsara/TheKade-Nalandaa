"use client";

import { BookGrid } from "@/components/book-grid";
import { AddBookModal } from "@/components/model/add-book-model";
import { Library } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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

  const userId = session.user.sub;
  const userRole = session.user.role;
  const userName = session.user.name;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/20">
              <Library className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                My Library
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">
                Your personal reading collection
              </p>
            </div>
            {userRole === "Author" && (
              <AddBookModal authorId={userId} authorName={userName} />
            )}
          </div>
        </div>

        <BookGrid />
      </div>
    </div>
  );
}
