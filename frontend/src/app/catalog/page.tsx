'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clothingApi } from '@/services/api';
import { useAuth } from '@/lib/auth';
import { FadeInUp, CardHover } from '@/components/Animations';
import { Meteors } from '@/components/ui/meteors';
import type { Clothing } from '@/types';

const categories = ['Все', 'Одежда', 'Детские товары', 'Украшения', 'Аксессуары', 'Туристические'];
const sizes = ['Все', 'XS', 'S', 'M', 'L', 'XL'];

const categoryIcons: Record<string, string> = {
  'Одежда': '👗',
  'Детские товары': '👶',
  'Украшения': '💎',
  'Аксессуары': '👜',
  'Туристические': '✈️',
};

const placeholderByCategory: Record<string, string> = {
  'Одежда': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop',
  'Детские товары': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop',
  'Украшения': 'https://images.unsplash.com/photo-1515562141589-67f0d569b34e?w=400&h=500&fit=crop',
  'Аксессуары': 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop',
  'Туристические': 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&h=500&fit=crop',
};

export default function CatalogPage() {
  const [clothing, setClothing] = useState<Clothing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedSize, setSelectedSize] = useState('Все');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { fetchClothing(); }, []);

  const fetchClothing = async () => {
    try {
      const res = await clothingApi.getAll();
      setClothing(res.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const filteredClothing = clothing.filter(item => {
    const categoryMatch = selectedCategory === 'Все' || item.category === selectedCategory;
    const sizeMatch = selectedSize === 'Все' || item.size === selectedSize;
    return categoryMatch && sizeMatch;
  });

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = { NEW: 'Новая', EXCELLENT: 'Отличная', GOOD: 'Хорошая', FAIR: 'Удовл.' };
    return labels[condition] || condition;
  };

  const getConditionColor = (condition: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
      EXCELLENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      GOOD: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
      FAIR: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
    };
    return colors[condition] || 'bg-slate-100 text-slate-800';
  };

  const getCategoryCounts = () => {
    const counts: Record<string, number> = { 'Все': clothing.length };
    clothing.forEach(item => { counts[item.category] = (counts[item.category] || 0) + 1; });
    return counts;
  };

  const counts = getCategoryCounts();

  const handleRent = (item: Clothing) => {
    if (!user) { router.push('/login'); return; }
    if (!item.isAvailable || item.quantity <= 0) return;
    alert(`Заявка на аренду: ${item.name}\nСтоимость: ${item.dailyPrice.toLocaleString()}₸/день\nДепозит: ${item.deposit.toLocaleString()}₸\n\n(Для завершения оформите подписку в разделе "Тарифы")`);
    router.push('/pricing');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-8">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-14 px-6">
          <Meteors number={8} className="z-10" />
          <div className="relative z-20">
            <FadeInUp>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Каталог</h1>
              <p className="text-emerald-100 max-w-xl">
                Одежда, детские товары, украшения и готовые комплекты для аренды
              </p>
            </FadeInUp>
          </div>
        </div>

        {/* Filters */}
        <FadeInUp delay={0.1}>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-slate-900/50 mb-4 border border-slate-100 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Категория</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {cat !== 'Все' && categoryIcons[cat]} {cat} ({counts[cat] || 0})
                </button>
              ))}
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.15}>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm dark:shadow-slate-900/50 mb-6 border border-slate-100 dark:border-slate-700">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Размер</label>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Найдено: {filteredClothing.length} товаров</p>
        </FadeInUp>

        {filteredClothing.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Нет товаров по выбранным фильтрам</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClothing.map((item, i) => {
              const outOfStock = !item.isAvailable || item.quantity <= 0;
              const lowStock = item.quantity > 0 && item.quantity <= 2;
              return (
                <FadeInUp key={item.id} delay={Math.min(i * 0.05, 0.5)}>
                  <CardHover>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm dark:shadow-slate-900/50 overflow-hidden h-full border border-slate-100 dark:border-slate-700 flex flex-col">
                      <div className="h-56 relative overflow-hidden">
                        <img
                          src={item.imageUrl || placeholderByCategory[item.category] || placeholderByCategory['Одежда']}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${getConditionColor(item.condition)}`}>
                            {getConditionLabel(item.condition)}
                          </span>
                        </div>
                        {outOfStock && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-white font-bold text-lg block mb-1">Нет в наличии</span>
                              <span className="text-white/70 text-sm">Скоро появится</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 line-clamp-1">{item.name}</h3>
                        {item.brand && <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.brand}</p>}
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
                          <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">{item.size}</span>
                          {item.color && <span className="text-slate-500 dark:text-slate-400">{item.color}</span>}
                          {lowStock && <span className="text-amber-600 dark:text-amber-400 font-medium">Осталось {item.quantity} шт</span>}
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.dailyPrice.toLocaleString()}₸/день</span>
                            {item.deposit > 0 && (
                              <span className="text-xs text-slate-500 dark:text-slate-400">Депозит: {item.deposit.toLocaleString()}₸</span>
                            )}
                          </div>

                          <button
                            onClick={() => handleRent(item)}
                            disabled={outOfStock}
                            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              outOfStock
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm hover:shadow-md'
                            }`}
                          >
                            {outOfStock ? 'Нет в наличии' : 'Арендовать'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardHover>
                </FadeInUp>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
