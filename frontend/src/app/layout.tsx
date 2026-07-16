import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import Navbar from "@/components/Navbar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vestiq - Аренда одежды и вещей по подписке",
  description: "Сервис аренды одежды, детских товаров, украшений и аксессуаров по подписке в Казахстане",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${dmSans.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Vestiq</h3>
                  <p className="text-slate-400 text-sm">
                    Аренда одежды и вещей по подписке. Дорогие вещи — без затрат на покупку.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-white">Категории</h4>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li><a href="/catalog" className="hover:text-emerald-400 transition">Одежда</a></li>
                    <li><a href="/catalog" className="hover:text-emerald-400 transition">Детские товары</a></li>
                    <li><a href="/catalog" className="hover:text-emerald-400 transition">Украшения</a></li>
                    <li><a href="/catalog" className="hover:text-emerald-400 transition">Аксессуары</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-white">Информация</h4>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li><a href="/about" className="hover:text-emerald-400 transition">О нас</a></li>
                    <li><a href="/how-it-works" className="hover:text-emerald-400 transition">Как работает</a></li>
                    <li><a href="/pricing" className="hover:text-emerald-400 transition">Тарифы</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4 text-white">Контакты</h4>
                  <ul className="space-y-2 text-slate-400 text-sm">
                    <li>Almaty, Kazakhstan</li>
                    <li>+7 (700) 123-45-67</li>
                    <li>info@vestiq.kz</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                <p>&copy; 2024 Vestiq. Все права защищены.</p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
