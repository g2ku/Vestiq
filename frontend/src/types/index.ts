export interface User {
  id: string;
  email: string;
  phone?: string;
  fullName?: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  priceMonthly: number;
  maxItems: number;
  rentalDays: number;
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAUSED';
  autoRenew: boolean;
  plan: SubscriptionPlan;
}

export interface Clothing {
  id: string;
  name: string;
  description?: string;
  komplekt?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  size: string;
  color?: string;
  imageUrl?: string;
  condition: 'NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR';
  dailyPrice: number;
  deposit: number;
  quantity: number;
  isAvailable: boolean;
}

export interface RentalOrder {
  id: string;
  userId: string;
  subscriptionId?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'ACTIVE' | 'RETURNED' | 'CANCELLED' | 'OVERDUE';
  items: RentalItem[];
  payment?: Payment;
}

export interface RentalItem {
  id: string;
  orderId: string;
  clothingId: string;
  returnDate?: string;
  conditionAtReturn?: string;
  clothing: Clothing;
}

export interface Payment {
  id: string;
  userId: string;
  orderId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  transactionId?: string;
  createdAt: string;
}
