"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, Check } from "lucide-react";
import { SubscriptionPlan } from "@/types/subscription";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onSuccess: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    discountCode: "",
  });
  const [discountApplied, setDiscountApplied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substring(0, 5);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyDiscount = () => {
    if (formData.discountCode.toLowerCase() === "test-discount") {
      setDiscountApplied(true);
      toast.success("Discount code applied! 100% off");
    } else {
      setDiscountApplied(false);
      toast.error("Invalid discount code");
    }
  };

  const calculateTotal = () => {
    if (discountApplied) return 0;
    return plan.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (
      !formData.cardNumber ||
      !formData.cardName ||
      !formData.expiryDate ||
      !formData.cvv
    ) {
      toast.error("Please fill in all payment details");
      setLoading(false);
      return;
    }

    // Check if discount code is required for free payment
    if (!discountApplied && plan.price > 0) {
      toast.error("Please use discount code 'test-discount' for testing");
      setLoading(false);
      return;
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(`Successfully upgraded to ${plan.name}!`);
    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Subscribe to {plan.name} - ${plan.price}/{plan.period}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Summary */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{plan.name} Plan</span>
              <span
                className={
                  discountApplied
                    ? "line-through text-muted-foreground"
                    : "font-bold"
                }
              >
                ${plan.price}
              </span>
            </div>
            {discountApplied && (
              <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                <span className="text-sm flex items-center gap-1">
                  <Check className="h-4 w-4" /> Discount Applied
                </span>
                <span className="font-bold">${calculateTotal()}</span>
              </div>
            )}
          </div>

          {/* Discount Code */}
          <div className="space-y-2">
            <Label htmlFor="discountCode">
              Discount Code (Use: test-discount)
            </Label>
            <div className="flex gap-2">
              <Input
                id="discountCode"
                name="discountCode"
                placeholder="Enter discount code"
                value={formData.discountCode}
                onChange={handleInputChange}
              />
              <Button type="button" variant="outline" onClick={applyDiscount}>
                Apply
              </Button>
            </div>
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">
              <CreditCard className="inline h-4 w-4 mr-1" />
              Card Number
            </Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="John Doe"
              value={formData.cardName}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                maxLength={5}
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                placeholder="123"
                maxLength={4}
                value={formData.cvv}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Processing..." : `Pay $${calculateTotal()}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
