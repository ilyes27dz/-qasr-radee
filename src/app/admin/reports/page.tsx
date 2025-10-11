'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, Download, Calendar, TrendingUp, Package, Users,
  DollarSign, RefreshCw, LogOut, Home, BarChart3, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dateRange, setDateRange] = useState('month');

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    if (userData.role !== 'admin') {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    setUser(userData);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const reports = [
    {
      id: 1,
      title: 'تقرير المبيعات الشهري',
      description: 'تقرير شامل لجميع المبيعات خلال الشهر الحالي',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      link: '/admin/analytics',
    },
    {
      id: 2,
      title: 'تقرير المنتجات',
      description: 'تفاصيل المنتجات والمخزون والمبيعات',
      icon: Package,
      color: 'from-blue-500 to-indigo-600',
      link: '/admin/products',
    },
    {
      id: 3,
      title: 'تقرير العملاء',
      description: 'معلومات العملاء والطلبات والنشاط',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      link: '/admin/customers',
    },
    {
      id: 4,
      title: 'تقرير الإحصائيات',
      description: 'إحصائيات الزوار والتفاعل مع الموقع',
      icon: BarChart3,
      color: 'from-orange-500 to-red-600',
      link: '/admin/analytics',
    },
  ];

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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">التقارير</h1>
                <p className="text-sm text-gray-500">مرحباً {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 mb-2">📊 التقارير والإحصائيات</h2>
          <p className="text-gray-600">اختر التقرير المناسب لعرض التفاصيل والبيانات</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={report.link}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-br ${report.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <report.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {report.title}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {report.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-blue-600 font-semibold text-sm">
                  عرض التقرير
                  <TrendingUp className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">تصدير التقارير</h3>
              <p className="text-sm text-gray-600">قم بتحميل التقارير كملفات CSV أو PDF</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-sm text-gray-600 mb-2">الفترة الزمنية</p>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="week">الأسبوع الحالي</option>
                <option value="month">الشهر الحالي</option>
                <option value="year">السنة الحالية</option>
                <option value="all">كل الفترة</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border">
              <p className="text-sm text-gray-600 mb-2">نوع التقرير</p>
              <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>تقرير المبيعات</option>
                <option>تقرير المنتجات</option>
                <option>تقرير العملاء</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border flex items-end">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                <Download className="w-5 h-5" />
                تحميل التقرير
              </button>
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
