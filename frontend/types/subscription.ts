export type SubscriptionStatus = "Free" | "Premium" | "Author";

export interface SubscriptionPlan {
  id: SubscriptionStatus;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
}

export interface ChangeSubscriptionRequest {
  userId: number;
  subscription: SubscriptionStatus;
}

export interface PaymentDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  discountCode?: string;
}
