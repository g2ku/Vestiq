'use client';

import { FadeInUp, CardHover, Counter } from '@/components/Animations';
import { Globe } from '@/components/ui/globe';
import { ShineBorder } from '@/components/ui/shine-border';
import { Particles } from '@/components/ui/particles';
import Link from 'next/link';

const VESTIQ_MARKER_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1] as [number, number, number],
  markerColor: [5 / 255, 150 / 255, 105 / 255] as [number, number, number],
  glowColor: [1, 1, 1] as [number, number, number],
  markers: [
    { location: [43.238949, 76.945465] as [number, number], size: 0.12 },
    { location: [43.256674, 76.928619] as [number, number], size: 0.08 },
    { location: [51.128207, 71.430420] as [number, number], size: 0.1 },
    { location: [43.222020, 76.851251] as [number, number], size: 0.06 },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-20 relative overflow-hidden">
        <Particles className="absolute inset-0 z-10" quantity={40} color="#ffffff" size={0.5} />
        <div className="container mx-auto px-4 text-center relative z-20">
          <FadeInUp>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">О Vestiq</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Мы даём людям доступ к дорогим вещам через подписку и аренду
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Наша миссия</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Дать людям доступ к дорогим вещам, которые нужны на ограниченный срок — одежде, детским товарам, украшениям и аксессуарам, — через подписку и аренду, вместо того чтобы покупать их в собственность.
            </p>
          </FadeInUp>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeInUp delay={0.1}>
              <CardHover>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl h-full border border-slate-100 dark:border-slate-700">
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Проблема</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                    <li>• Молодые городские потребители хотят часто обновлять гардероб</li>
                    <li>• Покупка новой одежды для редкого использования — нерационально</li>
                    <li>• Дизайнерские вещи дорогие и используются 1–3 раза</li>
                    <li>• Существующие альтернативы неудобны</li>
                  </ul>
                </div>
              </CardHover>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <CardHover>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl h-full relative overflow-hidden border border-emerald-100 dark:border-emerald-800/30">
                  <ShineBorder shineColor="#10b981" duration={4} className="rounded-2xl" />
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">Наше решение</h3>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                    <li>• Подписка с фиксированной ежемесячной оплатой</li>
                    <li>• Каталог одежды, детских товаров, украшений</li>
                    <li>• Готовые комплекты для туристов</li>
                    <li>• Доставка, чистка и обслуживание включены</li>
                  </ul>
                </div>
              </CardHover>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Globe Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeInUp>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Мы в Казахстане</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Vestiq работает по всему Казахстану. Доставляем по Алматы за 2 часа, по стране — за 1-2 дня.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-2xl font-bold text-emerald-600"><Counter target={500} suffix="+" /></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Товаров</div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-2xl font-bold text-teal-600"><Counter target={50} suffix="+" /></div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Брендов</div>
                  </div>
                </div>
              </div>
            </FadeInUp>
            <FadeInUp delay={0.2}>
              <div className="relative h-[350px]">
                <Globe config={VESTIQ_MARKER_CONFIG} className="opacity-80" />
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Наши категории</h2>
          </FadeInUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '👗', name: 'Одежда', desc: 'ZARA, H&M, Massimo Dutti, Sandro', color: 'from-pink-500 to-rose-500' },
              { icon: '👶', name: 'Детские товары', desc: 'Коляски, автокресла, кроватки', color: 'from-blue-500 to-cyan-500' },
              { icon: '💎', name: 'Украшения', desc: 'Swarovski, Pandora, Tiffany', color: 'from-purple-500 to-violet-500' },
              { icon: '✈️', name: 'Туристам', desc: 'Готовые комплекты на время поездки', color: 'from-emerald-500 to-teal-500' },
            ].map((cat, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <CardHover>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-center h-full border border-slate-100 dark:border-slate-700">
                    <div className={`w-16 h-16 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl`}>
                      {cat.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{cat.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{cat.desc}</p>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* SMART Goals */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Наши цели</h2>
          </FadeInUp>
          <div className="space-y-4">
            {[
              { num: '01', title: '500 активных подписок', desc: 'К концу 6-го месяца после запуска' },
              { num: '02', title: '2 новые категории', desc: 'Детские товары и украшения — к концу 3-го месяца' },
              { num: '03', title: '100 туристических аренд в месяц', desc: 'К концу 6-го месяца' },
              { num: '04', title: '≥2 аренды на вещь в месяц', desc: 'Оборачиваемость к 5-му месяцу' },
              { num: '05', title: 'LTV/CAC ≥ 3', desc: 'Положительная unit-экономика к 12-му месяцу' },
            ].map((goal, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <CardHover>
                  <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <span className="text-2xl font-bold text-emerald-600">{goal.num}</span>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{goal.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{goal.desc}</p>
                    </div>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Наша команда</h2>
          </FadeInUp>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '👨‍💼', title: 'Founder / CEO', desc: 'Стратегия, финансы, партнёрства' },
              { icon: '📋', title: 'Operations Manager', desc: 'Инвентарь, логистика, качество' },
              { icon: '📈', title: 'Marketing & Growth', desc: 'Привлечение, удержание, SMM' },
              { icon: '🤝', title: 'Partnerships & Catalog', desc: 'Дизайнеры, новые категории' },
              { icon: '💬', title: 'Customer Support', desc: 'Клиентский сервис, споры' },
              { icon: '📦', title: 'Warehouse & QC + Logistics', desc: 'Приёмка, чистка, доставка' },
            ].map((role, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <CardHover>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm text-center h-full border border-slate-100 dark:border-slate-700">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
                      {role.icon}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{role.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{role.desc}</p>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <Particles className="absolute inset-0 z-10" quantity={40} color="#ffffff" size={0.4} />
        <div className="container mx-auto px-4 text-center relative z-20">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Присоединяйся к нам</h2>
            <p className="text-xl text-emerald-100 mb-8">Начни аренду уже сегодня</p>
            <Link href="/register" className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Зарегистрироваться
            </Link>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
