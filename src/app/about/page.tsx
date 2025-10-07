import Link from 'next/link';
import { Home, Heart, Shield, Truck, Award, User, ShoppingCart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group order-2 md:order-1">
              <span className="text-4xl">🍼</span>
              <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                قصر الرضيع
              </span>
            </Link>

            <div className="flex items-center gap-4 order-1 md:order-2">
              <Link href="/login">
                <User className="w-6 h-6 text-gray-600 hover:text-blue-600 transition" />
              </Link>
              <button className="relative">
                <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 transition" />
              </button>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-blue-600 transition" />
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex gap-8 mt-4 justify-center text-sm font-medium">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">الرئيسية</Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">المنتجات</Link>
            <Link href="/offers" className="text-gray-700 hover:text-blue-600 transition">العروض 🎁</Link>
            <Link href="/about" className="text-blue-600 hover:text-blue-700 transition">من نحن</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">اتصل بنا</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            من نحن
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            متجركم الموثوق المتخصص في ملابس وأدوات الأطفال والرضع في الجزائر
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="text-center mb-8">
              <span className="text-6xl mb-4 inline-block">🍼</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">قصتنا</h2>
            </div>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="text-blue-600 font-bold">قصر الرضيع</span> هو متجر إلكتروني
                متخصص في توفير أفضل وأجود المنتجات للأطفال والرضع في الجزائر.
              </p>
              <p>
                نؤمن بأن كل طفل يستحق الأفضل، لذلك نحرص على انتقاء منتجاتنا بعناية فائقة
                لضمان سلامة وراحة أطفالكم.
              </p>
              <p>
                مهمتنا هي توفير تجربة تسوق سهلة وآمنة للآباء والأمهات، مع توصيل سريع
                لجميع ولايات الجزائر وخدمة عملاء متميزة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            قيمنا ومميزاتنا
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">جودة عالية</h3>
              <p className="text-gray-600">
                منتجات آمنة ومضمونة ومختارة بعناية
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">توصيل سريع</h3>
              <p className="text-gray-600">
                نصل إلى جميع ولايات الجزائر
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">خدمة متميزة</h3>
              <p className="text-gray-600">
                نهتم براحتك ورضاك بشكل كامل
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">أسعار منافسة</h3>
              <p className="text-gray-600">
                أفضل الأسعار مع عروض دائمة
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            هل أنت مستعد للتسوق؟
          </h2>
          <p className="text-gray-600 mb-8">
            اكتشف مجموعتنا الواسعة من منتجات الأطفال والرضع
          </p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            تصفح المنتجات
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-3xl">🍼</span>
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
    </div>
  );
}
