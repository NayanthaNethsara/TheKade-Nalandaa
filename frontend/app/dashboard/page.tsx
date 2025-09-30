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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Library className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                My Library
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
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
