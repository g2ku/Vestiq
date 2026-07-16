'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { subscriptionsApi, rentalsApi } from '@/services/api';
import { FadeInUp, CardHover } from '@/components/Animations';
import type { UserSubscription, RentalOrder } from '@/types';

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [activeRentals, setActiveRentals] = useState<RentalOrder[]>([]);
  const [allRentals, setAllRentals] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [rentalTab, setRentalTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) fetchData();
  }, [user, authLoading]);

  const fetchData = async () => {
    try {
      const [subRes, activeRes, allRes] = await Promise.all([
        subscriptionsApi.getCurrent(),
        rentalsApi.getActive(),
        rentalsApi.getMyRentals()
      ]);
      setSubscription(subRes.data);
      setActiveRentals(activeRes.data);
      setAllRentals(allRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Вы уверены, что хотите отменить подписку?')) return;
    try {
      await subscriptionsApi.cancel();
      setSubscription(null);
      alert('Подписка отменена');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка');
    }
  };

  const handleReturn = async (rentalId: string) => {
    if (!confirm('Вы уверены, что хотите вернуть вещи?')) return;
    try {
      await rentalsApi.returnItem(rentalId, 'EXCELLENT');
      fetchData();
      alert('Вещи возвращены');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Ошибка');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <FadeInUp>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Личный кабинет</h1>
        </FadeInUp>

        {/* Profile */}
        <FadeInUp delay={0.1}>
          <CardHover>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{user.fullName || 'Пользователь'}</h2>
                  <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Телефон</p>
                  <p className="font-medium text-slate-900 dark:text-white">{user.phone || 'Не указан'}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Дата регистрации</p>
                  <p className="font-medium text-slate-900 dark:text-white">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>
            </div>
          </CardHover>
        </FadeInUp>

        {/* Subscription */}
        <FadeInUp delay={0.2}>
          <CardHover>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-6 border border-slate-100 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Подписка</h2>
              {subscription ? (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl font-bold">
                      {subscription.plan.name}
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                      Активна
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Цена</p>
                      <p className="font-semibold text-emerald-600">{subscription.plan.priceMonthly.toLocaleString()}₸/мес</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Макс. вещей</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{subscription.plan.maxItems} шт</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Срок аренды</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{subscription.plan.rentalDays} дней</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Действует до: {new Date(subscription.endDate).toLocaleDateString('ru-RU')}
                  </p>
                  <button onClick={handleCancelSubscription} className="text-red-500 hover:text-red-600 text-sm font-medium transition">
                    Отменить подписку
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">У вас нет активной подписки</p>
                  <Link href="/pricing" className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all">
                    Выбрать тариф
                  </Link>
                </div>
              )}
            </div>
          </CardHover>
        </FadeInUp>

        {/* Rentals */}
        <FadeInUp delay={0.3}>
          <CardHover>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Аренды</h2>
                <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setRentalTab('active')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                      rentalTab === 'active'
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    Активные ({activeRentals.length})
                  </button>
                  <button
                    onClick={() => setRentalTab('history')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                      rentalTab === 'history'
                        ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    История ({allRentals.filter(r => !['PENDING', 'ACTIVE'].includes(r.status)).length})
                  </button>
                </div>
              </div>

              {rentalTab === 'active' ? (
                activeRentals.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">👗</div>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Нет активных аренд</p>
                    <Link href="/catalog" className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                      Перейти в каталог
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeRentals.map((rental, i) => (
                      <FadeInUp key={rental.id} delay={i * 0.1}>
                        <div className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 hover:border-emerald-300 dark:hover:border-emerald-600 transition">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">Заказ #{rental.id.slice(0, 8)}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {new Date(rental.startDate).toLocaleDateString('ru-RU')} —{' '}
                                {new Date(rental.endDate).toLocaleDateString('ru-RU')}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              rental.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            }`}>
                              {rental.status === 'ACTIVE' ? 'Активна' : 'Ожидает'}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {rental.items.map(item => (
                              <span key={item.id} className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm text-slate-700 dark:text-slate-300">
                                {item.clothing.name}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-emerald-600">
                              {rental.totalPrice.toLocaleString()}₸
                            </span>
                            <button
                              onClick={() => handleReturn(rental.id)}
                              className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition text-sm"
                            >
                              Вернуть вещи
                            </button>
                          </div>
                        </div>
                      </FadeInUp>
                    ))}
                  </div>
                )
              ) : (
                allRentals.filter(r => !['PENDING', 'ACTIVE'].includes(r.status)).length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-slate-500 dark:text-slate-400">Нет завершённых аренд</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allRentals
                      .filter(r => !['PENDING', 'ACTIVE'].includes(r.status))
                      .map((rental, i) => {
                        const statusConfig: Record<string, { label: string; color: string }> = {
                          RETURNED: { label: 'Возвращена', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
                          CANCELLED: { label: 'Отменена', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
                          OVERDUE: { label: 'Просрочена', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
                        };
                        const config = statusConfig[rental.status] || { label: rental.status, color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300' };
                        return (
                          <div key={rental.id} className="border border-slate-200 dark:border-slate-600 rounded-xl p-4 opacity-75">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white text-sm">Заказ #{rental.id.slice(0, 8)}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {new Date(rental.startDate).toLocaleDateString('ru-RU')} — {new Date(rental.endDate).toLocaleDateString('ru-RU')}
                                </p>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                                {config.label}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {rental.items.map(item => (
                                <span key={item.id} className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs text-slate-600 dark:text-slate-400">
                                  {item.clothing.name}
                                </span>
                              ))}
                            </div>
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                              {rental.totalPrice.toLocaleString()}₸
                            </span>
                          </div>
                        );
                      })}
                  </div>
                )
              )}
            </div>
          </CardHover>
        </FadeInUp>
      </div>
    </div>
  );
}
