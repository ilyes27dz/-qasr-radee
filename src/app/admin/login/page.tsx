'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة السر غير صحيحة');
        toast.error('فشل تسجيل الدخول');
      } else {
        toast.success('تم تسجيل الدخول بنجاح! 🎉');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('حدث خطأ أثناء تسجيل الدخول');
      toast.error('حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 font-arabic">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-semibold">
              ❌ {error}
            </div>
          )}

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-center text-gray-900 mb-2">
            🔐 لوحة التحكم - الأدمن
          </h2>
          <p className="text-center text-gray-600 mb-8 text-sm">
            سجل دخولك للوصول إلى لوحة الإدارة
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                📧 البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="admin@qsrradi3.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                🔒 كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                '🚀 دخول لوحة التحكم'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-bold text-sm transition"
            >
              ← العودة للصفحة الرئيسية
            </a>
          </div>
        </div>

        {/* Hint */}
        <div className="mt-6 text-center text-white text-sm bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p className="font-semibold mb-2">💡 معلومات تسجيل الدخول التجريبية:</p>
          <p>البريد: <span className="font-mono bg-white/20 px-2 py-1 rounded">admin@qsrradi3.com</span></p>
          <p>كلمة السر: <span className="font-mono bg-white/20 px-2 py-1 rounded">admin123</span></p>
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
