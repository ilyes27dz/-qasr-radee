'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Package, Heart, MapPin, Settings, LogOut, ArrowRight,
  ShoppingBag, Star, Award, Calendar, Mail, Phone, Edit, Lock,
  Eye, EyeOff, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  
  // تغيير كلمة المرور
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const customerUser = localStorage.getItem('customer_user');
    if (!customerUser) {
      toast.error('يرجى تسجيل الدخول أولاً');
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(customerUser);
      setUser(userData);
      
      // قراءة التبويب من URL
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
      
      fetchAccountData(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('customer_user');
      toast.error('حدث خطأ في تسجيل الدخول');
      router.push('/login');
    }
  }, [router]);

  // مراقبة تغيير التبويب وتحديث المفضلة
  useEffect(() => {
    if (activeTab === 'wishlist' && typeof window !== 'undefined') {
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(savedWishlist);
    }
  }, [activeTab]);

  const fetchAccountData = async (userData: any) => {
    setLoading(true);
    try {
      // جلب الطلبات
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = savedOrders.filter((o: any) => 
        o.customerEmail === userData.email || o.customerId === userData.id
      );
      setOrders(userOrders);

      // جلب المفضلة
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(savedWishlist);
    } catch (error) {
      console.error('Error fetching data:', error);
      setOrders([]);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      localStorage.removeItem('customer_user');
      toast.success('تم تسجيل الخروج');
      router.push('/');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('كلمة المرور الجديدة غير متطابقة');
        setPasswordLoading(false);
        return;
      }

      if (passwordData.newPassword.length < 6) {
        toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        setPasswordLoading(false);
        return;
      }

      const response = await fetch('/api/customers/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user.id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'حدث خطأ أثناء تغيير كلمة المرور');
        setPasswordLoading(false);
        return;
      }

      toast.success('تم تغيير كلمة المرور بنجاح! ✅');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء تغيير كلمة المرور');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRemoveFromWishlist = (productId: string) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast.success('تم إزالة المنتج من المفضلة');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'processing': return 'جاري التحضير';
      case 'shipped': return 'في الطريق';
      case 'delivered': return 'تم التسليم';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-arabic">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600 font-bold">جاري التحميل...</p>
        </div>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
          .font-arabic { font-family: 'Cairo', sans-serif !important; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl">🍼</span>
              <span className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition">
                قصر الرضيع
              </span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-semibold"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للمتجر
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-24">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-4xl font-black">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
                <p className="text-gray-500 text-sm truncate">{user?.email}</p>
                
                {/* النقاط */}
                <div className="mt-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border-2 border-yellow-200">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-2xl font-black text-gray-900">{user?.points || 0}</span>
                  </div>
                  <p className="text-xs text-gray-600">نقاط المكافآت</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'overview'
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>نظرة عامة</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>طلباتي</span>
                  {orders.length > 0 && (
                    <span className="mr-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'wishlist'
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>المفضلة</span>
                  {wishlistItems.length > 0 && (
                    <span className="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>الإعدادات</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </button>
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                  <h1 className="text-3xl font-black mb-2">مرحباً، {user?.name}! 👋</h1>
                  <p className="text-blue-100">نحن سعداء بوجودك في قصر الرضيع</p>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-1">إجمالي الطلبات</p>
                    <p className="text-3xl font-black text-gray-900">{orders.length}</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                      <ShoppingBag className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-1">إجمالي المشتريات</p>
                    <p className="text-3xl font-black text-gray-900">
                      {orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()} دج
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-sm border">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                      <Award className="w-6 h-6 text-yellow-600" />
                    </div>
                    <p className="text-gray-600 text-sm mb-1">نقاط المكافآت</p>
                    <p className="text-3xl font-black text-gray-900">{user?.points || 0}</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">آخر الطلبات</h3>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">لم تقم بأي طلبات بعد</p>
                      <Link
                        href="/products"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                      >
                        تصفح المنتجات
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order, index) => (
                        <div key={order.id || index} className="border rounded-xl p-4 hover:shadow-md transition">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-bold text-gray-900">#{order.orderNumber}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('ar-DZ')}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-blue-600">
                              {order.total?.toLocaleString()} دج
                            </p>
                            <Link
                              href={`/orders/track?number=${order.orderNumber}`}
                              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
                            >
                              تتبع الطلب →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-2xl font-black text-gray-900 mb-6">طلباتي</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-20">
                    <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 font-bold mb-4">لا توجد طلبات</p>
                    <Link
                      href="/products"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      ابدأ التسوق
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <div key={order.id || index} className="border rounded-xl p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xl font-bold text-gray-900 mb-1">#{order.orderNumber}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt).toLocaleDateString('ar-DZ', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">عدد المنتجات</p>
                            <p className="font-bold text-gray-900">{order.items?.length || 0} منتج</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">المبلغ الإجمالي</p>
                            <p className="text-2xl font-black text-blue-600">{order.total?.toLocaleString()} دج</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Link
                            href={`/orders/track?number=${order.orderNumber}`}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-center"
                          >
                            تتبع الطلب
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-2xl font-black text-gray-900 mb-6">المفضلة</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-20">
                    <Heart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 font-bold mb-4">قائمة المفضلة فارغة</p>
                    <Link
                      href="/products"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                      تصفح المنتجات
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {wishlistItems.map((item: any) => (
                      <div key={item.id} className="border rounded-xl p-4 hover:shadow-lg transition relative">
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="absolute top-2 left-2 p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition z-10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <Link href={`/products/${item.id}`}>
                          <div className="aspect-square bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                            {item.images && item.images[0] ? (
                              <img src={item.images[0]} alt={item.nameAr} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-6xl">
                                {item.categoryId ? ['🍼', '👶', '👕', '🎒', '🛁', '🌙'][parseInt(item.categoryId)] || '📦' : '📦'}
                              </span>
                            )}
                          </div>
                        </Link>
                        
                        <Link href={`/products/${item.id}`}>
                          <h3 className="font-bold text-gray-900 mb-2 hover:text-blue-600 transition">{item.nameAr}</h3>
                        </Link>
                        
                        <p className="text-blue-600 font-bold text-lg mb-3">
                          {(item.salePrice || item.price)?.toLocaleString()} دج
                        </p>
                        
                        <Link
                          href={`/products/${item.id}`}
                          className="block w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition text-center"
                        >
                          عرض المنتج
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <h2 className="text-2xl font-black text-gray-900 mb-6">إعدادات الحساب</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" />
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={user?.phone || ''}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                    />
                  </div>

                  <div className="pt-6 border-t">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      تغيير كلمة المرور
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-black text-gray-900 mb-6">تغيير كلمة المرور</h3>
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الحالية</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    placeholder="••••••••"
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

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    placeholder="••••••••"
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
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تأكيد كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                    placeholder="••••••••"
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    'حفظ'
                  )}
                </button>
              </div>
            </form>
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
