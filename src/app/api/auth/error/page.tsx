'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, Home, LogIn } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: { [key: string]: string } = {
    Configuration: 'خطأ في الإعدادات',
    AccessDenied: 'تم رفض الوصول',
    Verification: 'فشل التحقق',
    Default: 'حدث خطأ أثناء تسجيل الدخول',
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center font-arabic px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border-2 border-red-200 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-4">
          خطأ في تسجيل الدخول
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          {errorMessage}
        </p>

        <div className="flex gap-4">
          <Link
            href="/admin/login"
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            حاول مرة أخرى
          </Link>

          <Link
            href="/"
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            الرئيسية
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
