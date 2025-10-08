'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // تنظيف البيانات قبل الإرسال ✅
    const cleanEmail = email.toLowerCase().trim();
    const cleanPassword = password.trim();

    console.log('🔐 إرسال بيانات تسجيل الدخول:', { email: cleanEmail });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          password: cleanPassword,
        }),
      });

      const data = await response.json();

      console.log('📊 استجابة الخادم:', response.status, data);

      if (!response.ok) {
        console.error('❌ فشل تسجيل الدخول:', data.error);
        toast.error(data.error || 'فشل تسجيل الدخول');
        setLoading(false);
        return;
      }

      if (data.success && data.user) {
        console.log('✅ نجح تسجيل الدخول!', data.user);

        // حفظ بيانات المستخدم
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        
        toast.success('مرحباً ' + data.user.name + ' 🎉');

        // التوجيه حسب الدور
        setTimeout(() => {
          if (data.user.role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/staff/dashboard');
          }
          router.refresh();
        }, 500);
      } else {
        toast.error('فشل تسجيل الدخول');
      }
    } catch (error: any) {
      console.error('❌ خطأ غير متوقع:', error);
      toast.error('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 font-arabic">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>

          <h2 className="text-3xl font-black text-center text-gray-900 mb-2">
            🔐 تسجيل الدخول
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm">
            للموظفين والإدارة فقط
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📧 البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                placeholder="admin@qsrradi3.com"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔒 كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                '🚀 دخول'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:text-blue-700 font-bold text-sm transition">
              ← العودة للصفحة الرئيسية
            </a>
          </div>
        </div>

        {/* Debug Info - للاختبار فقط ✅ */}
        <div className="mt-6 text-center text-white text-sm bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="font-semibold mb-2">💡 معلومات تسجيل الدخول:</p>
          <p className="font-mono bg-white/20 px-3 py-1 rounded mb-1">
            📧 admin@qsrradi3.com
          </p>
          <p className="font-mono bg-white/20 px-3 py-1 rounded">
            🔒 admin123
          </p>
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
