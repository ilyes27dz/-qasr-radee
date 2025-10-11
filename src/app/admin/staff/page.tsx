'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  UserCog, Plus, Edit, Trash2, Search, RefreshCw, LogOut, Home,
  Mail, Lock, Phone, Shield, CheckCircle, XCircle, Eye, EyeOff,
  Save, X, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const departments = [
  'المبيعات',
  'المخزن',
  'خدمة العملاء',
  'المحاسبة',
  'التوصيل',
  'أخرى',
];

const permissionsList = [
  { id: 'orders', label: 'إدارة الطلبات', icon: '📦' },
  { id: 'products', label: 'إدارة المنتجات', icon: '🛍️' },
  { id: 'analytics', label: 'التحليلات والمالية', icon: '📊' },
  { id: 'customers', label: 'إدارة العملاء', icon: '👥' },
  { id: 'staff', label: 'إدارة الموظفين', icon: '👔' },
];

export default function StaffManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'employee',
    department: 'المبيعات',
    permissions: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    if (userData.role !== 'admin' && !userData.permissions?.includes('staff')) {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    setUser(userData);
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      console.log('✅ Staff loaded:', data.length);
      setStaff(data);
      
      if (data.length > 0) {
// toast.success(`تم تحميل ${data.length} موظف ✅`);
       }
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تحميل الموظفين');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingStaff 
        ? `/api/admin/users/${editingStaff.id}`
        : '/api/admin/users';
      
      const method = editingStaff ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'فشل الحفظ');
        setLoading(false);
        return;
      }

      toast.success(editingStaff ? 'تم التحديث بنجاح ✅' : 'تم إضافة الموظف بنجاح ✅');
      
      setShowModal(false);
      resetForm();
      fetchStaff();
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('✅ تم حذف الموظف بنجاح');
        fetchStaff();
      } else {
        const data = await response.json();
        toast.error(data.error || 'فشل الحذف');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const handleToggleStatus = async (staff: any) => {
    try {
      const response = await fetch(`/api/admin/users/${staff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...staff, 
          isActive: !staff.isActive 
        }),
      });

      if (response.ok) {
        toast.success(staff.isActive ? 'تم تعطيل الحساب' : 'تم تفعيل الحساب');
        fetchStaff();
      } else {
        toast.error('فشل تحديث الحالة');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ');
    }
  };

  const openEditModal = (staff: any) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '',
      phone: staff.phone || '',
      role: staff.role,
      department: staff.department || 'المبيعات',
      permissions: staff.permissions || [],
      isActive: staff.isActive,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'employee',
      department: 'المبيعات',
      permissions: [],
      isActive: true,
    });
    setShowPassword(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const togglePermission = (permId: string) => {
    if (formData.permissions.includes(permId)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permId),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permId],
      });
    }
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && staff.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <UserCog className="w-8 h-8 text-blue-600" />
              <div>
                <span className="text-lg font-bold text-gray-900">إدارة الموظفين</span>
                <p className="text-xs text-gray-500">{staff.length} موظف</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden md:inline">إضافة موظف</span>
              </button>

              <button onClick={fetchStaff} className="p-2 hover:bg-gray-50 rounded-lg">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-50 rounded-lg">
                <Home className="w-5 h-5 text-gray-600" />
              </Link>

              <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg">
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن موظف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الموظف</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">القسم</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الصلاحيات</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الحالة</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <UserCog className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-500 font-bold">لا يوجد موظفين</p>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{s.name}</p>
                            <p className="text-sm text-gray-600">{s.email}</p>
                            {s.phone && (
                              <p className="text-xs text-gray-500">{s.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {s.role === 'admin' ? (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold flex items-center gap-1 w-fit">
                            <Shield className="w-4 h-4" />
                            مدير النظام
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                            {s.department || 'موظف'}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {s.role === 'admin' ? (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                              جميع الصلاحيات
                            </span>
                          ) : s.permissions && s.permissions.length > 0 ? (
                            s.permissions.map((perm: string) => (
                              <span key={perm} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                {permissionsList.find(p => p.id === perm)?.icon} {permissionsList.find(p => p.id === perm)?.label}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">بدون صلاحيات</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(s)}
                          disabled={s.role === 'admin'}
                          className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                            s.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          } ${s.role === 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {s.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {s.isActive ? 'نشط' : 'معطل'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition"
                            title="تعديل"
                          >
                            <Edit className="w-5 h-5 text-blue-600" />
                          </button>
                          {s.role !== 'admin' && (
                            <button
                              onClick={() => handleDelete(s.id, s.name)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="حذف"
                            >
                              <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {editingStaff ? 'تعديل موظف' : 'إضافة موظف جديد'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="محمد أحمد"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    disabled={!!editingStaff}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-blue-600" />
                    كلمة المرور {editingStaff ? '(اتركها فارغة للإبقاء)' : '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required={!editingStaff}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="0555000000"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-2">الدور *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    disabled={editingStaff?.role === 'admin'}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  >
                    <option value="employee">موظف</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>

                {formData.role === 'employee' && (
                  <div>
                    <label className="block font-bold mb-2">القسم *</label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {formData.role === 'employee' && (
                <div>
                  <label className="block font-bold mb-2">الصلاحيات</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {permissionsList.map(perm => (
                      <label
                        key={perm.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="w-5 h-5"
                        />
                        <span className="text-2xl">{perm.icon}</span>
                        <span className="font-semibold text-sm">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-5 h-5"
                />
                <div>
                  <p className="font-semibold">الحساب نشط</p>
                  <p className="text-sm text-gray-600">يمكن للموظف تسجيل الدخول</p>
                </div>
              </label>
            </form>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'جاري الحفظ...' : editingStaff ? 'تحديث' : 'إضافة'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
