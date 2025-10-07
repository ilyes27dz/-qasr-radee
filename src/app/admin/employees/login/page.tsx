'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/staff/login');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-semibold">جاري التحويل...</p>
      </div>
    </div>
  );
}
