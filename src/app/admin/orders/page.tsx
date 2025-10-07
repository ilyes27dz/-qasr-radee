'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package, Eye, Search, RefreshCw, LogOut, Home,
  Clock, CheckCircle, Truck, XCircle,
  DollarSign, Phone, MapPin, Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'جاري التحضير', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'في الطريق', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'تم التسليم', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const priorityConfig = {
  low: { label: 'منخفضة', color: 'bg-gray-100 text-gray-700' },
  medium: { label: 'متوسطة', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'عالية', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'عاجلة', color: 'bg-red-100 text-red-700' },
};

export default function OrdersManagementPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    setUser(userData);

    if (userData.role !== 'admin' && !userData.permissions?.includes('orders')) {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    try {
      // قراءة الطلبات من localStorage
      const ordersData = JSON.parse(localStorage.getItem('orders') || '[]');
      
      console.log('📦 Orders loaded from localStorage:', ordersData.length);
      
      // ترتيب الطلبات من الأحدث للأقدم
      const sortedOrders = ordersData.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
      
      if (sortedOrders.length > 0) {
        toast.success(`تم تحميل ${sortedOrders.length} طلب ✅`);
      }
    } catch (error) {
      console.error('❌ Error loading orders:', error);
      toast.error('فشل تحميل الطلبات');
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // فلترة الطلبات عند تغيير البحث أو الحالة
  useEffect(() => {
    let filtered = [...orders];

    // فلترة حسب الحالة
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(o => o.status === selectedStatus);
    }

    // فلترة حسب البحث
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderNumber?.toLowerCase().includes(query) ||
        o.customerName?.toLowerCase().includes(query) ||
        o.customerPhone?.includes(query) ||
        o.customerEmail?.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [selectedStatus, searchQuery, orders]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      revenue: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0),
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <span className="text-lg font-bold text-gray-900">إدارة الطلبات</span>
                <p className="text-xs text-gray-500">{stats.total} طلب إجمالي</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="p-2 hover:bg-gray-50 rounded-lg transition"
                title="تحديث"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-50 rounded-lg">
                <Home className="w-5 h-5 text-gray-600" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">إجمالي</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">انتظار</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">تحضير</p>
                <p className="text-xl font-bold text-gray-900">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">الطريق</p>
                <p className="text-xl font-bold text-gray-900">{stats.shipped}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">مسلّم</p>
                <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">ملغي</p>
                <p className="text-xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs opacity-90">الإيرادات</p>
                <p className="text-xl font-bold">{stats.revenue.toLocaleString()} دج</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب، الاسم، أو الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                  selectedStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الكل ({orders.length})
              </button>
              {Object.entries(statusConfig).map(([key, config]) => {
                const count = orders.filter(o => o.status === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedStatus(key)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                      selectedStatus === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {config.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">رقم الطلب</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">العميل</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الهاتف</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الموقع</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الإجمالي</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الحالة</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">التاريخ</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20">
                      <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 font-bold">جاري التحميل...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-20">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-500 font-bold">
                        {orders.length === 0 ? 'لا توجد طلبات' : 'لا توجد نتائج للبحث'}
                      </p>
                      {orders.length === 0 && (
                        <p className="text-gray-400 mt-2">عندما يتم إنشاء طلبات ستظهر هنا</p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                    const StatusIcon = statusInfo?.icon || Clock;

                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4">
                          <div className="font-bold text-blue-600">{order.orderNumber}</div>
                          <div className="text-xs text-gray-500">
                            {order.items?.length || 0} منتج
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">{order.customerName}</div>
                          {order.customerEmail && (
                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-mono">{order.customerPhone}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-semibold">{order.wilaya}</div>
                              <div className="text-xs text-gray-500">{order.commune}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-lg text-gray-900">
                            {order.total?.toLocaleString() || 0} دج
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 w-fit ${statusInfo.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm">
                                {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString('ar-DZ', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold"
                          >
                            <Eye className="w-4 h-4" />
                            عرض
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
