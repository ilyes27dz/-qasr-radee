'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Image from 'next/image';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, Settings, 
  DollarSign, LogOut, Home, RefreshCw, FileText,
  BarChart3, UserCog, ArrowUpRight, Bell,
  Moon, Sun, Download, Link2, Star, Gift, Menu, X, MessageSquare
} from 'lucide-react';


import NotificationBell from '@/components/NotificationBell';
import toast from 'react-hot-toast';
import { getAvailablePages, getAvailableStats } from '@/lib/permissions';

const icons: any = {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  FileText,
  UserCog,
  Settings,
  BarChart3,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [availablePages, setAvailablePages] = useState<any[]>([]);
  const [availableStats, setAvailableStats] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showStaffLinks, setShowStaffLinks] = useState(false);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }
    
    const userData = JSON.parse(adminUser);
    setUser(userData);

    const pages = getAvailablePages(userData.role, userData.permissions || []);
    setAvailablePages(pages);

    const statsPermissions = getAvailableStats(userData.role, userData.permissions || []);
    setAvailableStats(statsPermissions);

    const savedDarkMode = localStorage.getItem('admin_dark_mode');
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    fetchStats();
    
    if (userData.role === 'admin') {
      fetchStaffList();
    }
  }, [router]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      const data = await response.json();
      
      console.log('✅ Stats loaded from MongoDB:', data);
      setStats(data);
      
      if (data.totalOrders > 0) {
  toast.success('تم تحديث الإحصائيات ✅', {
    duration: 1000, // 1 ثانية فقط
  });
}

    } catch (error) {
      console.error('❌ Error loading stats:', error);
      toast.error('فشل تحميل الإحصائيات');
      
      setStats({
        totalSales: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        recentOrders: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const users = await response.json();
      const employees = users.filter((u: any) => u.role !== 'admin');
      setStaffList(employees);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaffList([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج بنجاح');
    router.push('/staff/login');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('admin_dark_mode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      toast.success('تم تفعيل الوضع الليلي 🌙');
    } else {
      document.documentElement.classList.remove('dark');
      toast.success('تم تفعيل الوضع النهاري ☀️');
    }
  };

  const exportAllInvoices = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      const ordersData = await response.json();
      
      if (ordersData.length === 0) {
        toast.error('لا توجد طلبات لتصديرها');
        return;
      }

      const csvContent = [
        ['تقرير الفواتير - قصر الرضيع'],
        ['تاريخ التقرير: ' + new Date().toLocaleDateString('ar-DZ')],
        [''],
        ['رقم الطلب', 'العميل', 'الهاتف', 'الولاية', 'المبلغ', 'الحالة', 'التاريخ'],
        ...ordersData.map((order: any) => [
          order.orderNumber || '',
          order.customerName || '',
          order.customerPhone || '',
          order.wilaya || '',
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
      link.download = `all-invoices-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toast.success(`تم تصدير ${ordersData.length} فاتورة ✅`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تصدير الفواتير');
    }
  };

  const allStatsCards = [
    { 
      key: 'totalSales',
      label: 'إجمالي المبيعات المحققة', 
      value: stats?.totalSales ? `${stats.totalSales.toLocaleString()} دج` : '0 دج',
      icon: DollarSign, 
      color: 'from-emerald-500 to-teal-600', 
      change: '+12.5%',
      trend: 'up',
    },
    { 
      key: 'totalOrders',
      label: 'إجمالي الطلبات', 
      value: stats?.totalOrders || '0',
      icon: ShoppingCart, 
      color: 'from-blue-500 to-indigo-600', 
      change: '+8.2%',
      trend: 'up',
    },
    { 
      key: 'pendingOrders',
      label: 'الطلبات الجديدة', 
      value: stats?.pendingOrders || '0',
      icon: Bell, 
      color: 'from-orange-500 to-red-600', 
      change: '+5',
      trend: 'up',
    },
    { 
      key: 'totalProducts',
      label: 'المنتجات', 
      value: stats?.totalProducts || '0',
      icon: Package, 
      color: 'from-purple-500 to-pink-600', 
      change: '+2',
      trend: 'up',
    },
    { 
      key: 'totalCustomers',
      label: 'العملاء', 
      value: stats?.totalCustomers || '0',
      icon: Users, 
      color: 'from-cyan-500 to-blue-600', 
      change: '+23',
      trend: 'up',
    },
  ];

  const statsCards = user?.role === 'admin' 
    ? allStatsCards 
    : allStatsCards.filter(card => {
        if (card.key.includes('Sales') || card.key.includes('revenue')) {
          return availableStats.includes('totalSales');
        }
        if (card.key.includes('Order')) {
          return availableStats.includes('totalOrders');
        }
        if (card.key.includes('Product')) {
          return availableStats.includes('totalProducts');
        }
        if (card.key.includes('Customer')) {
          return availableStats.includes('totalCustomers');
        }
        return false;
      });

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className={`text-xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-arabic transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
    <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40 shadow-sm transition-colors duration-300`}>
  <div className="container mx-auto px-4 py-3">
    <div className="flex items-center justify-between overflow-visible">

            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <Image 
                  src="/LOGO.jpg" 
                  alt="قصر الرضيع" 
                  width={40} 
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg"
                />
                <div>
                  <span className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'} transition block`}>
                    قصر الرضيع
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>
                    {user?.role === 'admin' ? 'لوحة التحكم - مدير' : `لوحة التحكم - ${user?.department || 'موظف'}`}
                  </span>
                </div>
              </Link>

              {/* زر القائمة للموبايل */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`lg:hidden p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <Menu className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>

<div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title={darkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <button
                onClick={exportAllInvoices}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm font-semibold ${
                  darkMode 
                    ? 'bg-green-900/20 text-green-400 hover:bg-green-900/30' 
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
                title="تصدير جميع الفواتير"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">الفواتير</span>
              </button>

              {user?.role === 'admin' && (
                
                <div className="relative">
                  <button
                    onClick={() => setShowStaffLinks(!showStaffLinks)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition text-sm font-semibold ${
                      darkMode 
                        ? 'bg-purple-900/20 text-purple-400 hover:bg-purple-900/30' 
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                    }`}
                    title="روابط الموظفين"
                  >
                    <UserCog className="w-4 h-4" />
                    <span className="hidden md:inline">الموظفين</span>
                  </button>

                  {showStaffLinks && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowStaffLinks(false)}
                      />
                      
                      <div className={`absolute left-0 mt-2 w-72 rounded-xl shadow-2xl border p-4 z-50 ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            روابط دخول الموظفين 🔗
                          </h3>
                          <button
                            onClick={() => setShowStaffLinks(false)}
                            className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            ✕
                          </button>
                        </div>
                        
                        {staffList.length > 0 ? (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {staffList.map((s: any) => (
                              <div 
                                key={s.id} 
                                className={`p-3 rounded-lg transition ${
                                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {s.name}
                                </p>
                                <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {s.email}
                                </p>
                                <p className={`text-xs mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold`}>
                                  القسم: {s.department || 'موظف'}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  <Link
                                    href={`/staff/login?email=${s.email}`}
                                    className={`text-xs hover:underline flex items-center gap-1 ${
                                      darkMode ? 'text-blue-400' : 'text-blue-600'
                                    }`}
                                    target="_blank"
                                  >
                                    <Link2 className="w-3 h-3" />
                                    فتح رابط الدخول
                                  </Link>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`${window.location.origin}/staff/login?email=${s.email}`);
                                      toast.success('تم نسخ الرابط ✅');
                                    }}
                                    className={`text-xs hover:underline ${
                                      darkMode ? 'text-green-400' : 'text-green-600'
                                    }`}
                                  >
                                    📋 نسخ
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <UserCog className={`w-12 h-12 mx-auto mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              لا يوجد موظفين
                            </p>
                            <Link
                              href="/admin/staff"
                              className={`text-xs hover:underline mt-2 inline-block ${
                                darkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}
                            >
                              إضافة موظف جديد →
                            </Link>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={fetchStats}
                className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                title="تحديث"
              >
                <RefreshCw className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>

              <NotificationBell />

              <Link 
                href="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  darkMode 
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">المتجر</span>
              </Link>

              <div className={`hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.email}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className={`p-2 rounded-lg transition ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                title="تسجيل الخروج"
              >
                <LogOut className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
          
          <div className={`fixed top-0 right-0 h-full w-72 z-50 lg:hidden transition-transform duration-300 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-2xl overflow-y-auto`}>
            <div className={`flex items-center justify-between p-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                القائمة
              </h3>
              <button
                onClick={() => setShowMobileMenu(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>

            <nav className="p-4 space-y-2">
              {availablePages.map((page) => {
                const Icon = icons[page.icon] || LayoutDashboard;
                
                return (
                  <Link
                    key={page.id}
                    href={page.path}
                    onClick={() => setShowMobileMenu(false)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      darkMode 
                        ? 'text-gray-300 hover:bg-blue-900/20 hover:text-blue-400' 
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{page.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className={`m-4 p-3 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <div className="flex items-center gap-2">
                {user?.role === 'admin' ? (
                  <>
                    <UserCog className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                      مدير النظام
                    </span>
                  </>
                ) : (
                  <>
                    <Users className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={`text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                      موظف
                    </span>
                  </>
                )}
              </div>
              {user?.department && (
                <p className={`text-xs mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  قسم: {user.department}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
            <div className={`rounded-2xl p-4 shadow-sm border sticky top-24 transition-colors duration-300 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <nav className="space-y-2">
                {availablePages.map((page) => {
                  const Icon = icons[page.icon] || LayoutDashboard;
                  
                  return (
                    <Link
                      key={page.id}
                      href={page.path}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                        darkMode 
                          ? 'text-gray-300 hover:bg-blue-900/20 hover:text-blue-400' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold text-sm flex-1 text-right">{page.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className={`mt-4 p-3 rounded-xl ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <div className="flex items-center gap-2">
                  {user?.role === 'admin' ? (
                    <>
                      <UserCog className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        مدير النظام
                      </span>
                    </>
                  ) : (
                    <>
                      <Users className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <span className={`text-sm font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        موظف
                      </span>
                    </>
                  )}
                </div>
                {user?.department && (
                  <p className={`text-xs mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    قسم: {user.department}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className={`rounded-2xl p-6 mb-6 text-white transition-colors duration-300 ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-700 to-indigo-800' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              <h2 className="text-2xl font-black mb-2">
                مرحباً، {user?.name}! 👋
              </h2>
              <p className={`${darkMode ? 'text-blue-200' : 'text-blue-100'}`}>
                {user?.role === 'admin' 
                  ? 'لديك صلاحيات كاملة لإدارة المتجر' 
                  : `لديك صلاحية الوصول إلى ${availablePages.length} صفحة`}
              </p>
            </div>

          {user?.role === 'admin' && (
  <>
    {/* كارت رسائل العملاء - جديد ✅ */}
    <div className="mb-6">
      <Link href="/admin/messages" className="block bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-2xl p-6 hover:shadow-xl transition">
        <div className="flex items-center gap-4">
          <MessageSquare className="w-10 h-10" />
          <div>
            <h3 className="text-2xl font-black">رسائل العملاء</h3>
            <p className="text-blue-100 text-sm">رسائل اتصل بنا</p>
          </div>
        </div>
      </Link>
    </div>

    <div className="mb-6">
      <Link href="/admin/reviews" className="block bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 hover:shadow-xl transition">
        <div className="flex items-center gap-4">
          <Star className="w-10 h-10" />
          <div>
            <h3 className="text-2xl font-black">التقييمات</h3>
            <p className="text-purple-100 text-sm">إدارة آراء العملاء</p>
          </div>
        </div>
      </Link>
    </div>

    <div className="mb-6">
      <Link href="/admin/marketing" className="block bg-gradient-to-br from-pink-500 to-orange-600 text-white rounded-2xl p-6 hover:shadow-xl transition">
        <div className="flex items-center gap-4">
          <Gift className="w-10 h-10" />
          <div>
            <h3 className="text-2xl font-black">التسويق</h3>
            <p className="text-pink-100 text-sm">العروض والكوبونات</p>
          </div>
        </div>
      </Link>
    </div>
  </>
)}


            {statsCards.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {statsCards.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl p-5 shadow-sm border hover:shadow-lg transition-all duration-300 ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${
                          stat.trend === 'up' 
                            ? darkMode ? 'text-green-400' : 'text-green-600' 
                            : darkMode ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4" />}
                          {stat.change}
                        </div>
                      </div>
                      <h3 className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {stat.label}
                      </h3>
                      <p className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {(user?.role === 'admin' || availableStats.includes('totalOrders')) && stats?.recentOrders && stats.recentOrders.length > 0 && (
              <div className={`rounded-2xl p-6 shadow-sm border transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    الطلبات الأخيرة
                  </h2>
                  <Link 
                    href="/admin/orders" 
                    className={`text-sm font-semibold flex items-center gap-1 ${
                      darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    عرض الكل
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <th className={`text-right font-semibold p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          رقم الطلب
                        </th>
                        <th className={`text-right font-semibold p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          العميل
                        </th>
                        <th className={`text-right font-semibold p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          المبلغ
                        </th>
                        <th className={`text-right font-semibold p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          الحالة
                        </th>
                        <th className={`text-right font-semibold p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          التاريخ
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map((order: any) => (
                        <tr 
                          key={order.id} 
                          className={`border-b transition ${
                            darkMode 
                              ? 'border-gray-700 hover:bg-gray-700/50' 
                              : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <td className={`p-3 font-semibold text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {order.orderNumber}
                          </td>
                          <td className={`p-3 text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {order.customerName}
                          </td>
                          <td className={`p-3 font-semibold text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                            {order.total.toLocaleString()} دج
                          </td>
                          <td className="p-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'delivered' 
                                ? darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700' :
                              order.status === 'shipped' 
                                ? darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700' :
                              order.status === 'processing' 
                                ? darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700' :
                                darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status === 'pending' ? 'قيد الانتظار' :
                               order.status === 'processing' ? 'جاري التحضير' :
                               order.status === 'shipped' ? 'في الطريق' :
                               'تم التسليم'}
                            </span>
                          </td>
                          <td className={`p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {stats?.recentOrders?.length === 0 && (
              <div className={`rounded-2xl p-12 shadow-sm border text-center transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="text-6xl mb-4">📦</div>
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  لا توجد طلبات حتى الآن
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  عندما يتم إنشاء طلبات جديدة ستظهر هنا
                </p>
              </div>
            )}

            {statsCards.length === 0 && (
              <div className={`rounded-2xl p-12 shadow-sm border text-center transition-colors duration-300 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="text-6xl mb-4">🔒</div>
                <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  لا توجد صلاحيات
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  اتصل بالمدير لإضافة صلاحيات لحسابك
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
  .font-arabic { font-family: 'Cairo', sans-serif !important; }
  
  /* Fix notification dropdown overflow */
  header {
    overflow: visible !important;
  }
  
  header > div {
    overflow: visible !important;
  }
  
  header .flex {
    overflow: visible !important;
  }
`}</style>

    </div>
  );
}
