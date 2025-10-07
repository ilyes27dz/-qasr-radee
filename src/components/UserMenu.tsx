'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // جلب بيانات المستخدم
  useEffect(() => {
    const getUserData = () => {
      try {
        const data = localStorage.getItem('customer_user');
        if (data) {
          setUser(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    getUserData();
  }, []);

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      localStorage.removeItem('customer_user');
      toast.success('تم تسجيل الخروج');
      window.location.href = '/';
    }
  };

  if (!user) {
    return (
      <Link href="/login" className="p-2 hover:bg-gray-100 rounded-lg transition">
        <User className="w-5 h-5 text-gray-600" />
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span className="hidden md:block text-sm font-semibold text-gray-700">
          {user.name?.split(' ')[0]}
        </span>
      </button>
      
      {isOpen && (
        <>
          {/* خلفية شفافة للإغلاق */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* القائمة */}
          <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
            <div className="p-4 border-b border-gray-100">
              <p className="font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            
            <div className="p-2">
              <Link 
                href="/account" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition text-gray-700"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-semibold">حسابي</span>
              </Link>
              
              <Link 
                href="/account?tab=orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition text-gray-700"
              >
                <Package className="w-4 h-4" />
                <span className="text-sm font-semibold">طلباتي</span>
              </Link>
              
              <Link 
                href="/account?tab=wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition text-gray-700"
              >
                <Heart className="w-4 h-4" />
                <span className="text-sm font-semibold">المفضلة</span>
              </Link>
              
              <Link 
                href="/account?tab=settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-lg transition text-gray-700"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-semibold">الإعدادات</span>
              </Link>
              
              <div className="border-t border-gray-100 my-2"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-semibold">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
