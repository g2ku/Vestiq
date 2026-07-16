'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <nav className="bg-white dark:bg-slate-900/80 dark:backdrop-blur-md shadow-sm dark:shadow-slate-800/50 sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
            Vestiq
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/catalog" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
              Каталог
            </Link>
            <Link href="/how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
              Как работает
            </Link>
            <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
              Тарифы
            </Link>
            <Link href="/about" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
              О нас
            </Link>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Переключить тему"
            >
              {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {user ? (
              <>
                <Link href="/account" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                  Кабинет
                </Link>
                <button onClick={logout} className="text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors font-medium">
                  Выйти
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium">
                  Войти
                </Link>
                <Link href="/register" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-md hover:shadow-lg">
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"
              aria-label="Переключить тему"
            >
              {dark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
              {mobileOpen ? (
                <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <Link href="/catalog" className="block py-2 text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileOpen(false)}>Каталог</Link>
            <Link href="/how-it-works" className="block py-2 text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileOpen(false)}>Как работает</Link>
            <Link href="/pricing" className="block py-2 text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileOpen(false)}>Тарифы</Link>
            <Link href="/about" className="block py-2 text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileOpen(false)}>О нас</Link>
            {user ? (
              <>
                <Link href="/account" className="block py-2 text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileOpen(false)}>Кабинет</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-2 text-red-500 font-medium">Выйти</button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-slate-600 dark:text-slate-300 font-medium" onClick={() => setMobileOpen(false)}>Войти</Link>
                <Link href="/register" className="block py-2 text-emerald-600 dark:text-emerald-400 font-semibold" onClick={() => setMobileOpen(false)}>Регистрация</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
