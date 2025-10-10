'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tag, Percent, Gift, Ticket, Plus, Edit, Trash2, Home, LogOut, Upload, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMarketingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'offers' | 'coupons'>('offers');
  
  // Offers State
  const [offers, setOffers] = useState<any[]>([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: 0,
    image: null as File | null,
    imagePreview: '',
    category: '',
    link: '',
    color: 'blue',
    endDate: '',
  });

  // Coupons State
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: 0,
    discountType: 'percentage',
    minAmount: 0,
    maxUses: 0,
    expiresAt: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    if (userData.role !== 'admin') {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    fetchOffers();
    fetchCoupons();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/coupons');
      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleOfferImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOfferForm({
        ...offerForm,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingOffer?.image || '';

      if (offerForm.image) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', offerForm.image);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      const offerData = {
        title: offerForm.title,
        description: offerForm.description,
        discount: offerForm.discount,
        image: imageUrl,
        category: offerForm.category,
        link: offerForm.link,
        color: offerForm.color,
        endDate: offerForm.endDate || null,
      };

      const url = editingOffer
        ? `/api/offers/${editingOffer.id}`
        : '/api/offers';
      
      const method = editingOffer ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData),
      });

      if (response.ok) {
        toast.success(editingOffer ? 'تم تحديث العرض' : 'تم إضافة العرض');
        setShowOfferModal(false);
        setEditingOffer(null);
        setOfferForm({
          title: '',
          description: '',
          discount: 0,
          image: null,
          imagePreview: '',
          category: '',
          link: '',
          color: 'blue',
          endDate: '',
        });
        fetchOffers();
      }
    } catch (error) {
      toast.error('فشل حفظ العرض');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العرض؟')) return;

    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('تم حذف العرض');
        fetchOffers();
      }
    } catch (error) {
      toast.error('فشل حذف العرض');
    }
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const couponData = {
        code: couponForm.code.toUpperCase(),
        discount: couponForm.discount,
        discountType: couponForm.discountType,
        minAmount: couponForm.minAmount || null,
        maxUses: couponForm.maxUses || null,
        expiresAt: couponForm.expiresAt || null,
      };

      const url = editingCoupon
        ? `/api/coupons/${editingCoupon.id}`
        : '/api/coupons';
      
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponData),
      });

      if (response.ok) {
        toast.success(editingCoupon ? 'تم تحديث الكوبون' : 'تم إضافة الكوبون');
        setShowCouponModal(false);
        setEditingCoupon(null);
        setCouponForm({
          code: '',
          discount: 0,
          discountType: 'percentage',
          minAmount: 0,
          maxUses: 0,
          expiresAt: '',
        });
        fetchCoupons();
      }
    } catch (error) {
      toast.error('فشل حفظ الكوبون');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكوبون؟')) return;

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('تم حذف الكوبون');
        fetchCoupons();
      }
    } catch (error) {
      toast.error('فشل حذف الكوبون');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const colorOptions = [
    { value: 'blue', label: 'أزرق' },
    { value: 'green', label: 'أخضر' },
    { value: 'orange', label: 'برتقالي' },
    { value: 'purple', label: 'بنفسجي' },
    { value: 'pink', label: 'زهري' },
    { value: 'red', label: 'أحمر' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">إدارة التسويق</h1>

            <div className="flex items-center gap-3">
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
        {/* Tabs */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${
                activeTab === 'offers'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Gift className="w-5 h-5" />
              <span>العروض ({offers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition ${
                activeTab === 'coupons'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Ticket className="w-5 h-5" />
              <span>الكوبونات ({coupons.length})</span>
            </button>
          </div>
        </div>

        {/* Offers Section */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">العروض والخصومات</h2>
              <button
                onClick={() => {
                  setEditingOffer(null);
                  setOfferForm({
                    title: '',
                    description: '',
                    discount: 0,
                    image: null,
                    imagePreview: '',
                    category: '',
                    link: '',
                    color: 'blue',
                    endDate: '',
                  });
                  setShowOfferModal(true);
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-bold"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة عرض</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div key={offer.id} className={`bg-white rounded-xl p-6 border-2 border-${offer.color}-200 hover:shadow-lg transition`}>
                  {offer.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img src={offer.image} alt={offer.title} className="w-full h-40 object-cover" />
                    </div>
                  )}

                  <div className={`flex items-center gap-2 mb-3 text-${offer.color}-600`}>
                    <Tag className="w-5 h-5" />
                    <span className="text-2xl font-bold">{offer.discount}%</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>

                  {offer.endDate && (
                    <div className={`bg-${offer.color}-50 rounded-lg p-2 mb-4 text-sm`}>
                      <span className={`text-${offer.color}-600 font-semibold`}>
                        ينتهي: {new Date(offer.endDate).toLocaleDateString('ar')}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingOffer(offer);
                        setOfferForm({
                          title: offer.title,
                          description: offer.description,
                          discount: offer.discount,
                          image: null,
                          imagePreview: offer.image || '',
                          category: offer.category || '',
                          link: offer.link,
                          color: offer.color,
                          endDate: offer.endDate ? offer.endDate.split('T')[0] : '',
                        });
                        setShowOfferModal(true);
                      }}
                      className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-bold"
                    >
                      <Edit className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition font-bold"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupons Section */}
        {activeTab === 'coupons' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">كوبونات الخصم</h2>
              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setCouponForm({
                    code: '',
                    discount: 0,
                    discountType: 'percentage',
                    minAmount: 0,
                    maxUses: 0,
                    expiresAt: '',
                  });
                  setShowCouponModal(true);
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-bold"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة كوبون</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-right p-4 font-bold">الكود</th>
                    <th className="text-right p-4 font-bold">الخصم</th>
                    <th className="text-right p-4 font-bold">الحد الأدنى</th>
                    <th className="text-right p-4 font-bold">مرات الاستخدام</th>
                    <th className="text-right p-4 font-bold">الحالة</th>
                    <th className="text-right p-4 font-bold">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-gray-50">
                      <td className="p-4 font-bold text-blue-600">{coupon.code}</td>
                      <td className="p-4">
                        {coupon.discount}{coupon.discountType === 'percentage' ? '%' : ' دج'}
                      </td>
                      <td className="p-4">{coupon.minAmount || '-'} دج</td>
                      <td className="p-4">{coupon.usedCount}/{coupon.maxUses || '∞'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {coupon.isActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCoupon(coupon);
                              setCouponForm({
                                code: coupon.code,
                                discount: coupon.discount,
                                discountType: coupon.discountType,
                                minAmount: coupon.minAmount || 0,
                                maxUses: coupon.maxUses || 0,
                                expiresAt: coupon.expiresAt ? coupon.expiresAt.split('T')[0] : '',
                              });
                              setShowCouponModal(true);
                            }}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}
            </h2>

            <form onSubmit={handleOfferSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">العنوان</label>
                <input
                  type="text"
                  value={offerForm.title}
                  onChange={(e) => setOfferForm({...offerForm, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">الوصف</label>
                <textarea
                  value={offerForm.description}
                  onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">نسبة الخصم (%)</label>
                  <input
                    type="number"
                    value={offerForm.discount}
                    onChange={(e) => setOfferForm({...offerForm, discount: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">اللون</label>
                  <select
                    value={offerForm.color}
                    onChange={(e) => setOfferForm({...offerForm, color: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  >
                    {colorOptions.map((color) => (
                      <option key={color.value} value={color.value}>{color.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">الفئة (اختياري)</label>
                <input
                  type="text"
                  value={offerForm.category}
                  onChange={(e) => setOfferForm({...offerForm, category: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  placeholder="مثال: ملابس، للتغذية..."
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">رابط الانتقال</label>
                <input
                  type="text"
                  value={offerForm.link}
                  onChange={(e) => setOfferForm({...offerForm, link: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  placeholder="/products?category=..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">تاريخ الانتهاء (اختياري)</label>
                <input
                  type="date"
                  value={offerForm.endDate}
                  onChange={(e) => setOfferForm({...offerForm, endDate: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  <Upload className="w-5 h-5 inline mr-2" />
                  صورة العرض (اختياري)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOfferImageChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                />
                {offerForm.imagePreview && (
                  <img 
                    src={offerForm.imagePreview} 
                    alt="معاينة" 
                    className="mt-3 w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCoupon ? 'تعديل الكوبون' : 'إضافة كوبون جديد'}
            </h2>

            <form onSubmit={handleCouponSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">كود الكوبون</label>
                <input
                  type="text"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg uppercase"
                  placeholder="SUMMER2025"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">نوع الخصم</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({...couponForm, discountType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (دج)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">قيمة الخصم</label>
                  <input
                    type="number"
                    value={couponForm.discount}
                    onChange={(e) => setCouponForm({...couponForm, discount: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">الحد الأدنى للطلب (دج)</label>
                  <input
                    type="number"
                    value={couponForm.minAmount}
                    onChange={(e) => setCouponForm({...couponForm, minAmount: parseFloat(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">عدد مرات الاستخدام</label>
                  <input
                    type="number"
                    value={couponForm.maxUses}
                    onChange={(e) => setCouponForm({...couponForm, maxUses: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                    placeholder="0 = غير محدود"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">تاريخ الانتهاء (اختياري)</label>
                <input
                  type="date"
                  value={couponForm.expiresAt}
                  onChange={(e) => setCouponForm({...couponForm, expiresAt: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
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
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
