'use client';

import { FadeInUp, CardHover } from '@/components/Animations';
import { AuroraBars } from '@/components/unlumen-ui/aurora-bars';
import { SpinningText } from '@/components/ui/spinning-text';
import { DiaTextReveal } from '@/components/ui/dia-text-reveal';
import { Particles } from '@/components/ui/particles';
import { ShineBorder } from '@/components/ui/shine-border';
import Link from 'next/link';

const steps = [
  { step: 1, title: 'Выбери тариф', description: 'Basic, Premium или VIP — подбираем подписку под твои потребности и бюджет.', icon: '📋', color: '#059669', who: 'Подписчик' },
  { step: 2, title: 'Выбери вещи', description: 'Каталог одежды, детских товаров, украшений и готовых комплектов. Фильтруй по категории, размеру, бренду.', icon: '👗', color: '#10b981', who: 'Подписчик' },
  { step: 3, title: 'Автоматическая проверка', description: 'Система мгновенно проверяет доступность вещи по её цифровому паспорту и резервирует депозит.', icon: '⚡', color: '#34d399', who: 'Система' },
  { step: 4, title: 'Подготовка на складе', description: 'Сотрудник сканирует QR-код вещи, проводит экспресс-проверку по последней записи паспорта (SLA ≤30 мин).', icon: '📦', color: '#6ee7b7', who: 'Warehouse & QC' },
  { step: 5, title: 'Доставка курьером', description: 'Курьер забирает вещь со склада и доставляет вам. Каждая передача фиксируется цифровой подписью.', icon: '🚚', color: '#059669', who: 'Logistics' },
  { step: 6, title: 'Получение и подтверждение', description: 'Вы получаете вещь и подтверждаете в приложении — старт таймера аренды.', icon: '✅', color: '#10b981', who: 'Подписчик' },
  { step: 7, title: 'Использование', description: 'Наслаждайтесь вещью в течение оплаченного периода. Носите, сочетайте, фотографируйте для соцсетей.', icon: '📸', color: '#34d399', who: 'Подписчик' },
  { step: 8, title: 'Возврат', description: 'Запросите возврат в приложении — система автоматически назначит слот забора курьером.', icon: '🔄', color: '#6ee7b7', who: 'Система + Курьер' },
  { step: 9, title: 'Проверка и восстановление', description: 'На складе вещь сканируется, оценивается состояние. Мелкий ущерб — автосписание. Серьёзный — ручное рассмотрение.', icon: '🔍', color: '#059669', who: 'Warehouse & QC' },
  { step: 10, title: 'Возврат в каталог', description: 'После чистки и восстановления вещь снова доступна для аренды. Цикл завершён!', icon: '🎉', color: '#10b981', who: 'Система' },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-20 overflow-hidden">
        <AuroraBars
          barCount={24}
          colors={['#059669', '#10b981', '#34d399', '#6ee7b7', '#00000000']}
          maxHeightRatio={0.7}
          minHeightRatio={0.2}
          speed={0.3}
          gap={3}
          blur={6}
          background="transparent"
        />
        <Particles className="absolute inset-0 z-10" quantity={30} color="#ffffff" size={0.4} />
        <div className="container mx-auto px-4 text-center relative z-20">
          <FadeInUp>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Как работает Vestiq</h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              От выбора вещи до её возврата — каждый шаг автоматизирован и прозрачен
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Процесс аренды</h2>
          </FadeInUp>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <FadeInUp key={step.step} delay={Math.min(i * 0.08, 0.5)}>
                <CardHover>
                  <div className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${step.color}20` }}>
                      <span className="text-2xl">{step.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Шаг {step.step}</span>
                        <span className="text-xs text-slate-400">• {step.who}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">{step.description}</p>
                    </div>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* DiaTextReveal Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        <Particles className="absolute inset-0 z-10" quantity={20} color="#10b981" size={0.5} />
        <div className="container mx-auto px-4 text-center relative z-20 max-w-4xl">
          <FadeInUp>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Процесс{' '}
              <DiaTextReveal
                text={['прозрачен', 'автоматизирован', 'безопасен']}
                colors={['#059669', '#10b981', '#34d399', '#6ee7b7', '#0d9488']}
                duration={1.5}
                repeat={true}
                repeatDelay={1}
                className="text-4xl md:text-5xl font-bold"
              />
            </h2>
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-12">
              Каждый этап отслеживается через цифровой паспорт вещи
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Ключевые особенности</h2>
          </FadeInUp>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '📱', title: 'Цифровой паспорт вещи', desc: 'Каждая вещь имеет уникальный QR-код с полной историей состояния. Статус синхронизируется в реальном времени.' },
              { icon: '✍️', title: 'Цифровая подпись при передаче', desc: 'Каждая физическая передача вещи фиксируется подписью обеих сторон. Любой спор можно проследить.' },
              { icon: '🤖', title: 'Автоматический депозит', desc: 'Депозит блокируется при бронировании и возвращается автоматически в течение 24 часов при отсутствии повреждений.' },
              { icon: '⏱️', title: 'SLA на каждом этапе', desc: 'Предвыдачная проверка ≤30 мин, сканирование при возврате ≤20 мин. Нарушения видны в дашборде.' },
              { icon: '🚗', title: 'Авто-назначение слотов', desc: 'Система сама назначает слоты забора и доставки на основе доступности курьеров и вашей локации.' },
              { icon: '📊', title: 'Умная оценка ущерба', desc: 'Система классифицирует повреждения: мелкий ущерб списывается автоматически, серьёзный — на ручное рассмотрение.' },
            ].map((feature, i) => (
              <FadeInUp key={i} delay={i * 0.1}>
                <CardHover>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 h-full">
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.desc}</p>
                  </div>
                </CardHover>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* SLA Table */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <FadeInUp>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Наши стандарты (SLA)</h2>
          </FadeInUp>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800">
                  <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Этап</th>
                  <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">SLA</th>
                  <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">Ответственный</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { stage: 'Проверка доступности', sla: 'Мгновенно', slaColor: 'text-emerald-600', responsible: 'Система' },
                  { stage: 'Резерв + блокировка депозита', sla: 'Мгновенно', slaColor: 'text-emerald-600', responsible: 'Система' },
                  { stage: 'Предвыдачная проверка', sla: '≤ 30 мин', slaColor: 'text-amber-600', responsible: 'Warehouse & QC' },
                  { stage: 'Доставка курьером', sla: '≤ 2 часа', slaColor: 'text-amber-600', responsible: 'Logistics' },
                  { stage: 'Сканирование при возврате', sla: '≤ 20 мин', slaColor: 'text-amber-600', responsible: 'Warehouse & QC' },
                  { stage: 'Возврат депозита', sla: '≤ 24 часа', slaColor: 'text-emerald-600', responsible: 'Система (авто)' },
                  { stage: 'Назначение слота забора', sla: '≤ 2 часа', slaColor: 'text-emerald-600', responsible: 'Система (авто)' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                    <td className="p-4 text-slate-900 dark:text-white">{row.stage}</td>
                    <td className={`p-4 font-medium ${row.slaColor}`}>{row.sla}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{row.responsible}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white relative overflow-hidden">
        <SpinningText
          duration={15}
          radius={6}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/10 text-6xl font-bold opacity-30"
        >
          VESTIQ • АРЕНДА • ПОДПИСКА • СТИЛЬ •
        </SpinningText>
        <Particles className="absolute inset-0 z-10" quantity={30} color="#ffffff" size={0.4} />
        <div className="container mx-auto px-4 text-center relative z-20">
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Готов начать?</h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-xl mx-auto">
              Присоединяйся к тысячам модных казахстанцев
            </p>
            <Link href="/register" className="inline-block bg-white text-emerald-600 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Зарегистрироваться бесплатно
            </Link>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}
