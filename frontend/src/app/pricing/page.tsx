'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { subscriptionsApi } from '@/services/api';
import { useAuth } from '@/lib/auth';
import { FadeInUp, CardHover, Counter } from '@/components/Animations';
import { Meteors } from '@/components/ui/meteors';
import { Particles } from '@/components/ui/particles';
import { ShineBorder } from '@/components/ui/shine-border';
import { MotionAccordion } from '@/components/unlumen-ui/motion-faqs-accordion';
import type { SubscriptionPlan } from '@/types';

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const res = await subscriptionsApi.getPlans();
      setPlans(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleSubscribe = (planId: string) => {
    if (!user) { router.push('/login'); return; }
    router.push(`/checkout?planId=${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const faqItems = [
    { question: 'Можно ли отменить подписку?', answer: 'Да, в любое время через личный кабинет. Без штрафов и скрытых комиссий. Подписка прекращает действие в конце текущего оплаченного периода.' },
    { question: 'Что если вещь повредилась?', answer: 'Мелкие повреждения (пятна, потёртости) списываются автоматически по фиксированной шкале. Серьёзные повреждения обсуждаются индивидуально с менеджером.' },
    { question: 'Как работает доставка?', answer: 'Курьер привезёт и заберёт вещи в удобное время. Слоты доставки назначаются автоматически системой. Доставка бесплатная по Алматы.' },
    { question: 'Есть ли ограничения по категориям?', answer: 'Basic — одежда. Premium — + детские товары и украшения. VIP — все категории без ограничений, включая туристические комплекты.' },
    { question: 'Можно ли продлить аренду?', answer: 'Да, продление доступно через личный кабинет. Стоимость — по тарифу вашей подписки. Продление автоматическое при включённом автопродлении.' },
    { question: 'Как работает депозит?', answer: 'Депозит блокируется при бронировании вещи и возвращается в течение 24 часов после возврата в надлежащем состоянии.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-20 relative overflow-hidden">
        <Meteors number={10} className="z-10" />
        <Particles className="absolute inset-0 z-10" quantity={30} color="#ffffff" size={0.4} />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-20">
          <FadeInUp>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Выбери свой тариф</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Все планы включают бесплатную доставку по Алматы и базовую чистку
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* 4 Steps */}
      <section className="py-20 -mt-6">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <FadeInUp>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-10">
              Как начать за 4 шага
            </h2>
          </FadeInUp>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { step: '01', icon: '📋', title: 'Выбери подписку', color: '#059669' },
              { step: '02', icon: '👗', title: 'Выбери вещи', color: '#10b981' },
              { step: '03', icon: '🚚', title: 'Получи доставку', color: '#34d399' },
              { step: '04', icon: '🔄', title: 'Верни и обнови', color: '#6ee7b7' },
            ].map((item, i) => (
              <FadeInUp key={i} delay={i * 0.12}>
                <CardHover>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm h-full relative border border-slate-100 dark:border-slate-700">
                    <ShineBorder shineColor={item.color} duration={3} borderWidth={2} className="rounded-2xl" />
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <FadeInUp key={plan.id} delay={index * 0.15}>
                <CardHover>
                  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden h-full border border-slate-100 dark:border-slate-700 ${
                    index === 1 ? 'ring-2 ring-emerald-500 relative' : ''
                  }`}>
                    {index === 1 && (
                      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center py-2.5 text-sm font-medium">
                        ⭐ Популярный выбор
                      </div>
                    )}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm h-10">{plan.description}</p>

                      <div className="mb-6">
                        <span className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                          {plan.priceMonthly.toLocaleString()}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-lg">₸/мес</span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <span className="text-sm">📦</span>
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{plan.maxItems} вещей одновременно</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                            <span className="text-sm">📅</span>
                          </div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Аренда на {plan.rentalDays} дней</span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm">
                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] btn-ripple ${
                          index === 1
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                      >
                        Выбрать {plan.name}
                      </button>
                    </div>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { value: 500, suffix: '+', label: 'Товаров в каталоге', color: 'text-emerald-600' },
              { value: 50, suffix: '+', label: 'Брендов', color: 'text-teal-600' },
              { value: 24, suffix: 'ч', label: 'Доставка', color: 'text-cyan-600' },
              { value: 80, suffix: '%', label: 'Экономия', color: 'text-green-600' },
            ].map((stat, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <div className="p-6">
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    <Counter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Deposit Info */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Как работают депозиты</h2>
          </FadeInUp>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔒', title: 'Блокировка', desc: 'Депозит блокируется при бронировании вещи на вашей карте', color: 'from-blue-500 to-cyan-500' },
              { icon: '✅', title: 'Возврат', desc: 'Возвращается в течение 24 часов после возврата вещи в надлежащем состоянии', color: 'from-emerald-500 to-teal-500' },
              { icon: '🔧', title: 'Списание', desc: 'Мелкий ущерб — автоматически. Серьёзный — обсуждается с менеджером', color: 'from-orange-500 to-red-500' },
            ].map((item, i) => (
              <FadeInUp key={i} delay={i * 0.15}>
                <CardHover>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm h-full border border-slate-100 dark:border-slate-700">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
                      {item.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — MotionAccordion */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Частые вопросы</h2>
          </FadeInUp>
          <FadeInUp delay={0.1}>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-2 border border-slate-100 dark:border-slate-700">
              <MotionAccordion items={faqItems} gap={8} />
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
