'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, CheckCircle, Heart, ShoppingCart, Sparkles, Home as HomeIcon, Building2 } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import { formatPrice } from '@/lib/utils';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import toast from 'react-hot-toast';

interface AlgeriaCity {
  id: number;
  commune_name: string;
  commune_name_ascii: string;
  daira_name: string;
  wilaya_code: string;
  wilaya_name: string;
  wilaya_name_ascii: string;
}

const ALGERIA_WILAYAS_ORDERED = [
  { code: 1, name: 'أدرار' },
  { code: 2, name: 'الشلف' },
  { code: 3, name: 'الأغواط' },
  { code: 4, name: 'أم البواقي' },
  { code: 5, name: 'باتنة' },
  { code: 6, name: 'بجاية' },
  { code: 7, name: 'بسكرة' },
  { code: 8, name: 'بشار' },
  { code: 9, name: 'البليدة' },
  { code: 10, name: 'البويرة' },
  { code: 11, name: 'تمنراست' },
  { code: 12, name: 'تبسة' },
  { code: 13, name: 'تلمسان' },
  { code: 14, name: 'تيارت' },
  { code: 15, name: 'تيزي وزو' },
  { code: 16, name: 'الجزائر' },
  { code: 17, name: 'الجلفة' },
  { code: 18, name: 'جيجل' },
  { code: 19, name: 'سطيف' },
  { code: 20, name: 'سعيدة' },
  { code: 21, name: 'سكيكدة' },
  { code: 22, name: 'سيدي بلعباس' },
  { code: 23, name: 'عنابة' },
  { code: 24, name: 'قالمة' },
  { code: 25, name: 'قسنطينة' },
  { code: 26, name: 'المدية' },
  { code: 27, name: 'مستغانم' },
  { code: 28, name: 'المسيلة' },
  { code: 29, name: 'معسكر' },
  { code: 30, name: 'ورقلة' },
  { code: 31, name: 'وهران' },
  { code: 32, name: 'البيض' },
  { code: 33, name: 'إليزي' },
  { code: 34, name: 'برج بوعريريج' },
  { code: 35, name: 'بومرداس' },
  { code: 36, name: 'الطارف' },
  { code: 37, name: 'تندوف' },
  { code: 38, name: 'تيسمسيلت' },
  { code: 39, name: 'الوادي' },
  { code: 40, name: 'خنشلة' },
  { code: 41, name: 'سوق أهراس' },
  { code: 42, name: 'تيبازة' },
  { code: 43, name: 'ميلة' },
  { code: 44, name: 'عين الدفلى' },
  { code: 45, name: 'النعامة' },
  { code: 46, name: 'عين تموشنت' },
  { code: 47, name: 'غرداية' },
  { code: 48, name: 'غليزان' },
  { code: 49, name: 'تيميمون' },
  { code: 50, name: 'برج باجي مختار' },
  { code: 51, name: 'أولاد جلال' },
  { code: 52, name: 'بني عباس' },
  { code: 53, name: 'عين صالح' },
  { code: 54, name: 'عين قزام' },
  { code: 55, name: 'تقرت' },
  { code: 56, name: 'جانت' },
  { code: 57, name: 'المغير' },
  { code: 58, name: 'المنيعة' }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, getCartTotal, clearCart, getCartCount, createOrder } = useCart();
  const { getWishlistCount } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [algeriaData, setAlgeriaData] = useState<AlgeriaCity[]>([]);
  const [wilayas, setWilayas] = useState<string[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);
  const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');

  const [shippingPrices, setShippingPrices] = useState<any>({});

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    wilaya: '',
    commune: '',
    address: '',
    paymentMethod: 'cash_on_delivery',
    notes: '',
  });

  useEffect(() => {
    try {
      const userData = localStorage.getItem('customer_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }

    loadAlgeriaData();
    loadShippingPrices();
  }, []);

  useEffect(() => {
    if (algeriaData.length > 0) {
      console.log('📊 البيانات جاهزة!');
      console.log('عدد بلديات الشلف (02):', algeriaData.filter(d => d.wilaya_code === '02').length);
      console.log('عدد بلديات بجاية (06):', algeriaData.filter(d => d.wilaya_code === '06').length);
      console.log('مثال بلدية:', algeriaData.find(d => d.wilaya_code === '02'));
    }
  }, [algeriaData]);

  const loadAlgeriaData = async () => {
    try {
      const response = await fetch('/algeria_cities.json');
      let data: AlgeriaCity[] = await response.json();
      
      data = data.map(item => ({
        ...item,
        wilaya_name: item.wilaya_name.trim(),
        commune_name: item.commune_name.trim(),
        daira_name: item.daira_name.trim(),
      }));
      
      setAlgeriaData(data);
      
      const orderedWilayas = ALGERIA_WILAYAS_ORDERED.map(w => w.name);
      setWilayas(orderedWilayas);
      
      console.log('✅ تم تحميل', data.length, 'بلدية مع ترتيب الولايات الرسمي');
    } catch (error) {
      console.error('❌ فشل تحميل البيانات:', error);
      toast.error('فشل تحميل بيانات الولايات');
    }
  };

  const loadShippingPrices = async () => {
    try {
      const response = await fetch('/api/shipping-prices');
      const data = await response.json();
      
      const pricesMap: any = {};
      data.forEach((item: any) => {
        pricesMap[item.wilayaName] = {
          home: item.homePrice,
          office: item.officePrice
        };
      });
      
      setShippingPrices(pricesMap);
      console.log('✅ تم تحميل أسعار الشحن من API');
    } catch (error) {
      console.error('❌ Error loading prices:', error);
      toast.error('فشل تحميل أسعار الشحن');
    }
  };

  const calculateShippingCost = (): number => {
    if (!formData.wilaya) return 500;

    const wilayaPrice = shippingPrices[formData.wilaya];
    
    if (wilayaPrice) {
      return deliveryType === 'home' ? wilayaPrice.home : wilayaPrice.office;
    }

    return deliveryType === 'home' ? 600 : 500;
  };

  const shippingCost = calculateShippingCost();
  const cartTotal = getCartTotal();

  const discount = appliedCoupon 
    ? appliedCoupon.discountType === 'percentage'
      ? (cartTotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount
    : 0;

  const total = cartTotal + shippingCost - discount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('أدخل كود الكوبون');
      return;
    }

    setCouponLoading(true);
    try {
      const response = await fetch(`/api/coupons/validate?code=${couponCode.toUpperCase()}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'كود غير صحيح');
        return;
      }

      if (data.minAmount && cartTotal < data.minAmount) {
        toast.error(`الحد الأدنى للطلب ${data.minAmount.toLocaleString()} دج`);
        return;
      }

      setAppliedCoupon(data);
      toast.success(`تم تطبيق خصم ${data.discount}${data.discountType === 'percentage' ? '%' : ' دج'} 🎉`);
    } catch (error) {
      toast.error('فشل التحقق من الكوبون');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('تم إلغاء الكوبون');
  };

  // ✅ دالة إنشاء الطلب - مصححة بالكامل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.fullName || !formData.phone || !formData.wilaya || !formData.commune) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    try {
      // ✅ استخدام دالة createOrder من السياق بدلاً من fetch مباشرة
      const result = await createOrder({
        customerName: formData.fullName,
        customerEmail: user?.email || formData.email || '',
        customerPhone: formData.phone,
        address: formData.address,
        wilaya: formData.wilaya,
        commune: formData.commune,
        notes: formData.notes,
        paymentMethod: formData.paymentMethod,
        deliveryType: deliveryType,
        subtotal: cartTotal,
        shippingCost: shippingCost,
        discount: discount,
        total: total,
        couponCode: appliedCoupon?.code || null,
        items: cartItems.map(item => ({
          product: item.product,
          quantity: item.quantity,
          color: item.color // ✅ إرسال اللون مع كل عنصر
        })),
      });

      clearCart();
      toast.success('تم إرسال طلبك بنجاح! سنتصل بك قريباً ✅', { duration: 5000 });
      router.push(`/orders?number=${result.order.orderNumber}`);
    } catch (error: any) {
      console.error('❌ Order error:', error);
      toast.error(error.message || 'حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'wilaya' && value && algeriaData.length > 0) {
      const selectedWilaya = ALGERIA_WILAYAS_ORDERED.find(w => w.name === value);
      
      if (selectedWilaya) {
        const wilayaCode = selectedWilaya.code.toString().padStart(2, '0');
        
        const wilayaCommunes = algeriaData
          .filter(item => item.wilaya_code === wilayaCode)
          .map(item => item.commune_name)
          .sort((a, b) => a.localeCompare(b, 'ar'));
        
        setCommunes(wilayaCommunes);
        console.log(`✅ ${value} (${wilayaCode}): ${wilayaCommunes.length} بلدية`);
        
        if (wilayaCommunes.length === 0) {
          console.error('❌ لم يتم العثور على بلديات!');
          console.log('عينة من البيانات:', algeriaData.slice(0, 3));
        }
      }
      
      setFormData(prev => ({ ...prev, commune: '' }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center font-arabic px-4">
        <div className="text-center animate-fade-in">
          <div className="text-[120px] md:text-[200px] mb-4 md:mb-8 animate-bounce-slow">🛒</div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6">السلة فارغة</h2>
          <p className="text-gray-600 text-lg md:text-xl mb-6 md:mb-10">أضف منتجات للسلة أولاً</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 md:px-10 py-3 md:py-5 rounded-full hover:from-blue-700 hover:to-indigo-700 transition font-bold shadow-2xl text-base md:text-lg"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            تصفح المنتجات
          </Link>
        </div>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
          .font-arabic { font-family: 'Cairo', sans-serif !important; }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fade-in 0.6s ease-out; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-arabic">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="hover:scale-110 transition">
              <Logo size="small" />
            </Link>

            <div className="flex items-center gap-2 md:gap-4">
              <UserMenu />
              
              <Link href="/wishlist" className="relative hover:scale-110 transition">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-600 hover:text-red-500 transition" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -left-1 md:-top-2 md:-left-2 bg-red-500 text-white text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold text-[10px] md:text-xs">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              
              <Link href="/cart" className="relative hover:scale-110 transition">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-600 hover:text-blue-600 transition" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -left-1 md:-top-2 md:-left-2 bg-blue-600 text-white text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold text-[10px] md:text-xs">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-10 md:py-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-5 md:top-10 right-5 md:right-10 text-6xl md:text-9xl animate-bounce-slow">✅</div>
          <div className="absolute bottom-5 md:bottom-10 left-5 md:left-10 text-6xl md:text-9xl animate-float">🎉</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-7xl font-black text-white mb-3 md:mb-6 drop-shadow-2xl">
              إتمام الطلب ✅
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-semibold drop-shadow-lg">
              املأ البيانات لإتمام طلبك
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border-2 border-gray-200 shadow-xl">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <Truck className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900">معلومات الشحن</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2 md:mb-3 font-bold text-sm md:text-lg">الاسم الكامل *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-sm md:text-lg"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 md:mb-3 font-bold text-sm md:text-lg">رقم الهاتف *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-sm md:text-lg"
                      placeholder="0555 00 00 00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 md:mb-3 font-bold text-sm md:text-lg">الولاية *</label>
                    <select
                      name="wilaya"
                      value={formData.wilaya}
                      onChange={handleChange}
                      className="w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-sm md:text-lg"
                      required
                    >
                      <option value="">اختر الولاية</option>
                      {wilayas.map((wilaya) => (
                        <option key={wilaya} value={wilaya}>
                          {wilaya}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 md:mb-3 font-bold text-sm md:text-lg">البلدية *</label>
                    <select
                      name="commune"
                      value={formData.commune}
                      onChange={handleChange}
                      className="w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-sm md:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={!formData.wilaya}
                    >
                      <option value="">اختر البلدية</option>
                      {communes.map((commune) => (
                        <option key={commune} value={commune}>
                          {commune}
                        </option>
                      ))}
                    </select>
                    {!formData.wilaya && (
                      <p className="text-xs text-gray-500 mt-1">اختر الولاية أولاً</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-3 font-bold text-sm md:text-lg">
                      نوع التوصيل *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                        deliveryType === 'home' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="deliveryType"
                          value="home"
                          checked={deliveryType === 'home'}
                          onChange={(e) => setDeliveryType('home')}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <HomeIcon className="w-5 h-5 text-blue-600" />
                            <p className="font-bold text-gray-900 text-sm md:text-base">توصيل للمنزل</p>
                          </div>
                          <p className="text-xs text-gray-500">حسب الولاية</p>
                        </div>
                      </label>
                      
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                        deliveryType === 'office' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="deliveryType"
                          value="office"
                          checked={deliveryType === 'office'}
                          onChange={(e) => setDeliveryType('office')}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <p className="font-bold text-gray-900 text-sm md:text-base">توصيل للمكتب</p>
                          </div>
                          <p className="text-xs text-gray-500">حسب الولاية</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 md:mb-3 font-bold text-sm md:text-lg">العنوان التفصيلي (اختياري)</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-sm md:text-lg"
                      placeholder="أدخل عنوانك بالتفصيل (اختياري)"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2 md:mb-3 font-bold text-sm md:text-lg">ملاحظات إضافية (اختياري)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 md:px-5 py-2 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-xl md:rounded-2xl text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-sm md:text-lg"
                      placeholder="أي ملاحظات أو تعليمات خاصة"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border-2 border-gray-200 shadow-xl">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h2 className="text-xl md:text-3xl font-black text-gray-900">طريقة الدفع</h2>
                </div>

                <div className="space-y-3 md:space-y-4">
                  <label className="flex items-center gap-3 md:gap-5 p-4 md:p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-2xl md:rounded-3xl cursor-pointer hover:shadow-lg transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === 'cash_on_delivery'}
                      onChange={handleChange}
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-2xl md:text-4xl">💰</span>
                        <span className="text-gray-900 font-black text-base md:text-xl">الدفع عند الاستلام</span>
                      </div>
                      <p className="text-gray-600 text-xs md:text-base mt-1 md:mt-2 font-medium">
                        ادفع نقداً عند استلام المنتج
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 md:gap-5 p-4 md:p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl md:rounded-3xl cursor-not-allowed opacity-60">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="chargily_pay"
                      disabled
                      className="w-5 h-5 md:w-6 md:h-6"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <span className="text-2xl md:text-4xl">💳</span>
                        <span className="text-gray-600 font-bold text-base md:text-xl">الدفع الإلكتروني</span>
                        <span className="bg-gray-200 text-gray-600 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 rounded-full font-bold">
                          قريباً
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs md:text-base mt-1 md:mt-2 font-medium">
                        الدفع ببطاقة بنكية
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl md:rounded-3xl p-4 md:p-8 border-2 border-blue-200 shadow-2xl lg:sticky lg:top-24">
                <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-4 md:mb-8 flex items-center gap-2 md:gap-3">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                  ملخص الطلب
                </h2>

                <div className="space-y-3 md:space-y-4 mb-4 md:mb-8 max-h-48 md:max-h-64 overflow-y-auto">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-gray-600 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-sm text-sm md:text-base">
                      <div>
                        <span className="font-bold block">
                          {item.product.nameAr} × {item.quantity}
                        </span>
                        {item.color && (
                          <span className="text-xs text-gray-500">
                            اللون: {item.color}
                          </span>
                        )}
                      </div>
                      <span className="font-black">
                        {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl md:rounded-2xl border-2 border-purple-200">
                  <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="text-xl md:text-2xl">🎟️</span>
                    هل لديك كود خصم؟
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="أدخل الكود"
                      className="flex-1 px-2 md:px-3 py-1 md:py-2 border-2 border-purple-200 rounded-lg uppercase font-bold text-xs md:text-sm"
                      disabled={appliedCoupon !== null}
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="px-3 md:px-4 py-1 md:py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition text-xs md:text-sm"
                      >
                        إلغاء
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading}
                        className="px-3 md:px-4 py-1 md:py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50 text-xs md:text-sm"
                      >
                        {couponLoading ? '...' : 'تطبيق'}
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 text-xs md:text-sm text-green-600 font-bold flex items-center gap-1">
                      ✅ تم تطبيق الكوبون: {appliedCoupon.code}
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-blue-200 pt-4 md:pt-6 space-y-3 md:space-y-4 mb-4 md:mb-8">
                  <div className="flex justify-between text-gray-600 text-sm md:text-lg">
                    <span className="font-semibold">المجموع الفرعي</span>
                    <span className="font-black">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm md:text-lg">
                    <div className="flex flex-col">
                      <span className="font-semibold">تكلفة الشحن</span>
                      <span className="text-xs text-gray-500">
                        {formData.wilaya || 'اختر الولاية'} • {deliveryType === 'home' ? 'منزل' : 'مكتب'}
                      </span>
                    </div>
                    <span className="font-black">{formatPrice(shippingCost)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 text-sm md:text-lg">
                      <span className="font-semibold">الخصم ({appliedCoupon.code})</span>
                      <span className="font-black">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="border-t-2 border-blue-200 pt-3 md:pt-4">
                    <div className="flex justify-between text-2xl md:text-3xl font-black text-gray-900">
                      <span>المجموع الكلي</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 md:py-5 rounded-xl md:rounded-2xl font-black hover:from-green-700 hover:to-emerald-700 transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-base md:text-lg"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin text-xl md:text-2xl">⏳</span>
                      <span>جاري إرسال الطلب...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                      <span>تأكيد الطلب</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4 md:mb-8">
            <Logo size="small" />
          </div>
          
          <p className="text-gray-400 mb-4 md:mb-8 text-sm md:text-lg">
            متجركم الموثوق لملابس وأدوات الأطفال والرضع
          </p>
          
          <div className="flex gap-4 md:gap-8 justify-center text-xs md:text-sm text-gray-400 font-semibold">
            <Link href="/about" className="hover:text-white transition">من نحن</Link>
            <Link href="/contact" className="hover:text-white transition">اتصل بنا</Link>
            <Link href="/orders/track" className="hover:text-white transition">تتبع الطلب</Link>
          </div>
          
          <p className="text-gray-600 text-xs md:text-sm mt-6 md:mt-10">
            © 2025 قصر الرضيع. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
}
