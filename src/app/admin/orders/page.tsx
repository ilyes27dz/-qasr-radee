'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package, Eye, Search, RefreshCw, LogOut, Home,
  Clock, CheckCircle, Truck, XCircle,
  DollarSign, Phone, MapPin, Calendar, Printer,
  Trash2, Edit, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'جاري التحضير', color: 'bg-blue-100 text-blue-700', icon: Package },
  shipped: { label: 'في الطريق', color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered: { label: 'تم التسليم', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function OrdersManagementPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [user, setUser] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [hasFetched, setHasFetched] = useState(false); // ✅ لمنع التكرار
  const [currentPage, setCurrentPage] = useState(1); // ✅ الترقيم
  const itemsPerPage = 10; // ✅ عدد الطلبات بالصفحة

  useEffect(() => {
    if (hasFetched) return; // ✅ منع التكرار

    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    setUser(userData);

    if (userData.role !== 'admin' && !userData.permissions?.includes('orders')) {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    fetchOrders();
    setHasFetched(true); // ✅ تسجيل أنه تم التحميل
  }, [hasFetched]);

  // ✅ جلب من MongoDB
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const ordersData = await response.json();
      
      console.log('📦 Orders loaded from MongoDB:', ordersData.length);
      
      const sortedOrders = ordersData.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);

    } catch (error) {
      console.error('❌ Error loading orders:', error);
      toast.error('فشل تحميل الطلبات');
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ تغيير حالة الطلب
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success('تم تحديث الحالة بنجاح ✅', { duration: 1000 });
      fetchOrders();
    } catch (error) {
      console.error('❌ Error updating status:', error);
      toast.error('فشل تحديث الحالة');
    }
  };

  // ✅ حذف طلب
  const handleDelete = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      toast.success('تم حذف الطلب بنجاح ✅', { duration: 1000 });
      fetchOrders();
    } catch (error) {
      console.error('❌ Error deleting order:', error);
      toast.error('فشل حذف الطلب');
    }
  };

  // ✅ طباعة الطلب
  const handlePrint = async (order: any) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  let qrDataUrl = '';
  try {
    qrDataUrl = await QRCode.toDataURL(`https://qasr-radee.vercel.app/orders?number=${order.orderNumber}`);
  } catch (error) {
    console.error('QR Error:', error);
  }

  // ✅ إضافة نوع التوصيل
  const deliveryTypeText = order.deliveryType === 'home' ? '🏠 توصيل للمنزل' : '🏢 توصيل للمكتب';

  printWindow.document.write(`
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <title>طلب ${order.orderNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Cairo', sans-serif; padding: 40px; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
        .header h1 { color: #2563eb; font-size: 32px; margin-bottom: 10px; }
        .order-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        .info-box { background: #f3f4f6; padding: 20px; border-radius: 10px; }
        .info-box h3 { color: #1f2937; margin-bottom: 15px; font-size: 18px; }
        .info-row { margin-bottom: 10px; }
        .info-label { font-weight: 700; color: #4b5563; }
        .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        .items-table th, .items-table td { border: 1px solid #e5e7eb; padding: 12px; text-align: right; }
        .items-table th { background: #2563eb; color: white; font-weight: 700; }
        .total-section { text-align: left; margin-top: 30px; }
        .total-row { display: flex; justify-content: space-between; padding: 10px; font-size: 18px; }
        .total-row.final { background: #2563eb; color: white; font-weight: 900; font-size: 24px; padding: 15px; border-radius: 10px; margin-top: 10px; }
        .delivery-type { background: #10b981; color: white; padding: 15px; border-radius: 10px; text-align: center; font-size: 20px; font-weight: 700; margin: 20px 0; }
        .qr-section { text-align: center; margin-top: 40px; page-break-inside: avoid; }
        .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; }
        @media print { body { padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>قصر الرضيع</h1>
        <p style="color: #6b7280; font-size: 16px;">متجركم الموثوق لملابس وأدوات الأطفال والرضع</p>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #1f2937; font-size: 24px;">فاتورة طلب رقم: ${order.orderNumber}</h2>
        <p style="color: #6b7280;">التاريخ: ${new Date(order.createdAt).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      ${order.deliveryType ? `<div class="delivery-type">${deliveryTypeText}</div>` : ''}

      <div class="order-info">
        <div class="info-box">
          <h3>📋 معلومات العميل</h3>
          <div class="info-row"><span class="info-label">الاسم:</span> ${order.customerName}</div>
          <div class="info-row"><span class="info-label">الهاتف:</span> ${order.customerPhone}</div>
          ${order.customerEmail ? `<div class="info-row"><span class="info-label">البريد:</span> ${order.customerEmail}</div>` : ''}
        </div>

        <div class="info-box">
          <h3>📍 عنوان التسليم</h3>
          <div class="info-row"><span class="info-label">الولاية:</span> ${order.wilaya}</div>
          <div class="info-row"><span class="info-label">البلدية:</span> ${order.commune}</div>
          <div class="info-row"><span class="info-label">العنوان:</span> ${order.address}</div>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>المنتج</th>
            <th>السعر</th>
            <th>الكمية</th>
            <th>المجموع</th>
          </tr>
        </thead>
        <tbody>
          ${order.items?.map((item: any) => `
            <tr>
              <td>${item.productName}</td>
              <td>${item.price.toLocaleString()} دج</td>
              <td>${item.quantity}</td>
              <td>${(item.price * item.quantity).toLocaleString()} دج</td>
            </tr>
          `).join('') || ''}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">
          <span>المجموع الفرعي:</span>
          <span>${order.subtotal?.toLocaleString() || 0} دج</span>
        </div>
        <div class="total-row">
          <span>الشحن (${deliveryTypeText}):</span>
          <span>${order.shippingCost?.toLocaleString() || 0} دج</span>
        </div>
        <div class="total-row final">
          <span>المجموع الكلي:</span>
          <span>${order.total?.toLocaleString() || 0} دج</span>
        </div>
      </div>

      ${qrDataUrl ? `
        <div class="qr-section">
          <h3 style="margin-bottom: 15px;">تتبع طلبك</h3>
          <img src="${qrDataUrl}" alt="QR Code" style="width: 150px; height: 150px;">
          <p style="margin-top: 10px; color: #6b7280;">امسح الكود لتتبع طلبك</p>
        </div>
      ` : ''}

      <div class="footer">
        <p><strong>قصر الرضيع</strong> - جميع الحقوق محفوظة © 2025</p>
        <p>للاستفسار: info@qasrradee.com | 0558 86 47 55</p>
      </div>

      <script>
        window.onload = () => {
          window.print();
        };
      </script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
};

  // ✅ عرض تفاصيل الطلب في Modal
  const handleViewDetails = async (order: any) => {
    setSelectedOrder(order);
    
    try {
      const qrUrl = await QRCode.toDataURL(`https://qasr-radee.vercel.app/orders?number=${order.orderNumber}`);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('QR Error:', error);
    }
    
    setShowModal(true);
  };

  // فلترة الطلبات
  useEffect(() => {
    let filtered = [...orders];

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(o => o.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderNumber?.toLowerCase().includes(query) ||
        o.customerName?.toLowerCase().includes(query) ||
        o.customerPhone?.includes(query) ||
        o.customerEmail?.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // ✅ إعادة للصفحة الأولى عند الفلترة
  }, [selectedStatus, searchQuery, orders]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      revenue: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + (o.total || 0), 0),
    };
  };

  // ✅ Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <span className="text-lg font-bold text-gray-900">إدارة الطلبات</span>
                <p className="text-xs text-gray-500">{stats.total} طلب إجمالي</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="p-2 hover:bg-gray-50 rounded-lg transition"
                title="تحديث"
              >
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">إجمالي</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">انتظار</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">تحضير</p>
                <p className="text-xl font-bold text-gray-900">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">الطريق</p>
                <p className="text-xl font-bold text-gray-900">{stats.shipped}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">مسلّم</p>
                <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">ملغي</p>
                <p className="text-xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 shadow-lg text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs opacity-90">الإيرادات</p>
                <p className="text-xl font-bold">{stats.revenue.toLocaleString()} دج</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب، الاسم، أو الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-12 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                  selectedStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الكل ({orders.length})
              </button>
              {Object.entries(statusConfig).map(([key, config]) => {
                const count = orders.filter(o => o.status === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedStatus(key)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                      selectedStatus === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {config.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ✅ عرض عدد النتائج */}
        <div className="mb-4 text-sm text-gray-600">
          عرض {startIndex + 1} - {Math.min(endIndex, filteredOrders.length)} من أصل {filteredOrders.length} طلب
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">#</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">رقم الطلب</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">العميل</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الهاتف</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الموقع</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الإجمالي</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الحالة</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">التاريخ</th>
                  <th className="text-right p-4 text-sm font-semibold text-gray-600">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center py-20">
                      <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 font-bold">جاري التحميل...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-20">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl text-gray-500 font-bold">
                        {orders.length === 0 ? 'لا توجد طلبات' : 'لا توجد نتائج للبحث'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order, index) => {
                    const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;

                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                        <td className="p-4 text-gray-600 font-semibold">
                          {startIndex + index + 1}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-blue-600">{order.orderNumber}</div>
                          <div className="text-xs text-gray-500">
                            {order.items?.length || 0} منتج
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">{order.customerName}</div>
                          {order.customerEmail && (
                            <div className="text-xs text-gray-500">{order.customerEmail}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="font-mono">{order.customerPhone}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-semibold">{order.wilaya}</div>
                              <div className="text-xs text-gray-500">{order.commune}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-lg text-gray-900">
                            {order.total?.toLocaleString() || 0} دج
                          </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${statusInfo.color} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          >
                            {Object.entries(statusConfig).map(([key, config]) => (
                              <option key={key} value={key}>
                                {config.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-sm">
                                {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString('ar-DZ', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                              title="التفاصيل"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handlePrint(order)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                              title="طباعة"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
              السابق
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              التالي
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Modal التفاصيل */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                تفاصيل الطلب {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-4">📋 معلومات العميل</h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">الاسم:</span> {selectedOrder.customerName}</p>
                  <p><span className="font-semibold">الهاتف:</span> {selectedOrder.customerPhone}</p>
                  {selectedOrder.customerEmail && (
                    <p><span className="font-semibold">البريد:</span> {selectedOrder.customerEmail}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-4">📍 عنوان التسليم</h3>
                <div className="space-y-2">
                  <p><span className="font-semibold">الولاية:</span> {selectedOrder.wilaya}</p>
                  <p><span className="font-semibold">البلدية:</span> {selectedOrder.commune}</p>
                  <p><span className="font-semibold">العنوان:</span> {selectedOrder.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">📦 المنتجات</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-600">الكمية: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-blue-600">
                      {(item.price * item.quantity).toLocaleString()} دج
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span>المجموع الفرعي:</span>
                <span className="font-bold">{selectedOrder.subtotal?.toLocaleString() || 0} دج</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>الشحن:</span>
                <span className="font-bold">{selectedOrder.shippingCost?.toLocaleString() || 0} دج</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-blue-600 pt-2 border-t">
                <span>المجموع الكلي:</span>
                <span>{selectedOrder.total?.toLocaleString() || 0} دج</span>
              </div>
            </div>

            {qrCodeUrl && (
              <div className="text-center bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-900 mb-4">📱 رمز التتبع</h3>
                <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 mx-auto" />
                <p className="text-sm text-gray-600 mt-2">امسح الكود لتتبع الطلب</p>
              </div>
            )}
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
