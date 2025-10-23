"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function SubscriptionBanner() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);

  // Don't show banner if user is Premium or Author, or if dismissed
  if (
    !session ||
    dismissed ||
    session.user.subscription === "Premium" ||
    session.user.subscription === "Author"
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-900 dark:to-pink-900",
        "border-b border-purple-700 dark:border-purple-800"
      )}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="text-white">
              <p className="font-semibold text-sm sm:text-base">
                Unlock Premium Features
              </p>
              <p className="text-xs sm:text-sm text-white/90">
                Get unlimited access to all books and exclusive features
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
            >
              <Link href="/dashboard/subscription">
                <Crown className="h-4 w-4 mr-1" />
                Upgrade Now
              </Link>
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
