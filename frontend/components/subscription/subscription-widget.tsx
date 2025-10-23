"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Star, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const subscriptionIcons = {
  Free: Zap,
  Premium: Star,
  Author: Crown,
};

const subscriptionColors = {
  Free: "text-gray-500 dark:text-gray-400",
  Premium: "text-purple-600 dark:text-purple-400",
  Author: "text-amber-600 dark:text-amber-400",
};

const subscriptionBadgeColors = {
  Free: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  Premium:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Author: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export function SubscriptionWidget() {
  const { data: session } = useSession();

  if (!session) return null;

  const subscription = session.user.subscription || "Free";
  const Icon =
    subscriptionIcons[subscription as keyof typeof subscriptionIcons] || Zap;
  const iconColor =
    subscriptionColors[subscription as keyof typeof subscriptionColors];
  const badgeColor =
    subscriptionBadgeColors[
      subscription as keyof typeof subscriptionBadgeColors
    ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Subscription</CardTitle>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        <CardDescription>Current plan and benefits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge className={badgeColor}>{subscription}</Badge>
            {subscription === "Free" && (
              <span className="text-sm text-muted-foreground">
                Limited access
              </span>
            )}
          </div>

          <div className="text-sm text-muted-foreground">
            {subscription === "Free" && (
              <p>
                Upgrade to unlock premium features and unlimited access to all
                books.
              </p>
            )}
            {subscription === "Premium" && (
              <p>Enjoy unlimited access to all books and premium features!</p>
            )}
            {subscription === "Author" && (
              <p>
                Full access to publish and manage your books with advanced
                analytics.
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {subscription === "Free" ? (
          <Button asChild className="w-full">
            <Link href="/dashboard/subscription">
              Upgrade Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard/subscription">Manage Subscription</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
