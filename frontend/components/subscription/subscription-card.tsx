"use client";

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
import { Check, Star, Zap, Crown } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  currentPlan?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

const planIcons = {
  Free: Zap,
  Premium: Star,
  Author: Crown,
};

export function SubscriptionCard({
  plan,
  currentPlan,
  onSelectPlan,
}: SubscriptionCardProps) {
  const isCurrent = currentPlan === plan.id;
  const Icon = planIcons[plan.id];

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all hover:shadow-lg",
        plan.recommended && "border-primary shadow-md",
        isCurrent && "bg-muted/50"
      )}
    >
      {plan.recommended && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-lg">Recommended</Badge>
        </div>
      )}

      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-6 w-6", plan.recommended && "text-primary")} />
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
        </div>
        <CardDescription>
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/{plan.period}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {isCurrent ? (
          <Button variant="outline" className="w-full" disabled>
            Current Plan
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={plan.recommended ? "default" : "outline"}
            onClick={() => onSelectPlan(plan)}
          >
            {plan.price === 0 ? "Downgrade" : "Upgrade"} to {plan.name}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
