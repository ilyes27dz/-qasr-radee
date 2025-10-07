'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, Plus, Edit, Trash2, Search, RefreshCw,
  LogOut, Home, Image, Video, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }
    setUser(JSON.parse(adminUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

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
                <h1 className="text-xl font-bold text-gray-900">إدارة المحتوى</h1>
                <p className="text-sm text-gray-500">مرحباً {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-50 rounded-lg transition">
                <Home className="w-5 h-5 text-gray-600" />
              </Link>
              <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition">
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition cursor-pointer">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">الصور</h3>
            <p className="text-gray-600 text-sm mb-4">إدارة صور المتجر والسلايدر</p>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              إدارة الصور
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">النصوص</h3>
            <p className="text-gray-600 text-sm mb-4">تعديل نصوص الصفحات</p>
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition">
              إدارة النصوص
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-lg transition cursor-pointer">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">الفيديوهات</h3>
            <p className="text-gray-600 text-sm mb-4">إضافة وإدارة الفيديوهات</p>
            <button className="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition">
              إدارة الفيديوهات
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border mt-6 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">قيد التطوير</h3>
          <p className="text-gray-600">هذه الصفحة قيد التطوير حالياً</p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
