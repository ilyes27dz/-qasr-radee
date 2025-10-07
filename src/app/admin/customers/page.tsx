'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Search, RefreshCw, LogOut, Home, Phone, MapPin,
  ShoppingBag, Eye, Calendar, Mail, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

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

    setUser(userData);
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    try {
      // قراءة الطلبات من localStorage
      const ordersData = JSON.parse(localStorage.getItem('orders') || '[]');
      console.log('📦 Orders loaded:', ordersData.length);
      setOrders(ordersData);
      
      if (ordersData.length > 0) {
        toast.success('تم تحميل البيانات ✅');
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

  // استخراج العملاء الفريدين
  const getCustomers = () => {
    const customersMap = new Map();

    orders.forEach(order => {
      const phone = order.customerPhone;
      if (customersMap.has(phone)) {
        const existing = customersMap.get(phone);
        existing.orders.push(order);
        existing.totalSpent += order.total || 0;
        existing.lastOrder = new Date(order.createdAt) > new Date(existing.lastOrder)
          ? order.createdAt
          : existing.lastOrder;
      } else {
        customersMap.set(phone, {
          phone: order.customerPhone,
          name: order.customerName,
          email: order.customerEmail || '',
          wilaya: order.wilaya,
          commune: order.commune,
          orders: [order],
          totalSpent: order.total || 0,
          firstOrder: order.createdAt,
          lastOrder: order.createdAt,
        });
      }
    });

    return Array.from(customersMap.values());
  };

  const customers = getCustomers();
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة العملاء</h1>
                <p className="text-sm text-gray-500">{customers.length} عميل</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">إجمالي العملاء</p>
                <p className="text-xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">إجمالي الطلبات</p>
                <p className="text-xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">عملاء جدد</p>
                <p className="text-xl font-bold text-gray-900">
                  {customers.filter(c => {
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return new Date(c.firstOrder) >= weekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">متوسط الطلبات</p>
                <p className="text-xl font-bold text-gray-900">
                  {customers.length > 0 ? (orders.length / customers.length).toFixed(1) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن عميل بالاسم، الهاتف، أو الإيميل..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">العميل</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">معلومات الاتصال</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الموقع</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الطلبات</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">إجمالي الإنفاق</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">آخر طلب</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">جاري التحميل...</p>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-500 font-bold">
                        {searchQuery ? 'لا توجد نتائج' : 'لا يوجد عملاء بعد'}
                      </p>
                      {!searchQuery && (
                        <p className="text-sm text-gray-500 mt-2">
                          العملاء سيظهرون هنا بعد إنشاء طلبات
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers
                    .sort((a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime())
                    .map((customer, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500">
                              عميل منذ {new Date(customer.firstOrder).toLocaleDateString('ar-DZ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-mono text-sm">{customer.phone}</span>
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{customer.email}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-semibold text-sm">{customer.wilaya}</p>
                            <p className="text-xs text-gray-500">{customer.commune}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-gray-400" />
                          <span className="font-bold text-lg">{customer.orders.length}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-lg text-blue-600">
                          {customer.totalSpent.toLocaleString()} دج
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(customer.lastOrder).toLocaleDateString('ar-DZ')}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/customers/${encodeURIComponent(customer.phone)}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          عرض
                        </Link>
                      </td>
                    </tr>
                  ))
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
