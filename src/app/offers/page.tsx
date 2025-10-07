'use client';

import Link from 'next/link';
import { Tag, Percent, TrendingDown, User, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import Logo from '@/components/Logo';

export default function OffersPage() {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group order-2 md:order-1">
              <Logo size="small" />
              <div>
                <span className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition block">
                  قصر الرضيع
                </span>
                <span className="text-xs text-gray-500 font-medium">Baby Palace</span>
              </div>
            </Link>

            <div className="flex items-center gap-3 order-1 md:order-2">
              <Link href="/login" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <User className="w-5 h-5 text-gray-600" />
              </Link>
              <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Heart className="w-5 h-5 text-gray-600" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🎁</div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            العروض والخصومات
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أفضل العروض الحصرية على منتجات الأطفال والرضع
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Offer Card 1 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-orange-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">خصم 30%</h3>
              </div>
              <p className="text-gray-700 mb-4">
                على جميع منتجات التغذية والرضاعة
              </p>
              <div className="bg-orange-50 rounded-lg p-3 mb-4">
                <p className="text-orange-600 font-semibold text-sm">
                  العرض ساري لمدة محدودة
                </p>
              </div>
              <Link
                href="/products?category=للتغذية"
                className="block text-center bg-orange-600 text-white py-2.5 rounded-lg font-bold hover:bg-orange-700 transition"
              >
                تسوق الآن
              </Link>
            </div>

            {/* Offer Card 2 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Percent className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">خصم 50%</h3>
              </div>
              <p className="text-gray-700 mb-4">
                على ملابس الأطفال المحددة
              </p>
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-blue-600 font-semibold text-sm">
                  عرض نهاية الموسم
                </p>
              </div>
              <Link
                href="/products?category=ملابس"
                className="block text-center bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                تسوق الآن
              </Link>
            </div>

            {/* Offer Card 3 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-green-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">توصيل مجاني</h3>
              </div>
              <p className="text-gray-700 mb-4">
                للطلبات أكثر من 5000 دج
              </p>
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-green-600 font-semibold text-sm">
                  عرض دائم لجميع العملاء
                </p>
              </div>
              <Link
                href="/products"
                className="block text-center bg-green-600 text-white py-2.5 rounded-lg font-bold hover:bg-green-700 transition"
              >
                تسوق الآن
              </Link>
            </div>

            {/* Offer Card 4 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-purple-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">اشتر 2 واحصل على 1</h3>
              </div>
              <p className="text-gray-700 mb-4">
                على منتجات النظافة المختارة
              </p>
              <div className="bg-purple-50 rounded-lg p-3 mb-4">
                <p className="text-purple-600 font-semibold text-sm">
                  عرض لفترة محدودة
                </p>
              </div>
              <Link
                href="/products?category=للنظافة"
                className="block text-center bg-purple-600 text-white py-2.5 rounded-lg font-bold hover:bg-purple-700 transition"
              >
                تسوق الآن
              </Link>
            </div>

            {/* Offer Card 5 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-pink-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center">
                  <Percent className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">خصم 40%</h3>
              </div>
              <p className="text-gray-700 mb-4">
                على عربات الأطفال الفاخرة
              </p>
              <div className="bg-pink-50 rounded-lg p-3 mb-4">
                <p className="text-pink-600 font-semibold text-sm">
                  عرض خاص للعملاء الجدد
                </p>
              </div>
              <Link
                href="/products?category=للخرجات"
                className="block text-center bg-pink-600 text-white py-2.5 rounded-lg font-bold hover:bg-pink-700 transition"
              >
                تسوق الآن
              </Link>
            </div>

            {/* Offer Card 6 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-indigo-500 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Tag className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">خصم 25%</h3>
              </div>
              <p className="text-gray-700 mb-4">
                على منتجات النوم والفراش
              </p>
              <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                <p className="text-indigo-600 font-semibold text-sm">
                  راحة طفلك أولوية
                </p>
              </div>
              <Link
                href="/products?category=للنوم"
                className="block text-center bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition"
              >
                تسوق الآن
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 mb-3">
              اشترك في النشرة البريدية
            </h2>
            <p className="text-gray-600 mb-6">
              احصل على إشعارات فورية بأحدث العروض والخصومات
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition">
                اشترك
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo size="small" />
            <span className="text-2xl font-bold">قصر الرضيع</span>
          </div>
          <p className="text-gray-400 mb-6">
            متجركم الموثوق لملابس وأدوات الأطفال والرضع
          </p>
          <div className="flex gap-6 justify-center text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition">من نحن</Link>
            <Link href="/contact" className="hover:text-white transition">اتصل بنا</Link>
            <Link href="/orders" className="hover:text-white transition">تتبع الطلب</Link>
          </div>
          <p className="text-gray-600 text-sm mt-8">
            © 2025 قصر الرضيع. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
