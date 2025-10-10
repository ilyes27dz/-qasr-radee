'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Shield, Truck, Award, Star, Sparkles, Users, Home } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import UserMenu from '@/components/UserMenu';

export default function AboutPage() {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo size="small" variant="text" />
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-2 sm:px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition font-semibold text-xs sm:text-sm"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">المتجر</span>
              </Link>
              
              <UserMenu />
              
              <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
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
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <Image 
              src="/LOGO.jpg" 
              alt="قصر الرضيع" 
              width={120} 
              height={120}
              className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-2xl shadow-xl"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 sm:mb-6">
            من نحن
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            متجركم الموثوق المتخصص في ملابس وأدوات الأطفال والرضع في الجزائر 🇩🇿
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-blue-100 shadow-lg hover:shadow-xl transition">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-block mb-4">
                <Image 
                  src="/LOGO.jpg" 
                  alt="قصر الرضيع" 
                  width={80} 
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                قصتنا
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              </h2>
            </div>
            <div className="space-y-4 text-gray-700 text-base sm:text-lg leading-relaxed">
              <p className="bg-blue-50 p-4 rounded-xl border-r-4 border-blue-600">
                <span className="text-blue-600 font-black text-xl">قصر الرضيع</span> هو متجر إلكتروني
                متخصص في توفير أفضل وأجود المنتجات للأطفال والرضع في الجزائر 🇩🇿
              </p>
              <p className="bg-purple-50 p-4 rounded-xl border-r-4 border-purple-600">
                <span className="font-bold text-purple-600">🌟 مهمتنا:</span> نؤمن بأن كل طفل يستحق الأفضل، 
                لذلك نحرص على انتقاء منتجاتنا بعناية فائقة لضمان سلامة وراحة أطفالكم.
              </p>
              <p className="bg-pink-50 p-4 rounded-xl border-r-4 border-pink-600">
                <span className="font-bold text-pink-600">🎯 هدفنا:</span> توفير تجربة تسوق سهلة وآمنة 
                للآباء والأمهات، مع توصيل سريع لجميع ولايات الجزائر وخدمة عملاء متميزة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8 sm:mb-12 flex items-center justify-center gap-3">
            <Star className="w-8 h-8 text-yellow-500" />
            قيمنا ومميزاتنا
            <Star className="w-8 h-8 text-yellow-500" />
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-2 border-blue-200 text-center hover:shadow-xl hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">جودة عالية</h3>
              <p className="text-gray-700 font-semibold">
                منتجات آمنة ومضمونة ومختارة بعناية ✅
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200 text-center hover:shadow-xl hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">توصيل سريع</h3>
              <p className="text-gray-700 font-semibold">
                نصل إلى جميع ولايات الجزائر 🚚
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border-2 border-red-200 text-center hover:shadow-xl hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">خدمة متميزة</h3>
              <p className="text-gray-700 font-semibold">
                نهتم براحتك ورضاك بشكل كامل 💚
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border-2 border-yellow-200 text-center hover:shadow-xl hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">أسعار منافسة</h3>
              <p className="text-gray-700 font-semibold">
                أفضل الأسعار مع عروض دائمة 🎁
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black mb-2">1000+</div>
              <div className="text-blue-100 font-semibold">منتج متنوع</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black mb-2">5000+</div>
              <div className="text-blue-100 font-semibold">عميل سعيد</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black mb-2">58</div>
              <div className="text-blue-100 font-semibold">ولاية</div>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black mb-2">24/7</div>
              <div className="text-blue-100 font-semibold">دعم العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-5xl sm:text-6xl mb-6">🛍️</div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 sm:mb-6">
              هل أنت مستعد للتسوق؟
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              اكتشف مجموعتنا الواسعة من منتجات الأطفال والرضع عالية الجودة
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-black hover:from-blue-700 hover:to-indigo-700 transition shadow-xl hover:shadow-2xl hover:scale-105"
            >
              تصفح المنتجات 🚀
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
