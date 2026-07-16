'use client';

import Link from 'next/link';
import { FadeInUp, CardHover, Counter } from '@/components/Animations';
import { BlobCard } from '@/components/unlumen-ui/blob-card';
import { AuroraBars } from '@/components/unlumen-ui/aurora-bars';
import { Meteors } from '@/components/ui/meteors';
import { Particles } from '@/components/ui/particles';
import { ScrollVelocityContainer, ScrollVelocityRow } from '@/components/ui/scroll-based-velocity';

const marqueeItems = [
  'ZARA', 'Chicco', 'Swarovski', 'Coach', 'VIP комплекты',
  'Massimo Dutti', 'Cybex', 'Pandora', 'Ray-Ban', "Levi's",
  'Nike', 'IKEA', 'Tiffany', 'Daniel Wellington', 'Sandro',
];

const reviews = [
  { name: 'Айгуль', text: 'Обновляю гардероб каждую неделю без переплат!', rating: 5 },
  { name: 'Данияр', text: 'Коляску для ребёнка взяли на аренду — супер удобно', rating: 5 },
  { name: 'Елена', text: 'Наконец-то могу носить дорогие бренды', rating: 5 },
  { name: 'Арман', text: 'Жена в восторге от сервиса, рекомендуем', rating: 5 },
  { name: 'Мадина', text: 'Для путешествий — идеальное решение!', rating: 5 },
  { name: 'Тимур', text: 'Качество вещей на высшем уровне', rating: 5 },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <AuroraBars
            barCount={32}
            colors={['#059669', '#10b981', '#34d399', '#6ee7b7', '#00000000']}
            maxHeightRatio={0.85}
            minHeightRatio={0.15}
            speed={0.4}
            gap={2}
            blur={8}
            background="#0f172a"
          />
        </div>
        <Particles className="absolute inset-0 z-10" quantity={80} color="#10b981" size={0.6} />
        <Meteors number={12} className="z-10" />

        <div className="relative z-20 text-center px-4">
          <FadeInUp>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Арендуй вещи,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                не покупай
              </span>
            </h1>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-xl md:text-2xl text-emerald-100/80 mb-10 max-w-2xl mx-auto">
              Одежда, детские товары, украшения и аксессуары по подписке
            </p>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-lg btn-ripple">
                Выбрать тариф
              </Link>
              <Link href="/catalog" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all">
                Смотреть каталог →
              </Link>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.6}>
            <div className="flex justify-center gap-6 mt-12 flex-wrap">
              {['500+ товаров', 'Доставка за 2ч', 'Эко-подход', 'Экономия 80%'].map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                  {item}
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Brands Marquee — dark text, slow */}
      <ScrollVelocityContainer className="py-8 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <ScrollVelocityRow baseVelocity={8} direction={1} scrollReactivity={false}>
          {marqueeItems.map((item, i) => (
            <span key={i} className="text-3xl font-bold text-slate-300 dark:text-slate-700 mx-10 whitespace-nowrap select-none">
              {item}
            </span>
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={6} direction={-1} scrollReactivity={false}>
          {marqueeItems.map((item, i) => (
            <span key={i} className="text-3xl font-bold text-slate-200 dark:text-slate-800 mx-10 whitespace-nowrap select-none">
              {item}
            </span>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      {/* Categories */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900 dark:text-white">
              5 категорий для аренды
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-12 max-w-xl mx-auto">
              Всё, что дорого покупать, но нужно на ограниченный срок
            </p>
          </FadeInUp>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '👗', name: 'Одежда', desc: 'ZARA, H&M, Massimo Dutti', colors: ['#ec4899', '#f43f5e', '#fb7185', '#fda4af'] },
              { icon: '👶', name: 'Детское', desc: 'Коляски, автокресла', colors: ['#3b82f6', '#06b6d4', '#22d3ee', '#67e8f9'] },
              { icon: '💎', name: 'Украшения', desc: 'Swarovski, Pandora', colors: ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe'] },
              { icon: '👜', name: 'Аксессуары', desc: 'Сумки, часы, ремни', colors: ['#f59e0b', '#f97316', '#fb923c', '#fdba74'] },
              { icon: '✈️', name: 'Туристам', desc: 'Готовые комплекты', colors: ['#10b981', '#14b8a6', '#2dd4bf', '#5eead4'] },
            ].map((cat, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <Link href="/catalog" className="block">
                  <BlobCard
                    headerHeight={120}
                    lightColors={cat.colors}
                    darkColors={cat.colors}
                    glowColors={cat.colors}
                    className="h-full"
                  >
                    <div className="p-4 text-center">
                      <div className="text-4xl mb-2">{cat.icon}</div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{cat.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cat.desc}</p>
                    </div>
                  </BlobCard>
                </Link>
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
              { value: 500, suffix: '+', label: 'Товаров', color: 'text-emerald-600' },
              { value: 50, suffix: '+', label: 'Брендов', color: 'text-teal-600' },
              { value: 2, suffix: 'ч', label: 'Доставка', color: 'text-cyan-600' },
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

      {/* Reviews */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Отзывы подписчиков
            </h2>
          </FadeInUp>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <CardHover>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{review.name}</div>
                        <div className="flex text-amber-400 text-sm">
                          {'★'.repeat(review.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">{review.text}</p>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <Particles className="absolute inset-0 z-10" quantity={40} color="#ffffff" size={0.4} />
        <div className="container mx-auto px-4 text-center relative z-20">
          <FadeInUp>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Готов начать?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-xl mx-auto">
              Присоединяйся к тысячам модных казахстанцев
            </p>
            <Link href="/register" className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg btn-ripple">
              Зарегистрироваться бесплатно
            </Link>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
