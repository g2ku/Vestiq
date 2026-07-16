import api from '@/lib/api';
import type { User, SubscriptionPlan, UserSubscription, Clothing, RentalOrder, Payment } from '@/types';

// Auth
export const authApi = {
  register: (data: { email: string; password: string; phone?: string; fullName?: string }) =>
    api.post<{ user: User; token: string }>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', data),
  
  getMe: () => api.get<User>('/auth/me'),
};

// Users
export const usersApi = {
  getProfile: () => api.get<User>('/users/profile'),
  updateProfile: (data: { fullName?: string; phone?: string; avatarUrl?: string }) =>
    api.put<User>('/users/profile', data),
};

// Clothing
export const clothingApi = {
  getAll: (params?: { category?: string; size?: string; brand?: string; color?: string; available?: string }) =>
    api.get<Clothing[]>('/clothing', { params }),
  
  getById: (id: string) => api.get<Clothing>(`/clothing/${id}`),
  
  getCategories: () => api.get<string[]>('/clothing/categories'),
};

// Subscriptions
export const subscriptionsApi = {
  getPlans: () => api.get<SubscriptionPlan[]>('/subscriptions/plans'),
  
  getCurrent: () => api.get<UserSubscription | null>('/subscriptions/current'),
  
  subscribe: (planId: string) => api.post<UserSubscription>('/subscriptions/subscribe', { planId }),
  
  cancel: () => api.post<UserSubscription>('/subscriptions/cancel'),
};

// Rentals
export const rentalsApi = {
  getMyRentals: () => api.get<RentalOrder[]>('/rentals'),
  
  getActive: () => api.get<RentalOrder[]>('/rentals/active'),
  
  create: (data: { clothingIds: string[]; startDate: string; endDate: string }) =>
    api.post<RentalOrder>('/rentals', data),
  
  returnItem: (id: string, condition?: string) =>
    api.put(`/rentals/${id}/return`, { condition }),
  
  cancel: (id: string) => api.put(`/rentals/${id}/cancel`),
};

// Payments
export const paymentsApi = {
  create: (data: { orderId: string; paymentMethod: string }) =>
    api.post<{ payment: Payment; paymentUrl: string }>('/payments/create', data),
  
  getHistory: () => api.get<Payment[]>('/payments/history'),
};
