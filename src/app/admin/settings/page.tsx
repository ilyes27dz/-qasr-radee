'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Settings, ArrowRight, Save, Mail, Lock, User, Shield,
  Eye, EyeOff, CheckCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // بيانات النموذج
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // إظهار/إخفاء كلمات المرور
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    
    // فقط الأدمن يمكنه تغيير الإعدادات
    if (userData.role !== 'admin') {
      toast.error('ليس لديك صلاحية الوصول للإعدادات');
      router.push('/admin/dashboard');
      return;
    }

    setUser(userData);
    setName(userData.name || '');
    setEmail(userData.email || '');
    setLoading(false);
  }, []);

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error('الرجاء ملء جميع الحقول');
      return;
    }

    // التحقق من صحة الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('صيغة الإيميل غير صحيحة');
      return;
    }

    setSaving(true);

    try {
      // تحديث في admin_main (قاعدة البيانات الرئيسية)
      const adminMainData = localStorage.getItem('admin_main');
      if (adminMainData) {
        const adminMain = JSON.parse(adminMainData);
        const updatedAdminMain = {
          ...adminMain,
          name: name.trim(),
          email: email.trim(),
        };
        localStorage.setItem('admin_main', JSON.stringify(updatedAdminMain));
        console.log('✅ Admin main updated:', updatedAdminMain);
      }

      // تحديث في admin_user (الجلسة الحالية)
      const updatedUser = {
        ...user,
        name: name.trim(),
        email: email.trim(),
      };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('✅ تم حفظ البيانات بنجاح!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // التحقق من كلمة المرور الحالية
    if (!currentPassword) {
      toast.error('الرجاء إدخال كلمة المرور الحالية');
      return;
    }

    // قراءة كلمة المرور الحالية من admin_main
    const adminMainData = localStorage.getItem('admin_main');
    if (!adminMainData) {
      toast.error('خطأ في النظام - لم يتم العثور على بيانات الأدمن');
      return;
    }

    const adminMain = JSON.parse(adminMainData);
    
    // التحقق من كلمة المرور الحالية
    if (currentPassword !== adminMain.password) {
      toast.error('كلمة المرور الحالية غير صحيحة ❌');
      return;
    }

    // التحقق من كلمة المرور الجديدة
    if (!newPassword || newPassword.length < 6) {
      toast.error('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    // التحقق من تطابق كلمتي المرور
    if (newPassword !== confirmPassword) {
      toast.error('كلمتا المرور غير متطابقتين ❌');
      return;
    }

    setSaving(true);

    try {
      // تحديث كلمة المرور في admin_main
      const updatedAdminMain = {
        ...adminMain,
        password: newPassword,
      };
      localStorage.setItem('admin_main', JSON.stringify(updatedAdminMain));
      console.log('✅ Password updated in admin_main');
      
      // مسح الحقول
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('✅ تم تغيير كلمة المرور بنجاح!');
      toast('🔒 سيتم تسجيل خروجك الآن...', { duration: 2000 });
      
      // تسجيل الخروج بعد 2 ثانية
      setTimeout(() => {
        localStorage.removeItem('admin_user');
        router.push('/staff/login');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تغيير كلمة المرور');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">الإعدادات</h1>
                <p className="text-sm text-gray-500">إعدادات حساب المدير</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-900">مدير النظام</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* معلومات الحساب */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">معلومات الحساب</h2>
              <p className="text-sm text-gray-500">تعديل الاسم والبريد الإلكتروني</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                الاسم الكامل
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="المدير العام"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@babypalace.dz"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                سيتم استخدام هذا الإيميل لتسجيل الدخول
              </p>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        </div>

        {/* تغيير كلمة المرور */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">تغيير كلمة المرور</h2>
              <p className="text-sm text-gray-500">تحديث كلمة المرور الخاصة بك</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* كلمة المرور الحالية */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600" />
                كلمة المرور الحالية
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition pr-12"
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
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-600" />
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">يجب أن تكون 6 أحرف على الأقل</p>
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                تأكيد كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition pr-12"
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

            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-red-900 mb-1">تنبيه مهم!</p>
                  <p className="text-xs text-red-700">
                    عند تغيير كلمة المرور، سيتم تسجيل خروجك تلقائياً وستحتاج لتسجيل الدخول مرة أخرى بكلمة المرور الجديدة.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:from-red-700 hover:to-pink-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Lock className="w-5 h-5" />
              {saving ? 'جاري التحديث...' : 'تغيير كلمة المرور'}
            </button>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-900 mb-1">بيانات الدخول الحالية:</p>
              <div className="text-xs text-blue-700 space-y-1">
                <p><span className="font-bold">الإيميل:</span> {user.email}</p>
                <p className="text-xs text-blue-600 mt-2 bg-blue-100 p-2 rounded-lg">
                  💡 يمكنك تغيير هذه البيانات من الأعلى
                </p>
              </div>
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
