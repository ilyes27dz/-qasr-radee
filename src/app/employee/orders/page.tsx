'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package, Search, RefreshCw, LogOut, Phone, MapPin,
  Clock, CheckCircle, Truck, ArrowRight, User, Bell,
  Eye, Home, Calendar, DollarSign, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { 
    label: 'قيد الانتظار', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300', 
    icon: Clock,
    nextStatus: 'processing',
    nextLabel: 'ابدأ التحضير'
  },
  processing: { 
    label: 'جاري التحضير', 
    color: 'bg-blue-100 text-blue-700 border-blue-300', 
    icon: Package,
    nextStatus: 'shipped',
    nextLabel: 'جاهز للشحن'
  },
  shipped: { 
    label: 'في الطريق', 
    color: 'bg-purple-100 text-purple-700 border-purple-300', 
    icon: Truck,
    nextStatus: 'delivered',
    nextLabel: 'تم التسليم'
  },
  delivered: { 
    label: 'تم التسليم', 
    color: 'bg-green-100 text-green-700 border-green-300', 
    icon: CheckCircle,
    nextStatus: null,
    nextLabel: ''
  },
  cancelled: { 
    label: 'ملغي', 
    color: 'bg-red-100 text-red-700 border-red-300', 
    icon: AlertCircle,
    nextStatus: null,
    nextLabel: ''
  },
};

export default function EmployeeOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const employeeUser = localStorage.getItem('admin_user');
    if (!employeeUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(employeeUser);
    if (!userData.permissions?.includes('orders')) {
      toast.error('ليس لديك صلاحية إدارة الطلبات');
      router.push('/staff/login');
      return;
    }

    setUser(userData);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تحميل الطلبات');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('تم تحديث حالة الطلب ✅');
        fetchOrders();
      } else {
        toast.error('فشل التحديث');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ');
    }
  };

  const getStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  };

  const filteredOrders = orders
    .filter(order => {
      if (filterStatus !== 'all' && order.status !== filterStatus) return false;
      if (searchQuery) {
        return (
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customerPhone.includes(searchQuery)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">إدارة الطلبات</h1>
                <p className="text-sm text-gray-500">مرحباً {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="p-2 hover:bg-gray-50 rounded-lg transition"
                title="تحديث"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <Link
                href="/"
                className="p-2 hover:bg-gray-50 rounded-lg transition"
                title="الصفحة الرئيسية"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
              >
                <LogOut className="w-5 h-5" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">الكل</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">جديدة</p>
                <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
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

          <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
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

          <div className="bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition">
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
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الكل ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                  filterStatus === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                جديدة ({stats.pending})
              </button>
              <button
                onClick={() => setFilterStatus('processing')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                  filterStatus === 'processing'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                تحضير ({stats.processing})
              </button>
              <button
                onClick={() => setFilterStatus('shipped')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition ${
                  filterStatus === 'shipped'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                الطريق ({stats.shipped})
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-bold">لا توجد طلبات</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = statusInfo?.icon || Clock;

              return (
                <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Side - Order Info */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-600 text-lg">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleString('ar-DZ')}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-mono text-gray-700">{order.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{order.wilaya} - {order.commune}</span>
                        </div>
                      </div>

                      {/* Products Preview */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-2 font-semibold">المنتجات:</p>
                        <div className="space-y-1">
                          {order.items?.slice(0, 2).map((item: any, idx: number) => (
                            <p key={idx} className="text-sm text-gray-700">
                              • {item.productName} × {item.quantity}
                            </p>
                          ))}
                          {order.items?.length > 2 && (
                            <p className="text-xs text-blue-600 font-semibold">
                              +{order.items.length - 2} منتج إضافي
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Status & Actions */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 mb-4 ${statusInfo.color}`}>
                          <StatusIcon className="w-5 h-5" />
                          {statusInfo.label}
                        </span>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500">المبلغ الإجمالي</p>
                          <p className="text-3xl font-black text-blue-600 flex items-center gap-2">
                            <DollarSign className="w-6 h-6" />
                            {order.total.toLocaleString()} دج
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {statusInfo.nextStatus && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, statusInfo.nextStatus!)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-bold shadow-lg hover:shadow-xl"
                          >
                            <ArrowRight className="w-5 h-5" />
                            {statusInfo.nextLabel}
                          </button>
                        )}

                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                        >
                          <Eye className="w-5 h-5" />
                          عرض التفاصيل والطباعة
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
