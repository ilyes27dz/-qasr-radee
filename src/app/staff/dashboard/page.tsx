'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Home, Package, ShoppingCart, Users, BarChart3,
  LogOut, Settings, Bell, User, Shield, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StaffDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    setUser(userData);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    {
      id: 'products',
      title: 'إدارة المنتجات',
      description: 'عرض وإضافة وتعديل المنتجات',
      icon: Package,
      href: '/admin/products',
      color: 'from-blue-500 to-blue-600',
      permission: 'products'
    },
    {
      id: 'orders',
      title: 'إدارة الطلبات',
      description: 'متابعة ومعالجة الطلبات',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'from-green-500 to-green-600',
      permission: 'orders'
    },
    {
      id: 'customers',
      title: 'إدارة العملاء',
      description: 'عرض وإدارة بيانات العملاء',
      icon: Users,
      href: '/admin/customers',
      color: 'from-purple-500 to-purple-600',
      permission: 'customers'
    },
    {
      id: 'analytics',
      title: 'التحليلات والمالية',
      description: 'مراجعة التقارير والإحصائيات',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'from-orange-500 to-orange-600',
      permission: 'analytics'
    },
  ];

  // Admin يرى كل شيء
  const availableItems = user.role === 'admin' 
    ? menuItems 
    : menuItems.filter(item => user.permissions?.includes(item.permission));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-8 h-8 text-blue-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">لوحة التحكم</span>
                  <p className="text-xs text-gray-500">قصر الرضيع</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {user.role === 'admin' ? (
                      <>
                        <Shield className="w-3 h-3" />
                        مدير
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3" />
                        موظف
                      </>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-6 h-6 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black mb-2">مرحباً {user.name}! 👋</h1>
              <p className="text-blue-100 text-lg">
                {user.role === 'admin' 
                  ? 'لديك وصول كامل لجميع الأقسام'
                  : `لديك ${availableItems.length} صلاحية`
                }
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Permissions */}
        {availableItems.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">الأقسام المتاحة</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                      <span>فتح القسم</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Admin Only Section */}
            {user.role === 'admin' && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">إدارة متقدمة</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Link
                    href="/admin/employees"
                    className="bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition"
                  >
                    <Settings className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">إدارة الموظفين</h3>
                    <p className="text-red-100">إضافة وتعديل وحذف الموظفين والصلاحيات</p>
                  </Link>

                  <Link
                    href="/admin/dashboard"
                    className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition"
                  >
                    <BarChart3 className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">لوحة التحكم الرئيسية</h3>
                    <p className="text-blue-100">عرض شامل لجميع الإحصائيات والتقارير</p>
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">لا توجد صلاحيات</h2>
            <p className="text-gray-600 mb-6">
              لم يتم تعيين أي صلاحيات لحسابك بعد
            </p>
            <p className="text-gray-500 text-sm">
              يرجى التواصل مع المدير لتفعيل الصلاحيات
            </p>
          </div>
        )}
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
