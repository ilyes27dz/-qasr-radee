'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin, Phone, User, Home, Calendar, DollarSign } from 'lucide-react';
import Header from '@/components/Header';
import toast from 'react-hot-toast';

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // ✅ جلب رقم الطلب من URL
  useEffect(() => {
    const numberFromUrl = searchParams.get('number');
    if (numberFromUrl) {
      setOrderNumber(numberFromUrl);
      // البحث تلقائياً
      searchByOrderNumber(numberFromUrl);
    }
  }, [searchParams]);

  // ✅ البحث برقم الطلب
  const searchByOrderNumber = async (number: string) => {
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: number }),
      });

      if (response.ok) {
        const foundOrder = await response.json();
        setOrder(foundOrder);
        console.log('✅ Order found:', foundOrder);
        toast.success('تم العثور على الطلب! 🎉', { duration: 1000 });
      } else {
        setOrder(null);
        toast.error('رقم الطلب غير صحيح ❌', { duration: 1000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء البحث');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim() && !phoneNumber.trim()) {
      toast.error('الرجاء إدخال رقم الطلب أو رقم الهاتف');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: orderNumber.trim() || undefined,
          phone: phoneNumber.trim() || undefined,
        }),
      });

      if (response.ok) {
        const foundOrder = await response.json();
        setOrder(foundOrder);
        console.log('✅ Order found:', foundOrder);
        toast.success('تم العثور على الطلب! 🎉', { duration: 1000 });
      } else {
        setOrder(null);
        toast.error('رقم الطلب أو الهاتف غير صحيح ❌', { duration: 1000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء البحث');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: any = {
    pending: {
      label: 'قيد الانتظار',
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      description: 'طلبك قيد المراجعة',
    },
    processing: {
      label: 'جاري التحضير',
      icon: Package,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      description: 'نقوم بتحضير طلبك الآن',
    },
    shipped: {
      label: 'في الطريق',
      icon: Truck,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      description: 'طلبك في طريقه إليك',
    },
    delivered: {
      label: 'تم التسليم',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-700 border-green-300',
      description: 'تم تسليم طلبك بنجاح',
    },
    cancelled: {
      label: 'ملغي',
      icon: XCircle,
      color: 'bg-red-100 text-red-700 border-red-300',
      description: 'تم إلغاء الطلب',
    },
  };

  const currentStatus = order ? statusConfig[order.status] || statusConfig.pending : null;
  const StatusIcon = currentStatus?.icon;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-arabic py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-xl">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                تتبع طلبك
              </h1>
              <p className="text-xl text-gray-600">
                أدخل رقم الطلب أو رقم الهاتف لمعرفة حالة طلبك
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200 mb-8">
              <form onSubmit={handleSearch} className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    رقم الطلب
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="مثال: ORD-1234567890"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
                  />
                </div>

                <div className="text-center text-gray-500 font-bold">أو</div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="مثال: 0555000000"
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-xl font-black text-xl hover:from-blue-700 hover:to-purple-700 transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      جاري البحث...
                    </>
                  ) : (
                    <>
                      <Search className="w-6 h-6" />
                      تتبع الطلب
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Details */}
            {searched && !loading && (
              order ? (
                <div className="space-y-6 animate-fade-in">
                  {/* Status Card */}
                  <div className={`rounded-3xl p-8 border-2 ${currentStatus.color} shadow-xl`}>
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        {StatusIcon && <StatusIcon className="w-12 h-12" />}
                        <div>
                          <h3 className="text-2xl font-black">{currentStatus.label}</h3>
                          <p className="text-sm opacity-80">{currentStatus.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-70">رقم الطلب</p>
                        <p className="text-xl font-bold">{order.orderNumber}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="flex justify-between mb-2">
                        {Object.entries(statusConfig).slice(0, 4).map(([key, config]: any, index) => (
                          <div key={key} className="text-center flex-1">
                            <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                              order.status === key || index < Object.keys(statusConfig).indexOf(order.status)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-400'
                            }`}>
                              <config.icon className="w-5 h-5" />
                            </div>
                            <p className="text-xs font-semibold">{config.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
                    <h3 className="text-2xl font-black text-gray-900 mb-6">تفاصيل الطلب</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <User className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">اسم العميل</p>
                            <p className="text-lg font-bold text-gray-900">{order.customerName}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">رقم الهاتف</p>
                            <p className="text-lg font-bold text-gray-900">{order.customerPhone}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">العنوان</p>
                            <p className="text-lg font-bold text-gray-900">
                              {order.wilaya} - {order.commune}
                            </p>
                            <p className="text-sm text-gray-600">{order.address}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <p className="text-sm text-blue-600">تاريخ الطلب</p>
                          </div>
                          <p className="text-lg font-bold text-blue-900">
                            {new Date(order.createdAt).toLocaleDateString('ar-DZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>

                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <p className="text-sm text-green-600">المبلغ الإجمالي</p>
                          </div>
                          <p className="text-3xl font-black text-green-700">
                            {order.total?.toLocaleString() || 0} دج
                          </p>
                          <div className="mt-2 text-xs text-green-600">
                            <p>المجموع الفرعي: {order.subtotal?.toLocaleString() || 0} دج</p>
                            <p>الشحن: {order.shippingCost?.toLocaleString() || 0} دج</p>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Package className="w-4 h-4 text-purple-600" />
                            <p className="text-sm text-purple-600">عدد المنتجات</p>
                          </div>
                          <p className="text-xl font-bold text-purple-900">
                            {order.items?.length || 0} منتج
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products */}
                  {order.items && order.items.length > 0 && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200">
                      <h3 className="text-2xl font-black text-gray-900 mb-6">المنتجات</h3>
                      <div className="space-y-4">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl">
                                📦
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{item.productName}</p>
                                <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                                <p className="text-xs text-gray-400">السعر: {item.price?.toLocaleString()} دج</p>
                              </div>
                            </div>
                            <p className="text-xl font-bold text-blue-600">
                              {((item.price || 0) * (item.quantity || 0)).toLocaleString()} دج
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 flex-wrap">
                    <Link
                      href="/"
                      className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-xl flex items-center justify-center gap-2"
                    >
                      <Home className="w-5 h-5" />
                      العودة للرئيسية
                    </Link>
                    <Link
                      href="/products"
                      className="flex-1 min-w-[200px] bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <Package className="w-5 h-5" />
                      تصفح المنتجات
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 rounded-3xl p-12 text-center border-2 border-red-200">
                  <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    لم يتم العثور على الطلب
                  </h3>
                  <p className="text-gray-600 mb-6">
                    تأكد من رقم الطلب أو رقم الهاتف وحاول مرة أخرى
                  </p>
                  <button
                    onClick={() => {
                      setSearched(false);
                      setOrder(null);
                      setOrderNumber('');
                      setPhoneNumber('');
                    }}
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
                  >
                    بحث مرة أخرى
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </>
  );
}
