'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  DollarSign, TrendingUp, TrendingDown, ShoppingCart, Package,
  Users, Calendar, Download, RefreshCw, LogOut, Home, ArrowUpRight,
  Clock, BarChart3, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    if (userData.role !== 'admin' && !userData.permissions?.includes('analytics')) {
      toast.error('ليس لديك صلاحية الوصول للمالية');
      router.push('/admin/dashboard');
      return;
    }

    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const ordersData = await response.json();
      
      console.log('📦 Orders loaded from MongoDB:', ordersData.length);
      
      const sortedOrders = ordersData.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sortedOrders);
      
      if (sortedOrders.length > 0) {
        toast.success(`تم تحميل ${sortedOrders.length} طلب ✅`);
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
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

  const calculateRevenue = () => {
    if (!orders.length) return { 
      total: 0, 
      delivered: 0, 
      pending: 0,
      cancelled: 0,
      orderCount: 0,
      deliveredCount: 0 
    };
    
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const delivered = deliveredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    const pendingOrders = orders.filter(o => 
      o.status === 'pending' || 
      o.status === 'processing' || 
      o.status === 'shipped'
    );
    const pending = pendingOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    const cancelledOrders = orders.filter(o => o.status === 'cancelled');
    const cancelled = cancelledOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    const total = delivered + pending;

    return { 
      total, 
      delivered, 
      pending,
      cancelled,
      orderCount: orders.length,
      deliveredCount: deliveredOrders.length,
      pendingCount: pendingOrders.length,
      cancelledCount: cancelledOrders.length
    };
  };

  const getTopProducts = () => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};

    orders
      .filter(order => order.status === 'delivered')
      .forEach(order => {
        order.items?.forEach((item: any) => {
          if (!productSales[item.productName]) {
            productSales[item.productName] = {
              name: item.productName,
              quantity: 0,
              revenue: 0,
            };
          }
          productSales[item.productName].quantity += item.quantity || 0;
          productSales[item.productName].revenue += (item.price || 0) * (item.quantity || 0);
        });
      });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getRevenueByStatus = () => {
    const statusRevenue = {
      delivered: 0,
      shipped: 0,
      processing: 0,
      pending: 0,
      cancelled: 0,
    };

    orders.forEach(order => {
      const status = order.status as keyof typeof statusRevenue;
      if (statusRevenue[status] !== undefined) {
        statusRevenue[status] += order.total || 0;
      }
    });

    return statusRevenue;
  };

  const exportToCSV = () => {
    const revenue = calculateRevenue();
    const csvContent = [
      ['التقرير المالي - قصر الرضيع'],
      ['تاريخ التقرير: ' + new Date().toLocaleDateString('ar-DZ')],
      [''],
      ['الملخص المالي'],
      ['إجمالي الإيرادات المحتملة', revenue.total.toLocaleString() + ' دج'],
      ['الإيرادات المحققة (المسلّمة)', revenue.delivered.toLocaleString() + ' دج'],
      ['الإيرادات قيد المعالجة', revenue.pending.toLocaleString() + ' دج'],
      ['الطلبات الملغاة', revenue.cancelled.toLocaleString() + ' دج'],
      [''],
      ['عدد الطلبات الكلي', revenue.orderCount.toString()],
      ['الطلبات المسلّمة', revenue.deliveredCount.toString()],
  ['الطلبات قيد المعالجة', (revenue.pendingCount || 0).toString()],
['الطلبات الملغاة', (revenue.cancelledCount || 0).toString()],

      [''],
      ['تفاصيل الطلبات'],
      ['رقم الطلب', 'العميل', 'المبلغ', 'الحالة', 'التاريخ'],
      ...orders.map(order => [
        order.orderNumber || '',
        order.customerName || '',
        (order.total || 0).toLocaleString() + ' دج',
        order.status === 'pending' ? 'قيد الانتظار' :
        order.status === 'processing' ? 'جاري التحضير' :
        order.status === 'shipped' ? 'في الطريق' :
        order.status === 'delivered' ? 'تم التسليم' :
        order.status === 'cancelled' ? 'ملغي' : order.status,
        new Date(order.createdAt).toLocaleDateString('ar-DZ'),
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('تم تصدير التقرير ✅');
  };

  const revenue = calculateRevenue();
  const topProducts = getTopProducts();
  const revenueByStatus = getRevenueByStatus();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">التحليلات والمالية</h1>
                <p className="text-sm text-gray-500">مرحباً {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition font-semibold"
              >
                <Download className="w-5 h-5" />
                تصدير التقرير
              </button>

              <button
                onClick={fetchData}
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
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
              >
                <LogOut className="w-5 h-5" />
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                <TrendingUp className="w-4 h-4" />
                مُحققة
              </div>
            </div>
            <p className="text-white/80 text-sm mb-2">الإيرادات المحققة 💰</p>
            <p className="text-4xl font-black">{revenue.delivered.toLocaleString()} دج</p>
            <p className="text-white/70 text-xs mt-2">
              {revenue.deliveredCount} طلب مسلّم فقط
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                قيد المعالجة
              </div>
            </div>
            <p className="text-white/80 text-sm mb-2">الإيرادات المنتظرة ⏳</p>
            <p className="text-4xl font-black">{revenue.pending.toLocaleString()} دج</p>
            <p className="text-white/70 text-xs mt-2">
              {revenue.pendingCount} طلب قيد المعالجة
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                <BarChart3 className="w-4 h-4" />
                إجمالي
              </div>
            </div>
            <p className="text-white/80 text-sm mb-2">إجمالي الإيرادات 📊</p>
            <p className="text-4xl font-black">{revenue.total.toLocaleString()} دج</p>
            <p className="text-white/70 text-xs mt-2">
              {revenue.orderCount} طلب (بدون الملغي)
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">مسلّم</p>
                <p className="text-xl font-bold text-gray-900">{revenue.deliveredCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">قيد المعالجة</p>
                <p className="text-xl font-bold text-gray-900">{revenue.pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">ملغي</p>
                <p className="text-xl font-bold text-gray-900">{revenue.cancelledCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">إجمالي الطلبات</p>
                <p className="text-xl font-bold text-gray-900">{revenue.orderCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              الإيرادات حسب الحالة
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">تم التسليم ✅</span>
                  <span className="text-lg font-black text-green-600">
                    {revenueByStatus.delivered.toLocaleString()} دج
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${revenue.total > 0 ? (revenueByStatus.delivered / revenue.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">في الطريق 🚚</span>
                  <span className="text-lg font-black text-purple-600">
                    {revenueByStatus.shipped.toLocaleString()} دج
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${revenue.total > 0 ? (revenueByStatus.shipped / revenue.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">جاري التحضير 📦</span>
                  <span className="text-lg font-black text-blue-600">
                    {revenueByStatus.processing.toLocaleString()} دج
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${revenue.total > 0 ? (revenueByStatus.processing / revenue.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">قيد الانتظار ⏳</span>
                  <span className="text-lg font-black text-yellow-600">
                    {revenueByStatus.pending.toLocaleString()} دج
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all"
                    style={{ width: `${revenue.total > 0 ? (revenueByStatus.pending / revenue.total) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">ملغي ❌</span>
                  <span className="text-lg font-black text-red-600">
                    {revenueByStatus.cancelled.toLocaleString()} دج
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${revenue.total > 0 ? (revenueByStatus.cancelled / (revenue.total + revenueByStatus.cancelled)) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600" />
              أفضل المنتجات مبيعاً
            </h3>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-black text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">مباع: {product.quantity} قطعة</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-blue-600">
                        {product.revenue.toLocaleString()} دج
                      </p>
                      <p className="text-xs text-gray-500">الإيرادات</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد مبيعات بعد</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              الطلبات الأخيرة ({orders.length})
            </h3>
            <Link
              href="/admin/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
            >
              عرض الكل
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right text-gray-600 font-semibold p-3 text-sm">رقم الطلب</th>
                    <th className="text-right text-gray-600 font-semibold p-3 text-sm">العميل</th>
                    <th className="text-right text-gray-600 font-semibold p-3 text-sm">المبلغ</th>
                    <th className="text-right text-gray-600 font-semibold p-3 text-sm">الحالة</th>
                    <th className="text-right text-gray-600 font-semibold p-3 text-sm">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="p-3 text-blue-600 font-semibold text-sm">{order.orderNumber}</td>
                      <td className="p-3 text-gray-900 text-sm">{order.customerName}</td>
                      <td className="p-3 text-gray-900 font-bold text-sm">{(order.total || 0).toLocaleString()} دج</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'pending' ? 'قيد الانتظار' :
                           order.status === 'processing' ? 'جاري التحضير' :
                           order.status === 'shipped' ? 'في الطريق' :
                           order.status === 'delivered' ? 'تم التسليم' :
                           order.status === 'cancelled' ? 'ملغي' : order.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-bold">لا توجد طلبات بعد</p>
            </div>
          )}
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
