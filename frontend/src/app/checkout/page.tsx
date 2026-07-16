'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { subscriptionsApi } from '@/services/api';
import { FadeInUp, ScaleIn } from '@/components/Animations';
import type { SubscriptionPlan } from '@/types';

type PaymentMethod = 'kaspi' | 'card' | 'halyk';
type PaymentStep = 'select' | 'processing' | 'success' | 'failed';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const { user } = useAuth();
  const router = useRouter();

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('kaspi');
  const [step, setStep] = useState<PaymentStep>('select');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (planId) {
      fetchPlan(planId);
    } else {
      setLoading(false);
    }
  }, [planId, user]);

  const fetchPlan = async (id: string) => {
    try {
      const res = await subscriptionsApi.getPlans();
      const found = res.data.find(p => p.id === id);
      if (found) setPlan(found);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validatePayment = (): boolean => {
    const errors: Record<string, string> = {};

    if (selectedMethod === 'kaspi' || selectedMethod === 'halyk') {
      const cleaned = phoneNumber.replace(/\D/g, '');
      if (!cleaned) {
        errors.phone = 'Введите номер телефона';
      } else if (!/^7\d{10}$/.test(cleaned)) {
        errors.phone = 'Некорректный номер. Формат: +7 (7XX) XXX-XX-XX';
      }
    } else {
      const digits = cardNumber.replace(/\s/g, '');
      if (!digits) {
        errors.cardNumber = 'Введите номер карты';
      } else if (digits.length < 16) {
        errors.cardNumber = 'Номер карты должен содержать 16 цифр';
      }

      if (!cardExpiry) {
        errors.expiry = 'Введите срок действия';
      } else {
        const [mm, yy] = cardExpiry.split('/');
        const month = parseInt(mm, 10);
        const year = parseInt(yy, 10);
        if (!mm || !yy || isNaN(month) || isNaN(year)) {
          errors.expiry = 'Формат: MM/YY';
        } else if (month < 1 || month > 12) {
          errors.expiry = 'Месяц от 01 до 12';
        } else {
          const now = new Date();
          const expiry = new Date(2000 + year, month);
          if (expiry <= now) {
            errors.expiry = 'Карта просрочена';
          }
        }
      }

      if (!cardCvv) {
        errors.cvv = 'Введите CVV';
      } else if (cardCvv.length < 3) {
        errors.cvv = 'CVV должен содержать 3 цифры';
      }
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = () => {
    if (validatePayment()) {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    setStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2500));
    const isSuccess = Math.random() > 0.15;

    if (isSuccess) {
      try {
        if (planId) {
          await subscriptionsApi.subscribe(planId);
        }
        setStep('success');
      } catch {
        setStep('failed');
      }
    } else {
      setStep('failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-12 px-4">
        <ScaleIn>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100 dark:border-slate-700">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
              <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Оплата прошла!</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-2">Подписка <span className="font-semibold text-emerald-600">{plan?.name}</span> активирована</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Списание {plan?.priceMonthly.toLocaleString()}₸/мес</p>

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300 mb-2">Что дальше?</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Перейдите в каталог и выберите вещи
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Доставим курьером в течение 2 часов
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Депозит будет заблокирован автоматически
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Link href="/catalog" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
                В каталог
              </Link>
              <Link href="/account" className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                В кабинет
              </Link>
            </div>
          </div>
        </ScaleIn>
      </div>
    );
  }

  if (step === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-12 px-4">
        <ScaleIn>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100 dark:border-slate-700">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Оплата не прошла</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">Попробуйте другой способ оплаты или повторите позже</p>

            <div className="flex gap-3">
              <button onClick={() => setStep('select')} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition">
                Повторить
              </button>
              <Link href="/pricing" className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                К тарифам
              </Link>
            </div>
          </div>
        </ScaleIn>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950 flex items-center justify-center py-12 px-4">
        <ScaleIn>
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-10 max-w-md w-full text-center border border-slate-100 dark:border-slate-700">
            <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Обработка оплаты</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {selectedMethod === 'kaspi' ? 'Перенаправление в Kaspi...' :
               selectedMethod === 'halyk' ? 'Перенаправление в Халык Банк...' :
               'Обработка платёжной транзакции...'}
            </p>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-left">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Сумма:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{plan?.priceMonthly.toLocaleString()}₸</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Тариф:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{plan?.name}</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">Не закрывайте страницу...</p>
          </div>
        </ScaleIn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <FadeInUp>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад к тарифам
          </Link>
        </FadeInUp>

        <div className="grid lg:grid-cols-5 gap-8">
          <FadeInUp className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-8 border border-slate-100 dark:border-slate-700">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Оплата подписки</h1>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Способ оплаты</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'kaspi' as const, icon: '🏦', label: 'Kaspi', border: 'border-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                    { id: 'card' as const, icon: '💳', label: 'Карта', border: 'border-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { id: 'halyk' as const, icon: '🏛️', label: 'Халык', border: 'border-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedMethod(m.id); setPaymentErrors({}); }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedMethod === m.id
                          ? `${m.border} ${m.bg} shadow-md`
                          : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                      }`}
                    >
                      <div className="text-2xl mb-1">{m.icon}</div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {selectedMethod === 'kaspi' || selectedMethod === 'halyk' ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Номер телефона</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => { setPhoneNumber(e.target.value); setPaymentErrors(prev => { const n = {...prev}; delete n.phone; return n; }); }}
                      placeholder="+7 (700) 123-45-67"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition ${paymentErrors.phone ? 'border-red-500 dark:border-red-500' : 'border-slate-200 dark:border-slate-600'}`}
                    />
                    {paymentErrors.phone && <p className="text-xs text-red-500 mt-1">{paymentErrors.phone}</p>}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      На этот номер придёт код для подтверждения оплаты
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Номер карты</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setPaymentErrors(prev => { const n = {...prev}; delete n.cardNumber; return n; }); }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition font-mono ${paymentErrors.cardNumber ? 'border-red-500 dark:border-red-500' : 'border-slate-200 dark:border-slate-600'}`}
                      />
                      {paymentErrors.cardNumber && <p className="text-xs text-red-500 mt-1">{paymentErrors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Срок</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => { setCardExpiry(formatExpiry(e.target.value)); setPaymentErrors(prev => { const n = {...prev}; delete n.expiry; return n; }); }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition font-mono ${paymentErrors.expiry ? 'border-red-500 dark:border-red-500' : 'border-slate-200 dark:border-slate-600'}`}
                        />
                        {paymentErrors.expiry && <p className="text-xs text-red-500 mt-1">{paymentErrors.expiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => { setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3)); setPaymentErrors(prev => { const n = {...prev}; delete n.cvv; return n; }); }}
                          placeholder="•••"
                          maxLength={3}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition font-mono ${paymentErrors.cvv ? 'border-red-500 dark:border-red-500' : 'border-slate-200 dark:border-slate-600'}`}
                        />
                        {paymentErrors.cvv && <p className="text-xs text-red-500 mt-1">{paymentErrors.cvv}</p>}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Имя держателя</label>
                  <input
                    type="text"
                    placeholder="Как на карте"
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-slate-500 dark:text-slate-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Данные защищены шифрованием. Это тестовая оплата — деньги не списываются.
              </div>

              <button
                onClick={handlePay}
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl btn-ripple"
              >
                Оплатить {plan?.priceMonthly.toLocaleString()}₸
              </button>

              <p className="text-center text-xs text-slate-400 mt-4">
                Нажимая «Оплатить», вы соглашаетесь с условиями сервиса
              </p>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.2} className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 sticky top-24 border border-slate-100 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Ваш заказ</h2>

              {plan ? (
                <>
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white mb-4">
                    <div className="text-sm opacity-80">Тариф</div>
                    <div className="text-2xl font-bold">{plan.name}</div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Подписка</span>
                      <span className="font-medium text-slate-900 dark:text-white">{plan.priceMonthly.toLocaleString()}₸/мес</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Вещей одновременно</span>
                      <span className="font-medium text-slate-900 dark:text-white">{plan.maxItems} шт</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Срок аренды</span>
                      <span className="font-medium text-slate-900 dark:text-white">{plan.rentalDays} дней</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-600 pt-4 mb-4">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white">Итого сегодня</span>
                      <span className="font-bold text-xl text-emerald-600">{plan.priceMonthly.toLocaleString()}₸</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Списание каждый месяц</p>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Бесплатная доставка по Алматы
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-emerald-500">•</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Выберите тариф на странице тарифов
                </div>
              )}
            </div>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
