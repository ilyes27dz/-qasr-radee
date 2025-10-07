'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import {
  ArrowRight, Package, Phone, MapPin, Calendar, DollarSign,
  User, Mail, Clock, CheckCircle, Truck, XCircle, AlertCircle,
  Edit, Printer, Save, MessageSquare
} from 'lucide-react';
import InvoicePrint from '@/components/InvoicePrint';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock },
  processing: { label: 'جاري التحضير', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Package },
  shipped: { label: 'في الطريق', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: Truck },
  delivered: { label: 'تم التسليم', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle },
};

const priorityConfig = {
  low: { label: 'منخفضة', color: 'bg-gray-100 text-gray-700' },
  medium: { label: 'متوسطة', color: 'bg-blue-100 text-blue-700' },
  high: { label: 'عالية', color: 'bg-orange-100 text-orange-700' },
  urgent: { label: 'عاجلة', color: 'bg-red-100 text-red-700' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    status: '',
    priority: '',
    notes: '',
  });

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${order?.orderNumber}`,
  });

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = () => {
    setLoading(true);
    try {
      // قراءة من localStorage
      const ordersData = JSON.parse(localStorage.getItem('orders') || '[]');
      
      console.log('📦 Looking for order:', orderId);
      console.log('📦 Total orders:', ordersData.length);
      
      // البحث عن الطلب بالـ id
      const foundOrder = ordersData.find((o: any) => o.id === orderId);
      
      if (!foundOrder) {
        console.log('❌ Order not found with id:', orderId);
        toast.error('الطلب غير موجود');
        router.push('/admin/orders');
        return;
      }
      
      console.log('✅ Order found:', foundOrder);
      setOrder(foundOrder);
      setFormData({
        status: foundOrder.status || 'pending',
        priority: foundOrder.priority || 'medium',
        notes: foundOrder.notes || '',
      });
      
    } catch (error) {
      console.error('❌ Error loading order:', error);
      toast.error('فشل تحميل الطلب');
      router.push('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    setUpdating(true);
    try {
      // قراءة الطلبات
      const ordersData = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // تحديث الطلب
      const updatedOrders = ordersData.map((o: any) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: formData.status,
            priority: formData.priority,
            notes: formData.notes,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      });
      
      // حفظ التحديثات
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      console.log('✅ Order updated:', orderId);
      toast.success('تم تحديث الطلب بنجاح ✅');
      setEditMode(false);
      fetchOrder();
      
    } catch (error) {
      console.error('❌ Error updating order:', error);
      toast.error('فشل التحديث');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-bold mb-4">الطلب غير موجود</p>
          <Link
            href="/admin/orders"
            className="text-blue-600 hover:text-blue-700 font-bold"
          >
            العودة للطلبات →
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const priorityInfo = priorityConfig[order.priority as keyof typeof priorityConfig] || priorityConfig.medium;
  const StatusIcon = statusInfo?.icon || Clock;

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/orders"
                className="p-2 hover:bg-gray-50 rounded-lg transition"
              >
                <ArrowRight className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  طلب رقم: {order.orderNumber}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString('ar-DZ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                <Printer className="w-5 h-5" />
                طباعة الفاتورة
              </button>

              {editMode ? (
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {updating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  <Edit className="w-5 h-5" />
                  تعديل الطلب
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <StatusIcon className="w-6 h-6" />
                حالة الطلب
              </h2>

              <div className="space-y-4">
                {editMode ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الحالة
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الأولوية
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        {Object.entries(priorityConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        ملاحظات
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        rows={4}
                        placeholder="أضف ملاحظات عن الطلب..."
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-semibold">الحالة:</span>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${statusInfo.color}`}
                      >
                        <StatusIcon className="w-5 h-5" />
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 font-semibold">الأولوية:</span>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold ${priorityInfo.color}`}
                      >
                        {priorityInfo.label}
                      </span>
                    </div>

                    {order.notes && (
                      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <p className="font-semibold text-blue-900 mb-1">ملاحظات:</p>
                            <p className="text-gray-700">{order.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6" />
                المنتجات ({order.items?.length || 0})
              </h2>

              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-3xl">
                      📦
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{item.productName}</h3>
                      <p className="text-sm text-gray-600">
                        الكمية: <span className="font-semibold">{item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold text-gray-900">
                        {item.price.toLocaleString()} دج
                      </p>
                      <p className="text-sm text-gray-600">
                        للقطعة
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black text-blue-600">
                        {(item.price * item.quantity).toLocaleString()} دج
                      </p>
                      <p className="text-xs text-gray-500">المجموع</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-600 font-semibold">المجموع الفرعي:</span>
                  <span className="font-bold text-gray-900">
                    {order.subtotal?.toLocaleString() || 0} دج
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-600 font-semibold">تكلفة الشحن:</span>
                  <span className="font-bold text-gray-900">
                    {order.shipping?.toLocaleString() || 0} دج
                  </span>
                </div>
                <div className="flex items-center justify-between text-2xl pt-3 border-t">
                  <span className="text-gray-900 font-black">الإجمالي:</span>
                  <span className="font-black text-blue-600">
                    {order.total?.toLocaleString() || 0} دج
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-6 h-6" />
                معلومات العميل
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">الاسم الكامل</p>
                  <p className="font-bold text-gray-900">{order.customerName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    رقم الهاتف
                  </p>
                  <p className="font-bold text-gray-900 font-mono">{order.customerPhone}</p>
                </div>

                {order.customerEmail && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني
                    </p>
                    <p className="font-bold text-gray-900">{order.customerEmail}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                معلومات الشحن
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">الولاية</p>
                  <p className="font-bold text-gray-900">{order.wilaya}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">البلدية</p>
                  <p className="font-bold text-gray-900">{order.commune}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">العنوان</p>
                  <p className="font-bold text-gray-900">{order.address}</p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-6 h-6" />
                معلومات الدفع
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">طريقة الدفع</p>
                  <p className="font-bold text-gray-900">
                    {order.paymentMethod === 'cash'
                      ? 'الدفع عند الاستلام 💵'
                      : order.paymentMethod === 'card'
                      ? 'بطاقة بنكية 💳'
                      : 'الدفع عند الاستلام'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">حالة الدفع</p>
                  <p className={`font-bold ${order.status === 'delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {order.status === 'delivered' ? 'تم الدفع ✓' : 'لم يتم الدفع بعد'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                التاريخ
              </h2>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">تاريخ الطلب</p>
                  <p className="font-bold text-gray-900">
                    {new Date(order.createdAt).toLocaleString('ar-DZ')}
                  </p>
                </div>

                {order.updatedAt && (
                  <div>
                    <p className="text-sm text-gray-500">آخر تحديث</p>
                    <p className="font-bold text-gray-900">
                      {new Date(order.updatedAt).toLocaleString('ar-DZ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Invoice for Print */}
      <div className="hidden">
        <InvoicePrint ref={invoiceRef} order={order} />
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }

        @media print {
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
