// أنواع الصلاحيات
export const PERMISSIONS = {
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  ANALYTICS: 'analytics', // ✅ تغيير من FINANCE
  REPORTS: 'reports',
  STAFF: 'staff',
  SETTINGS: 'settings',
} as const;

// التحقق من الصلاحيات
export function hasPermission(userPermissions: string[], required: string): boolean {
  return userPermissions.includes(required);
}

// التحقق من أن المستخدم أدمن
export function isAdmin(role: string): boolean {
  return role === 'admin';
}

// الحصول على الصفحات المتاحة حسب الصلاحيات
export function getAvailablePages(role: string, permissions: string[]) {
  const pages = [];

  // الأدمن يرى كل شيء
  if (role === 'admin') {
    return [
      { id: 'dashboard', icon: 'LayoutDashboard', label: 'لوحة التحكم', path: '/admin/dashboard' },
      { id: 'products', icon: 'Package', label: 'المنتجات', path: '/admin/products' },
      { id: 'orders', icon: 'ShoppingCart', label: 'الطلبات', path: '/admin/orders' },
      { id: 'customers', icon: 'Users', label: 'العملاء', path: '/admin/customers' },
      { id: 'analytics', icon: 'DollarSign', label: 'المالية', path: '/admin/analytics' }, // ✅ مُصحح
      { id: 'reports', icon: 'FileText', label: 'التقارير', path: '/admin/reports' },
      { id: 'staff', icon: 'UserCog', label: 'الموظفين', path: '/admin/staff' },
      { id: 'settings', icon: 'Settings', label: 'الإعدادات', path: '/admin/settings' },
    ];
  }

  // الصفحة الرئيسية متاحة للجميع
  pages.push({ 
    id: 'dashboard', 
    icon: 'LayoutDashboard', 
    label: 'لوحة التحكم', 
    path: '/admin/dashboard' 
  });

  // إضافة الصفحات حسب الصلاحيات
  if (permissions.includes(PERMISSIONS.PRODUCTS)) {
    pages.push({ 
      id: 'products', 
      icon: 'Package', 
      label: 'المنتجات', 
      path: '/admin/products' 
    });
  }

  if (permissions.includes(PERMISSIONS.ORDERS)) {
    pages.push({ 
      id: 'orders', 
      icon: 'ShoppingCart', 
      label: 'الطلبات', 
      path: '/admin/orders' 
    });
  }

  if (permissions.includes(PERMISSIONS.CUSTOMERS)) {
    pages.push({ 
      id: 'customers', 
      icon: 'Users', 
      label: 'العملاء', 
      path: '/admin/customers' 
    });
  }

  if (permissions.includes(PERMISSIONS.ANALYTICS)) {
    pages.push({ 
      id: 'analytics', 
      icon: 'DollarSign', 
      label: 'المالية', 
      path: '/admin/analytics' 
    });
  }

  if (permissions.includes(PERMISSIONS.REPORTS)) {
    pages.push({ 
      id: 'reports', 
      icon: 'FileText', 
      label: 'التقارير', 
      path: '/admin/reports' 
    });
  }

  if (permissions.includes(PERMISSIONS.STAFF)) {
    pages.push({ 
      id: 'staff', 
      icon: 'UserCog', 
      label: 'الموظفين', 
      path: '/admin/staff' 
    });
  }

  if (permissions.includes(PERMISSIONS.SETTINGS)) {
    pages.push({ 
      id: 'settings', 
      icon: 'Settings', 
      label: 'الإعدادات', 
      path: '/admin/settings' 
    });
  }

  return pages;
}

// الحصول على الإحصائيات المتاحة حسب الصلاحيات
export function getAvailableStats(role: string, permissions: string[]) {
  const stats = [];

  // الإحصائيات المالية
  if (role === 'admin' || permissions.includes(PERMISSIONS.ANALYTICS)) {
    stats.push('totalSales', 'revenue', 'profit');
  }

  // إحصائيات الطلبات
  if (role === 'admin' || permissions.includes(PERMISSIONS.ORDERS)) {
    stats.push('totalOrders', 'pendingOrders', 'completedOrders');
  }

  // إحصائيات المنتجات
  if (role === 'admin' || permissions.includes(PERMISSIONS.PRODUCTS)) {
    stats.push('totalProducts', 'lowStock');
  }

  // إحصائيات العملاء
  if (role === 'admin' || permissions.includes(PERMISSIONS.CUSTOMERS)) {
    stats.push('totalCustomers', 'newCustomers');
  }

  return stats;
}

// دالة للحصول على جميع الصلاحيات المتاحة
export function getAllPermissions() {
  return [
    { id: PERMISSIONS.PRODUCTS, label: 'إدارة المنتجات', description: 'إضافة وتعديل وحذف المنتجات' },
    { id: PERMISSIONS.ORDERS, label: 'إدارة الطلبات', description: 'عرض وتحديث حالة الطلبات' },
    { id: PERMISSIONS.CUSTOMERS, label: 'إدارة العملاء', description: 'عرض وإدارة بيانات العملاء' },
    { id: PERMISSIONS.ANALYTICS, label: 'المالية والإحصائيات', description: 'عرض التقارير المالية والإحصائيات' },
    { id: PERMISSIONS.REPORTS, label: 'التقارير', description: 'إنشاء وعرض التقارير' },
    { id: PERMISSIONS.STAFF, label: 'إدارة الموظفين', description: 'إضافة وإدارة حسابات الموظفين' },
    { id: PERMISSIONS.SETTINGS, label: 'الإعدادات', description: 'تعديل إعدادات النظام' },
  ];
}

// دالة للتحقق من صلاحيات متعددة
export function hasAnyPermission(userPermissions: string[], required: string[]): boolean {
  return required.some(perm => userPermissions.includes(perm));
}

// دالة للتحقق من جميع الصلاحيات المطلوبة
export function hasAllPermissions(userPermissions: string[], required: string[]): boolean {
  return required.every(perm => userPermissions.includes(perm));
}
