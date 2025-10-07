'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, LogIn, Home, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Admin الافتراضي
      if (email === 'admin@babypalace.dz' && password === 'admin123') {
        const adminData = {
          id: 'admin-1',
          name: 'المدير العام',
          email: 'admin@babypalace.dz',
          role: 'admin',
          permissions: [],
          department: 'الإدارة',
        };
        localStorage.setItem('admin_user', JSON.stringify(adminData));
        toast.success('مرحباً بك في لوحة التحكم! 👑');
        router.push('/admin/dashboard');
        return;
      }

      // التحقق من الموظفين
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const employee = employees.find(
        (emp: any) => emp.email === email && emp.password === password
      );

      if (employee) {
        // حفظ بيانات الموظف
        localStorage.setItem('admin_user', JSON.stringify(employee));
        toast.success(`مرحباً ${employee.name}! 👋`);
        router.push('/admin/dashboard');
      } else {
        toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة ❌');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center p-4 font-arabic">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 text-9xl animate-bounce-slow">👑</div>
        <div className="absolute bottom-20 left-20 text-9xl animate-float">⚙️</div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            تسجيل دخول الأدمن
          </h1>
          <p className="text-gray-600">لوحة التحكم الرئيسية</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              البريد الإلكتروني
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@babypalace.dz"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              كلمة المرور
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري التحميل...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <p className="text-sm text-blue-900 font-semibold mb-2">🔑 بيانات الدخول الافتراضية:</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-700">
              <span className="font-bold">الإيميل:</span> admin@babypalace.dz
            </p>
            <p className="text-blue-700">
              <span className="font-bold">كلمة المرور:</span> admin123
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
