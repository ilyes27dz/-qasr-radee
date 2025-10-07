'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight, Users, Phone, MapPin, Mail, ShoppingBag,
  Calendar, DollarSign, Package, Eye, LogOut, Home, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const customerPhone = decodeURIComponent(params?.id as string);

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    if (userData.role !== 'admin' && !userData.permissions?.includes('customers')) {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    fetchCustomerOrders();
  }, [customerPhone]);

  const fetchCustomerOrders = () => {
    setLoading(true);
    try {
      // قراءة جميع الطلبات من localStorage
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // تصفية طلبات هذا العميل فقط
      const customerOrders = allOrders
        .filter((order: any) => order.customerPhone === customerPhone)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      console.log('📦 Customer orders:', customerOrders.length);
      setOrders(customerOrders);
      
      if (customerOrders.length > 0) {
        toast.success('تم تحميل بيانات العميل ✅');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تحميل البيانات');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-bold mb-4">لا توجد طلبات لهذا العميل</p>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-bold"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للعملاء
          </Link>
        </div>
      </div>
    );
  }

  const customer = {
    phone: orders[0].customerPhone,
    name: orders[0].customerName,
    email: orders[0].customerEmail || '',
    wilaya: orders[0].wilaya,
    commune: orders[0].commune,
    address: orders[0].address,
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + (order.total || 0), 0),
    firstOrder: orders[orders.length - 1].createdAt,
    lastOrder: orders[0].createdAt,
  };

  const statusConfig: any = {
    pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'جاري التحضير', color: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'في الطريق', color: 'bg-purple-100 text-purple-700' },
    delivered: { label: 'تم التسليم', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/customers"
                className="p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchCustomerOrders}
                className="p-2 hover:bg-gray-50 rounded-lg transition"
                title="تحديث"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <Link 
                href="/admin/dashboard" 
                className="p-2 hover:bg-gray-50 rounded-lg transition"
                title="لوحة التحكم"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition"
                title="تسجيل الخروج"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Customer Info Sidebar */}
          <div className="space-y-6">
            {/* Main Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {customer.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                {customer.name}
              </h2>
              <p className="text-gray-500 text-center">
                عميل منذ {new Date(customer.firstOrder).toLocaleDateString('ar-DZ')}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">معلومات الاتصال</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">الهاتف</p>
                    <p className="font-bold text-gray-900 font-mono">{customer.phone}</p>
                  </div>
                </div>
                {customer.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                      <p className="font-bold text-gray-900">{customer.email}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">العنوان</p>
                    <p className="font-bold text-gray-900">{customer.wilaya} - {customer.commune}</p>
                    <p className="text-sm text-gray-600 mt-1">{customer.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">إحصائيات</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-600">إجمالي الطلبات</span>
                  </div>
                  <span className="font-bold text-xl text-gray-900">{customer.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-gray-600">إجمالي الإنفاق</span>
                  </div>
                  <span className="font-bold text-xl text-blue-600">
                    {customer.totalSpent.toLocaleString()} دج
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-600">آخر طلب</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {new Date(customer.lastOrder).toLocaleDateString('ar-DZ')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  طلبات العميل ({orders.length})
                </h2>
              </div>
              <div className="divide-y">
                {orders.map((order) => {
                  const statusInfo = statusConfig[order.status] || statusConfig.pending;
                  
                  return (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-bold text-blue-600 text-lg">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('ar-DZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items?.slice(0, 3).map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="font-bold text-gray-900">
                              {(item.price * item.quantity).toLocaleString()} دج
                            </span>
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <p className="text-sm text-blue-600 font-semibold">
                            +{order.items.length - 3} منتج إضافي
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-500">الإجمالي</p>
                          <p className="text-2xl font-black text-blue-600">
                            {order.total.toLocaleString()} دج
                          </p>
                        </div>
                        <Link
                          href={`/admin/orders`}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold"
                        >
                          <Eye className="w-4 h-4" />
                          عرض في الطلبات
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
