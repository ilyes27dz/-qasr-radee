'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, CheckCircle, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import { formatPrice, ALGERIAN_WILAYAS, generateOrderNumber } from '@/lib/utils';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // جلب بيانات المستخدم
    try {
      const userData = localStorage.getItem('customer_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    wilaya: '',
    commune: '',
    address: '',
    paymentMethod: 'cash_on_delivery',
    notes: '',
  });

  const shippingCost = 500;
  const cartTotal = getCartTotal();
  const total = cartTotal + shippingCost;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  if (!formData.fullName || !formData.phone || !formData.wilaya || !formData.commune || !formData.address) {
    toast.error('يرجى ملء جميع الحقول المطلوبة');
    setLoading(false);
    return;
  }

  try {
    // ✅ إرسال الطلب للـ API
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: formData.fullName,
        customerEmail: user?.email || formData.email || '',
        customerPhone: formData.phone,
        address: formData.address,
        wilaya: formData.wilaya,
        commune: formData.commune,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        subtotal: cartTotal,
        shippingCost: shippingCost,
        total: total,
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.nameAr,
          quantity: item.quantity,
          price: item.product.salePrice || item.product.price,
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'فشل إنشاء الطلب');
    }

    console.log('✅ تم حفظ الطلب في MongoDB:', data.order.orderNumber);

    // مسح السلة
    clearCart();

    // رسالة النجاح
    toast.success('تم إرسال طلبك بنجاح! سنتصل بك قريباً ✅', {
      duration: 5000,
    });

    // التوجيه لصفحة الطلب
    router.push(`/orders?number=${data.order.orderNumber}`);
  } catch (error: any) {
    console.error('❌ Order error:', error);
    toast.error(error.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center font-arabic">
        <div className="text-center animate-fade-in">
          <div className="text-[200px] mb-8 animate-bounce-slow">🛒</div>
          <h2 className="text-5xl font-black text-gray-900 mb-6">السلة فارغة</h2>
          <p className="text-gray-600 text-xl mb-10">أضف منتجات للسلة أولاً</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-full hover:from-blue-700 hover:to-indigo-700 transition font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 text-lg"
          >
            <ShoppingCart className="w-6 h-6" />
            تصفح المنتجات
          </Link>
        </div>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
          .font-arabic { font-family: 'Cairo', sans-serif !important; }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-arabic">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group order-2 md:order-1">
              <Logo size="small" />
              <div>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-pink-600 transition block">
                  قصر الرضيع
                </span>
                <span className="text-xs text-gray-500 font-semibold">Baby Palace Store</span>
              </div>
            </Link>

            <div className="flex items-center gap-4 order-1 md:order-2">
              <UserMenu />
              <Link href="/wishlist" className="relative hover:scale-110 transition">
                <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 transition" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative hover:scale-110 transition">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-blue-600 transition" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 text-9xl animate-bounce-slow">✅</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-float">🎉</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              إتمام الطلب ✅
            </h1>
            <p className="text-2xl text-white/90 font-semibold drop-shadow-lg">
              املأ البيانات لإتمام طلبك
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Info */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition animate-slide-in">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">معلومات الشحن</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-3 font-bold text-lg">الاسم الكامل *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3 font-bold text-lg">رقم الهاتف *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                      placeholder="0555 00 00 00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3 font-bold text-lg">الولاية *</label>
                    <select
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                      required
                    >
                      <option value="">اختر الولاية</option>
                      {ALGERIAN_WILAYAS.map((wilaya) => (
                        <option key={wilaya} value={wilaya}>
                          {wilaya}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-3 font-bold text-lg">البلدية *</label>
                    <input
                      type="text"
                      name="commune"
                      value={formData.commune}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                      placeholder="أدخل اسم البلدية"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-3 font-bold text-lg">العنوان التفصيلي *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                      placeholder="أدخل عنوانك بالتفصيل"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-3 font-bold text-lg">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                      placeholder="أي ملاحظات أو تعليمات خاصة"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl hover:shadow-2xl transition animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">طريقة الدفع</h2>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center gap-5 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-3xl cursor-pointer hover:shadow-lg transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleChange}
                      className="w-6 h-6"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">💰</span>
                        <span className="text-gray-900 font-black text-xl">الدفع عند الاستلام</span>
                      </div>
                      <p className="text-gray-600 text-base mt-2 font-medium">
                        ادفع نقداً عند استلام المنتج
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-5 p-6 bg-gray-50 border-2 border-gray-200 rounded-3xl cursor-not-allowed opacity-60">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="chargily_pay"
                      disabled
                      className="w-6 h-6"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">💳</span>
                        <span className="text-gray-600 font-bold text-xl">الدفع الإلكتروني</span>
                        <span className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full font-bold">
                          قريباً
                        </span>
                      </div>
                      <p className="text-gray-500 text-base mt-2 font-medium">
                        الدفع ببطاقة بنكية (Chargily Pay)
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 border-2 border-blue-200 shadow-2xl sticky top-24 animate-fade-in">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                  ملخص الطلب
                </h2>

                <div className="space-y-4 mb-8 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-gray-600 bg-white p-4 rounded-2xl shadow-sm">
                      <span className="text-base font-bold">
                        {item.product.nameAr} × {item.quantity}
                      </span>
                      <span className="text-base font-black">
                        {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-blue-200 pt-6 space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600 text-lg">
                    <span className="font-semibold">المجموع الفرعي</span>
                    <span className="font-black">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-lg">
                    <span className="font-semibold">تكلفة الشحن</span>
                    <span className="font-black">{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="border-t-2 border-blue-200 pt-4">
                    <div className="flex justify-between text-3xl font-black text-gray-900">
                      <span>المجموع الكلي</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-black hover:from-green-700 hover:to-emerald-700 transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-lg"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin text-2xl">⏳</span>
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>تأكيد الطلب</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Logo size="small" />
            <span className="text-3xl font-black">قصر الرضيع</span>
          </div>
          <p className="text-gray-400 mb-8 text-lg">
            متجركم الموثوق لملابس وأدوات الأطفال والرضع
          </p>
          <div className="flex gap-8 justify-center text-sm text-gray-400 font-semibold">
            <Link href="/about" className="hover:text-white transition hover:scale-110">من نحن</Link>
            <Link href="/contact" className="hover:text-white transition hover:scale-110">اتصل بنا</Link>
            <Link href="/orders/track" className="hover:text-white transition hover:scale-110">تتبع الطلب</Link>
          </div>
          <p className="text-gray-600 text-sm mt-10">
            © 2025 قصر الرضيع. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
