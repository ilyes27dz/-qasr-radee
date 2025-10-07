'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserCog, Users, Plus, Edit, Trash2, Search, RefreshCw,
  LogOut, Home, Shield, Check, X, Mail, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'employee';
  department: string;
  permissions: string[];
  active: boolean;
  createdAt: string;
}

const availablePermissions = [
  { id: 'products', label: 'إدارة المنتجات', icon: '📦' },
  { id: 'orders', label: 'إدارة الطلبات', icon: '🛒' },
  { id: 'customers', label: 'إدارة العملاء', icon: '👥' },
  { id: 'analytics', label: 'التحليلات والمالية', icon: '📊' },
];

const departments = [
  'الطلبات',
  'المنتجات',
  'خدمة العملاء',
  'المالية',
  'التسويق',
];

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'employee' as 'admin' | 'employee',
    department: '',
    permissions: [] as string[],
    active: true,
  });

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/admin/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    if (userData.role !== 'admin') {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // هنا سنجلب من localStorage مؤقتاً
      const storedEmployees = localStorage.getItem('employees');
      if (storedEmployees) {
        setEmployees(JSON.parse(storedEmployees));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/admin/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEmployee) {
      // تحديث موظف
      const updated = employees.map(emp =>
        emp.id === editingEmployee.id
          ? { ...emp, ...formData, id: emp.id, createdAt: emp.createdAt }
          : emp
      );
      setEmployees(updated);
      localStorage.setItem('employees', JSON.stringify(updated));
      toast.success('تم تحديث الموظف بنجاح ✅');
    } else {
      // إضافة موظف جديد
      const newEmployee: Employee = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      const updated = [...employees, newEmployee];
      setEmployees(updated);
      localStorage.setItem('employees', JSON.stringify(updated));
      toast.success('تمت إضافة الموظف بنجاح ✅');
    }

    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'employee',
      department: '',
      permissions: [],
      active: true,
    });
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      password: '',
      role: employee.role,
      department: employee.department,
      permissions: employee.permissions,
      active: employee.active,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموظف؟')) {
      const updated = employees.filter(emp => emp.id !== id);
      setEmployees(updated);
      localStorage.setItem('employees', JSON.stringify(updated));
      toast.success('تم حذف الموظف');
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <UserCog className="w-8 h-8 text-blue-600" />
              <div>
                <span className="text-lg font-bold text-gray-900">إدارة الموظفين</span>
                <p className="text-xs text-gray-500">{employees.length} موظف</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingEmployee(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    password: '',
                    role: 'employee',
                    department: '',
                    permissions: [],
                    active: true,
                  });
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <Plus className="w-5 h-5" />
                إضافة موظف
              </button>

              <button
                onClick={fetchEmployees}
                className="p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-50 rounded-lg">
                <Home className="w-5 h-5 text-gray-600" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
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

        {/* Employees Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {employee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-500">{employee.department}</p>
                  </div>
                </div>
                {employee.role === 'admin' && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    مدير
                  </span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {employee.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {employee.phone}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">الصلاحيات:</p>
                <div className="flex flex-wrap gap-2">
                  {employee.permissions.length > 0 ? (
                    employee.permissions.map(perm => (
                      <span key={perm} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                        {availablePermissions.find(p => p.id === perm)?.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">لا توجد صلاحيات</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(employee)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold text-sm"
                >
                  <Edit className="w-4 h-4" />
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                انضم في {new Date(employee.createdAt).toLocaleDateString('ar-DZ')}
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-bold">لا توجد نتائج</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingEmployee ? 'تعديل موظف' : 'إضافة موظف جديد'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    رقم الهاتف *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {editingEmployee ? 'كلمة المرور (اتركها فارغة إذا لم تريد التغيير)' : 'كلمة المرور *'}
                  </label>
                  <input
                    type="password"
                    required={!editingEmployee}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    القسم *
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر القسم</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    الدور *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'employee' })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="employee">موظف</option>
                    <option value="admin">مدير</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  الصلاحيات
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {availablePermissions.map(perm => (
                    <button
                      key={perm.id}
                      type="button"
                      onClick={() => togglePermission(perm.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                        formData.permissions.includes(perm.id)
                          ? 'bg-blue-50 border-blue-500 text-blue-900'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.permissions.includes(perm.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {formData.permissions.includes(perm.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-2xl mr-2">{perm.icon}</span>
                        <span className="font-semibold">{perm.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  {editingEmployee ? 'حفظ التغييرات' : 'إضافة الموظف'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEmployee(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
