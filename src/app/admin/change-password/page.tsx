'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Save, Eye, EyeOff, Home, LogOut, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // التحقق من تطابق كلمة المرور الجديدة
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('كلمة المرور الجديدة غير متطابقة');
        setLoading(false);
        return;
      }

      // التحقق من طول كلمة المرور
      if (formData.newPassword.length < 6) {
        toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setLoading(false);
        return;
      }

      // إذا كان Admin
      if (user.role === 'admin' && user.email === 'admin@babypalace.dz') {
        // التحقق من كلمة المرور الحالية
        if (formData.currentPassword !== 'admin123') { // كلمة المرور الحالية
          toast.error('كلمة المرور الحالية غير صحيحة');
          setLoading(false);
          return;
        }

        // حفظ في localStorage (مؤقت)
        const updatedUser = { ...user, password: formData.newPassword };
        localStorage.setItem('admin_user', JSON.stringify(updatedUser));
        
        toast.success('تم تغيير كلمة المرور بنجاح! ✅');
        toast.success('يرجى تحديث الكود في ملف staff/login/page.tsx');
        
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } 
      // إذا كان موظف
      else {
        const employees = JSON.parse(localStorage.getItem('employees') || '[]');
        const employeeIndex = employees.findIndex((emp: any) => emp.id === user.id);

        if (employeeIndex === -1) {
          toast.error('لم يتم العثور على الموظف');
          setLoading(false);
          return;
        }

        // التحقق من كلمة المرور الحالية
        if (formData.currentPassword !== employees[employeeIndex].password) {
          toast.error('كلمة المرور الحالية غير صحيحة');
          setLoading(false);
          return;
        }

        // تحديث كلمة المرور
        employees[employeeIndex].password = formData.newPassword;
        localStorage.setItem('employees', JSON.stringify(employees));

        // تحديث المستخدم الحالي
        const updatedUser = { ...user, password: formData.newPassword };
        localStorage.setItem('admin_user', JSON.stringify(updatedUser));

        toast.success('تم تغيير كلمة المرور بنجاح! ✅');
        
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">تغيير كلمة المرور</h1>
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
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-red-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">تغيير كلمة المرور</h2>
            <p className="text-gray-600 text-center mb-8">اختر كلمة مرور قوية وآمنة</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* كلمة المرور الحالية */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  كلمة المرور الحالية
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition"
                    placeholder="أدخل كلمة المرور الحالية"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* كلمة المرور الجديدة */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition"
                    placeholder="أدخل كلمة المرور الجديدة"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">يجب أن تكون 6 أحرف على الأقل</p>
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  تأكيد كلمة المرور الجديدة
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition"
                    placeholder="أعد إدخال كلمة المرور الجديدة"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* زر الحفظ */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-black text-lg hover:from-red-700 hover:to-pink-700 transition shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    حفظ كلمة المرور الجديدة
                  </>
                )}
              </button>
            </form>

            {user?.role === 'admin' && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <p className="text-sm text-yellow-900 font-semibold">
                  ⚠️ ملاحظة: بعد تغيير كلمة المرور، يجب تحديث الكود في ملف <code className="bg-yellow-200 px-2 py-1 rounded">staff/login/page.tsx</code>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
