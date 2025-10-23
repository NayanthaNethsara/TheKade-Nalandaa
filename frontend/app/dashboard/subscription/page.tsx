"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SubscriptionCard } from "@/components/subscription/subscription-card";
import { PaymentModal } from "@/components/subscription/payment-modal";
import { SubscriptionPlan, SubscriptionStatus } from "@/types/subscription";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "Free",
    name: "Free",
    price: 0,
    period: "month",
    features: [
      "Access to free books",
      "Basic reading features",
      "Limited bookmarks",
      "Community access",
    ],
  },
  {
    id: "Premium",
    name: "Premium",
    price: 9.99,
    period: "month",
    features: [
      "Access to all books",
      "Unlimited bookmarks",
      "Advanced reading features",
      "Priority support",
      "Ad-free experience",
      "Download for offline reading",
    ],
    recommended: true,
  },
  {
    id: "Author",
    name: "Author",
    price: 19.99,
    period: "month",
    features: [
      "All Premium features",
      "Publish your own books",
      "Author dashboard",
      "Analytics & insights",
      "Revenue sharing",
      "Dedicated support",
    ],
  },
];

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentSubscription, setCurrentSubscription] =
    useState<SubscriptionStatus>("Free");
  const [loading, setLoading] = useState(false);

  // Fetch current subscription from API
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!session?.user?.sub) return;

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "http://localhost:5218"
          }/api/users/readers/${session.user.sub}`
        );

        if (response.ok) {
          const userData = await response.json();
          // Map subscription number to status string
          const subscriptionMap: Record<number, SubscriptionStatus> = {
            0: "Free",
            1: "Premium",
            2: "Author",
          };
          setCurrentSubscription(subscriptionMap[userData.subscription] || "Free");
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    fetchSubscription();
  }, [session?.user?.sub]);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    if (plan.price === 0) {
      // Downgrade to free - no payment needed
      handleSubscriptionChange(plan.id);
    } else {
      // Open payment modal for paid plans
      setIsPaymentModalOpen(true);
    }
  };

  const handleSubscriptionChange = async (
    newSubscription: SubscriptionStatus
  ) => {
    if (!session?.user?.sub) {
      toast.error("Please login to change subscription");
      return;
    }

    setLoading(true);

    try {
      // Map subscription status to enum number
      const subscriptionMap: Record<SubscriptionStatus, number> = {
        Free: 0,
        Premium: 1,
        Author: 2,
      };

      // Backend expects PascalCase property names
      const requestBody = {
        UserId: session.user.sub,
        Subscription: subscriptionMap[newSubscription],
      };

      console.log("Sending subscription update:", requestBody);
      console.log(
        "URL:",
        `${
          process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "http://localhost:5218"
        }/api/users/readers/${session.user.sub}/subscription`
      );

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization header if accessToken exists
      if (session.user.accessToken) {
        headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "http://localhost:5218"
        }/api/users/readers/${session.user.sub}/subscription`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(requestBody),
        }
      );

      const responseData = await response.json();
      console.log("Response:", responseData);

      if (!response.ok) {
        const errorMessage =
          responseData.error ||
          responseData.message ||
          "Failed to update subscription";
        throw new Error(errorMessage);
      }

      toast.success(`Successfully changed to ${newSubscription} plan!`);
      
      // Refetch subscription from API to update UI
      const getUserResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "http://localhost:5218"
        }/api/users/readers/${session.user.sub}`
      );

      if (getUserResponse.ok) {
        const userData = await getUserResponse.json();
        const subscriptionMap: Record<number, SubscriptionStatus> = {
          0: "Free",
          1: "Premium",
          2: "Author",
        };
        setCurrentSubscription(subscriptionMap[userData.subscription] || "Free");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update subscription. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      handleSubscriptionChange(selectedPlan.id);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">
            Please login to manage your subscription
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground">
            Select the perfect plan for your reading journey
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Current plan:{" "}
            <span className="font-semibold">{currentSubscription}</span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Updating subscription...</span>
          </div>
        )}

        {/* Subscription Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              currentPlan={currentSubscription}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards. Use discount code
                &quot;test-discount&quot; for testing.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Is there a refund policy?</h3>
              <p className="text-sm text-muted-foreground">
                We offer a 30-day money-back guarantee for all paid plans. No
                questions asked.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
