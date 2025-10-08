'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock, Search, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import toast from 'react-hot-toast';

const orderStatuses = [
  { id: 1, status: 'pending', label: 'قيد الانتظار', icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300' },
  { id: 2, status: 'processing', label: 'جاري التحضير', icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-50', borderColor: 'border-blue-300' },
  { id: 3, status: 'shipped', label: 'في الطريق', icon: Truck, color: 'text-purple-500', bgColor: 'bg-purple-50', borderColor: 'border-purple-300' },
  { id: 4, status: 'delivered', label: 'تم التسليم', icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-300' },
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const orderNumberFromUrl = searchParams?.get('number');
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  
  const [orderNumber, setOrderNumber] = useState(orderNumberFromUrl || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (orderNumberFromUrl) {
      setOrderNumber(orderNumberFromUrl);
      fetchOrder(orderNumberFromUrl);
    }
  }, [orderNumberFromUrl]);

  const fetchOrder = async (orderNum: string) => {
  setLoading(true);
  setNotFound(false);
  setOrder(null);
  
  try {
    // ✅ جلب من MongoDB بدلاً من localStorage
    const response = await fetch('/api/orders');
    
    if (!response.ok) {
      throw new Error('فشل جلب الطلبات');
    }
    
    const orders = await response.json();
    console.log('📦 تم جلب الطلبات من MongoDB:', orders.length);
    
    const foundOrder = orders.find((o: any) => o.orderNumber === orderNum);
    
    if (foundOrder) {
      setOrder(foundOrder);
      console.log('✅ تم العثور على الطلب:', foundOrder);
      toast.success('تم العثور على الطلب! ✅');
    } else {
      setNotFound(true);
      console.log('❌ الطلب غير موجود:', orderNum);
      toast.error('لم يتم العثور على الطلب');
    }
  } catch (error: any) {
    console.error('❌ خطأ:', error);
    setNotFound(true);
    toast.error('حدث خطأ في البحث');
  } finally {
    setLoading(false);
  }
};


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      fetchOrder(orderNumber.trim());
    } else {
      toast.error('يرجى إدخال رقم الطلب');
    }
  };

  const getStatusIndex = (status: string) => {
    const statusMap: any = {
      'pending': 0,
      'processing': 1,
      'shipped': 2,
      'delivered': 3,
    };
    return statusMap[status] || 0;
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 font-arabic">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <Logo size="small" />
              <div>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-pink-600 transition block">
                  قصر الرضيع
                </span>
                <span className="text-xs text-gray-500 font-semibold">Baby Palace Store</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <UserMenu />
              <Link href="/wishlist" className="relative hover:scale-110 transition">
                <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 transition" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
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
      <section className="py-20 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 text-9xl animate-bounce-slow">📦</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-float">🚚</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              تتبع طلبك 📦
            </h1>
            <p className="text-2xl text-white/90 font-semibold drop-shadow-lg">
              تابع حالة طلبك بسهولة
            </p>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={handleSearch} className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200 animate-fade-in">
              <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">أدخل رقم الطلب</h2>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="QSR-XXXXX-XXXXX"
                    className="w-full px-5 py-4 pr-12 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition text-lg"
                    required
                  />
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-2xl font-black hover:from-purple-700 hover:to-indigo-700 transition shadow-xl hover:scale-105 disabled:opacity-50"
                >
                  {loading ? 'جاري البحث...' : 'بحث'}
                </button>
              </div>
            </form>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12 animate-fade-in">
              <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
              <p className="text-xl text-gray-600 font-bold">جاري البحث عن طلبك...</p>
            </div>
          )}

          {/* Not Found */}
          {notFound && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-9xl mb-6">😔</div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">لم يتم العثور على الطلب</h3>
              <p className="text-gray-600 text-lg">تأكد من رقم الطلب وحاول مرة أخرى</p>
            </div>
          )}

          {/* Order Details */}
          {order && !loading && (
            <div className="max-w-4xl mx-auto animate-slide-in">
              {/* Order Info */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200 mb-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 mb-2">
                      طلب رقم: {order.orderNumber}
                    </h3>
                    <p className="text-gray-600 text-lg font-medium">
                      تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-DZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-lg mb-2">المجموع الكلي</p>
                    <p className="text-4xl font-black text-blue-600">
                      {order.total.toLocaleString()} دج
                    </p>
                  </div>
                </div>

                {/* Order Status Timeline */}
                <div className="relative">
                  <div className="absolute top-8 right-0 left-0 h-1 bg-gray-200"></div>
                  <div 
                    className="absolute top-8 right-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-1000"
                    style={{ width: `${currentStatusIndex >= 0 ? (currentStatusIndex / (orderStatuses.length - 1)) * 100 : 0}%` }}
                  ></div>
                  
                  <div className="grid grid-cols-4 gap-4 relative">
                    {orderStatuses.map((statusItem, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const Icon = statusItem.icon;
                      
                      return (
                        <div key={statusItem.id} className="text-center">
                          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center border-4 transition-all duration-500 ${
                            isCompleted 
                              ? `${statusItem.bgColor} ${statusItem.borderColor}` 
                              : 'bg-gray-100 border-gray-300'
                          }`}>
                            <Icon className={`w-8 h-8 ${isCompleted ? statusItem.color : 'text-gray-400'}`} />
                          </div>
                          <p className={`text-sm font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {statusItem.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200 mb-8">
                <h3 className="text-3xl font-black text-gray-900 mb-6">المنتجات</h3>
                <div className="space-y-4">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{item.productName}</h4>
                        <p className="text-gray-600 font-medium">الكمية: {item.quantity}</p>
                      </div>
                      <p className="text-2xl font-black text-blue-600">
                        {(item.price * item.quantity).toLocaleString()} دج
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t-2 border-gray-200 flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">المجموع الفرعي:</span>
                  <span className="text-2xl font-black text-gray-900">
                    {order.subtotal?.toLocaleString()} دج
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold text-gray-700">الشحن:</span>
                  <span className="text-xl font-bold text-gray-700">
                    {order.shipping?.toLocaleString()} دج
                  </span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200">
                <h3 className="text-3xl font-black text-gray-900 mb-6">معلومات الشحن</h3>
                <div className="space-y-4 text-lg">
                  <p className="text-gray-700">
                    <span className="font-black">الاسم:</span> {order.customerName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-black">الهاتف:</span> {order.customerPhone}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-black">البريد الإلكتروني:</span> {order.customerEmail}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-black">الولاية:</span> {order.wilaya}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-black">البلدية:</span> {order.commune}
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 mt-4">
                    <p className="text-gray-700 font-black mb-2">العنوان الكامل:</p>
                    <p className="text-gray-900">{order.address}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200 mt-4">
                    <p className="text-gray-700 font-black mb-2">طريقة الدفع:</p>
                    <p className="text-gray-900">
                      {order.paymentMethod === 'cash' ? 'الدفع عند الاستلام 💵' : 'بطاقة بنكية 💳'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
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
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
