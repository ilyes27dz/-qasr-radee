'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, LogIn, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/customers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'حدث خطأ أثناء تسجيل الدخول');
        setLoading(false);
        return;
      }

      try {
        localStorage.setItem('customer_user', JSON.stringify(data.customer));
        toast.success(`مرحباً ${data.customer.name}! 👋`);
        
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } catch (error) {
        console.error('Login storage error:', error);
        toast.error('حدث خطأ في حفظ البيانات');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 font-arabic">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image 
              src="/LOGO.jpg" 
              alt="قصر الرضيع" 
              width={96} 
              height={96}
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl shadow-lg"
              priority
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-sm sm:text-base text-gray-600">مرحباً بك في قصر الرضيع</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
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
              placeholder="yourname@example.com"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" />
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-black text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm sm:text-base">جاري التحميل...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>

        <div className="mt-5 sm:mt-6 text-center space-y-3">
          <p className="text-sm sm:text-base text-gray-600">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold">
              سجل الآن
            </Link>
          </p>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm sm:text-base text-gray-600 hover:text-blue-600 transition font-semibold"
          >
            <ArrowRight className="w-4 h-4" />
            العودة للمتجر
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
