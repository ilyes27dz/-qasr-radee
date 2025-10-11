'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Save, Home, LogOut, Building2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

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

export default function ShippingPricesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [prices, setPrices] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    setUser(userData);

    if (userData.role !== 'admin') {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    loadPrices();
  }, []);

  const loadPrices = async () => {
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

      // ✅ تعبئة الأسعار الافتراضية للولايات غير الموجودة
      ALGERIA_WILAYAS_ORDERED.forEach(w => {
        if (!pricesMap[w.name]) {
          pricesMap[w.name] = { home: 600, office: 500 };
        }
      });

      setPrices(pricesMap);
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تحميل الأسعار');
    }
  };

  const handlePriceChange = (wilayaName: string, type: 'home' | 'office', value: string) => {
    setPrices((prev: any) => ({
      ...prev,
      [wilayaName]: {
        ...prev[wilayaName],
        [type]: parseInt(value) || 0
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const savePromises = ALGERIA_WILAYAS_ORDERED.map(w => 
        fetch('/api/shipping-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wilayaCode: w.code,
            wilayaName: w.name,
            homePrice: prices[w.name]?.home || 600,
            officePrice: prices[w.name]?.office || 500
          })
        })
      );

      await Promise.all(savePromises);
      toast.success('تم حفظ الأسعار بنجاح! ✅');
    } catch (error) {
      toast.error('فشل حفظ الأسعار');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Truck className="w-8 h-8 text-blue-600" />
              <div>
                <span className="text-lg font-bold text-gray-900">إدارة أسعار التوصيل</span>
                <p className="text-xs text-gray-500">58 ولاية</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
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
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">أسعار التوصيل</h2>
              <p className="text-gray-600">مرتبة حسب الترقيم الرسمي (01-58)</p>
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALGERIA_WILAYAS_ORDERED.map((wilaya) => (
              <div key={wilaya.code} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {String(wilaya.code).padStart(2, '0')}
                  </span>
                  <h3 className="font-bold text-gray-900">{wilaya.name}</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Building2 className="w-4 h-4" />
                      توصيل للمكتب
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={prices[wilaya.name]?.office || 500}
                        onChange={(e) => handlePriceChange(wilaya.name, 'office', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        min="0"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">دج</span>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Home className="w-4 h-4" />
                      توصيل للمنزل
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={prices[wilaya.name]?.home || 600}
                        onChange={(e) => handlePriceChange(wilaya.name, 'home', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                        min="0"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">دج</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    الفرق: {(prices[wilaya.name]?.home || 600) - (prices[wilaya.name]?.office || 500)} دج
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
