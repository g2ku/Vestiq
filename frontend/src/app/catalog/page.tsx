'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { clothingApi, rentalsApi } from '@/services/api';
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

type CheckoutStep = 'dates' | 'confirm' | 'payment' | 'processing' | 'success' | 'error';
type PaymentMethod = 'kaspi' | 'card' | 'halyk';

export default function CatalogPage() {
  const [clothing, setClothing] = useState<Clothing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [selectedSize, setSelectedSize] = useState('Все');
  const [rentCart, setRentCart] = useState<string[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('dates');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('kaspi');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
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

  const cartItems = clothing.filter(c => rentCart.includes(c.id));
  const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)));
  const totalPerDay = cartItems.reduce((sum, c) => sum + c.dailyPrice, 0);
  const totalPrice = totalPerDay * days;
  const totalDeposit = cartItems.reduce((sum, c) => sum + c.deposit, 0);

  const handleRent = (item: Clothing) => {
    if (!user) { router.push('/login'); return; }
    if (!item.isAvailable || item.quantity <= 0) return;
    if (rentCart.includes(item.id)) {
      setRentCart(prev => prev.filter(id => id !== item.id));
    } else {
      setRentCart(prev => [...prev, item.id]);
    }
  };

  const handleOpenCheckout = () => {
    if (!user) { router.push('/login'); return; }
    if (rentCart.length === 0) return;
    setCheckoutStep('dates');
    setShowCheckout(true);
  };

  const handleConfirmRental = async () => {
    setCheckoutStep('processing');
    try {
      const rental = await rentalsApi.create({
        clothingIds: rentCart,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString()
      });
      try {
        const { paymentsApi } = await import('@/services/api');
        await paymentsApi.create({
          orderId: rental.data.id,
          paymentMethod: selectedMethod
        });
      } catch {}
      setCheckoutStep('success');
      setRentCart([]);
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Ошибка';
      if (msg.includes('подписк')) {
        setErrorMsg('Для аренды необходима подписка');
      } else {
        setErrorMsg(msg);
      }
      setCheckoutStep('error');
    }
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
                        <Image
                          src={item.imageUrl || placeholderByCategory[item.category] || placeholderByCategory['Одежда']}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 hover:scale-110"
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
                                : rentCart.includes(item.id)
                                  ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] shadow-sm'
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-sm hover:shadow-md'
                            }`}
                          >
                            {outOfStock ? 'Нет в наличии' : rentCart.includes(item.id) ? '✓ В корзине' : 'Арендовать'}
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

      {/* Floating Cart Bar */}
      {rentCart.length > 0 && !showCheckout && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <div className="container mx-auto max-w-4xl">
            <div className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-bold">
                  {rentCart.length}
                </div>
                <div>
                  <p className="font-semibold">{rentCart.length} {rentCart.length === 1 ? 'вещь' : 'вещей'} выбрано</p>
                  <p className="text-sm text-slate-300 dark:text-slate-600">~{totalPerDay.toLocaleString()}₸/день</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRentCart([])}
                  className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-900 transition text-sm"
                >
                  Очистить
                </button>
                <button
                  onClick={handleOpenCheckout}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all active:scale-[0.98]"
                >
                  Оформить аренду
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { if (checkoutStep !== 'processing') setShowCheckout(false); }} />
          <div className="relative bg-white dark:bg-slate-800 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Step: Select Dates */}
            {checkoutStep === 'dates' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Выберите даты</h2>
                  <button onClick={() => setShowCheckout(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none">&times;</button>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Дата начала</label>
                    <input
                      type="date"
                      value={startDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (new Date(e.target.value) >= new Date(endDate)) {
                          const d = new Date(e.target.value);
                          d.setDate(d.getDate() + 1);
                          setEndDate(d.toISOString().split('T')[0]);
                        }
                      }}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Дата окончания</label>
                    <input
                      type="date"
                      value={endDate}
                      min={new Date(new Date(startDate).getTime() + 86400000).toISOString().split('T')[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Items summary */}
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Ваши вещи ({cartItems.length})</p>
                  <div className="space-y-2">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400 truncate mr-2">{item.name}</span>
                        <span className="text-slate-900 dark:text-white font-medium whitespace-nowrap">{item.dailyPrice.toLocaleString()}₸/день</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">{days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} × {cartItems.length} {cartItems.length === 1 ? 'вещь' : 'вещей'}</span>
                    <span className="text-slate-900 dark:text-white font-medium">{totalPerDay.toLocaleString()}₸/день</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600 dark:text-slate-400">Стоимость аренды</span>
                    <span className="text-slate-900 dark:text-white font-medium">{totalPrice.toLocaleString()}₸</span>
                  </div>
                  {totalDeposit > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 dark:text-slate-400">Депозит (возвращается)</span>
                      <span className="text-slate-900 dark:text-white font-medium">{totalDeposit.toLocaleString()}₸</span>
                    </div>
                  )}
                  <div className="border-t border-emerald-200 dark:border-emerald-800 mt-3 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-900 dark:text-white">Итого к оплате</span>
                    <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{(totalPrice + totalDeposit).toLocaleString()}₸</span>
                  </div>
                </div>

                <button
                  onClick={() => setCheckoutStep('confirm')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all active:scale-[0.98]"
                >
                  Далее
                </button>
              </div>
            )}

            {/* Step: Confirm */}
            {checkoutStep === 'confirm' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Подтвердите аренду</h2>
                  <button onClick={() => setCheckoutStep('dates')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none">&times;</button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">Вы арендуете {cartItems.length} {cartItems.length === 1 ? 'вещь' : 'вещей'} на {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}</p>
                </div>

                <div className="space-y-2 mb-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.imageUrl || placeholderByCategory['Одежда']} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.size} · {item.dailyPrice.toLocaleString()}₸/день</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Период</span>
                    <span className="text-slate-900 dark:text-white">{new Date(startDate).toLocaleDateString('ru-RU')} — {new Date(endDate).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-500 dark:text-slate-400">Аренда</span>
                    <span className="text-slate-900 dark:text-white">{totalPrice.toLocaleString()}₸</span>
                  </div>
                  {totalDeposit > 0 && (
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-500 dark:text-slate-400">Депозит</span>
                      <span className="text-slate-900 dark:text-white">{totalDeposit.toLocaleString()}₸</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 dark:border-slate-600 mt-2 pt-2 flex justify-between font-semibold">
                    <span className="text-slate-900 dark:text-white">Итого</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{(totalPrice + totalDeposit).toLocaleString()}₸</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckoutStep('dates')}
                    className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => setCheckoutStep('payment')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98]"
                  >
                    Перейти к оплате
                  </button>
                </div>
              </div>
            )}

            {/* Step: Payment */}
            {checkoutStep === 'payment' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Оплата депозита</h2>
                  <button onClick={() => setCheckoutStep('confirm')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-2xl leading-none">&times;</button>
                </div>

                {/* Payment amount */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white mb-6">
                  <p className="text-sm opacity-80 mb-1">Сумма к оплате</p>
                  <p className="text-3xl font-bold">{totalDeposit.toLocaleString()}₸</p>
                  <p className="text-xs opacity-70 mt-1">Депозит · возвращается после возврата вещей</p>
                </div>

                {/* Payment methods */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Способ оплаты</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'kaspi' as const, icon: '🏦', label: 'Kaspi' },
                      { id: 'card' as const, icon: '💳', label: 'Карта' },
                      { id: 'halyk' as const, icon: '🏛️', label: 'Халык' },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMethod(m.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-center ${
                          selectedMethod === m.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <div className="text-2xl mb-1">{m.icon}</div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{m.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment fields */}
                <div className="space-y-4 mb-6">
                  {selectedMethod === 'kaspi' || selectedMethod === 'halyk' ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Номер телефона</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+7 (700) 123-45-67"
                        className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">На номер придёт код для подтверждения</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Номер карты</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                            const match = v.match(/\d{4,16}/g);
                            const m = (match && match[0]) || '';
                            const parts = [];
                            for (let i = 0; i < m.length; i += 4) parts.push(m.substring(i, i + 4));
                            setCardNumber(parts.join(' '));
                          }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Срок</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                              setCardExpiry(v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v);
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="•••"
                            maxLength={3}
                            className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white transition font-mono"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Тестовая оплата — деньги не списываются
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCheckoutStep('confirm')}
                    className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    Назад
                  </button>
                  <button
                    onClick={handleConfirmRental}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-all active:scale-[0.98]"
                  >
                    Оплатить {totalDeposit.toLocaleString()}₸
                  </button>
                </div>
              </div>
            )}

            {/* Step: Processing */}
            {checkoutStep === 'processing' && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Оформляем аренду...</h2>
                <p className="text-slate-500 dark:text-slate-400">Подождите немного</p>
              </div>
            )}

            {/* Step: Success */}
            {checkoutStep === 'success' && (
              <div className="p-6 text-center">
                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Аренда оформлена!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Заявка отправлена. Курьер свяжется с вами для подтверждения доставки.
                </p>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6 text-sm text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">Доставим в течение 2 часов</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">Депозит будет заблокирован</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500">✓</span>
                    <span className="text-slate-700 dark:text-slate-300">Отслеживайте статус в кабинете</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowCheckout(false); setCheckoutStep('dates'); router.push('/account'); }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    В кабинет
                  </button>
                  <button
                    onClick={() => { setShowCheckout(false); setCheckoutStep('dates'); }}
                    className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                  >
                    Продолжить
                  </button>
                </div>
              </div>
            )}

            {/* Step: Error */}
            {checkoutStep === 'error' && (
              <div className="p-6 text-center">
                <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ошибка</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">{errorMsg}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setCheckoutStep('dates'); setErrorMsg(''); }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Попробовать снова
                  </button>
                  {errorMsg.includes('подписк') && (
                    <button
                      onClick={() => { setShowCheckout(false); router.push('/pricing'); }}
                      className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white py-3 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                    >
                      К тарифам
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
