// src/app/products/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart, Star, Plus, Minus, Truck, Shield, RefreshCw } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import Footer from '@/components/Footer';
import ProductReviewsList from '@/components/ProductReviewsList';

import toast from 'react-hot-toast';

// ====================================================================
// 🎨 وظيفة مساعدة لتحويل اسم اللون العربي إلى كود Hex
// ====================================================================
const colorMap: Record<string, string> = {
  'أبيض': '#FFFFFF',
  'أسود': '#000000',
  'أحمر': '#EF4444', 
  'أزرق': '#3B82F6', 
  'أخضر': '#10B981', 
  'أصفر': '#F59E0B', 
  'وردي': '#EC4899', 
  'رمادي': '#6B7280', 
  'بني': '#964B00',  
};

const getColorCode = (colorName: string): string => {
  return colorMap[colorName] || '#CCCCCC'; // رمادي فاتح كلون افتراضي
};
// ====================================================================

// افتراضية بسيطة لنوع المنتج مع متغيرات الألوان
interface ProductVariant {
    color: string;
    stock: number;
    images?: string[];
}

interface Product {
    id: string;
    nameAr: string;
    descriptionAr?: string;
    price: number;
    salePrice?: number;
    stock: number; // المخزون العام (يجب استخدامه فقط إذا لم يكن هناك variants)
    rating: number;
    sales: number;
    images: string[];
    categoryId: string;
    category: string;
    ageGroup?: string;
    gender?: string;
    badge?: string;
    specifications?: string;
    variants?: ProductVariant[]; // قائمة متغيرات اللون والمخزون
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  // 🆕 الحالة الجديدة لتخزين اللون المختار
  const [selectedColor, setSelectedColor] = useState<string | null>(null); 
  
  const { addToCart, getCartCount } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount } = useWishlist();

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data: Product = await response.json();
      console.log('✅ Product loaded:', data);
      setProduct(data);

      // 🆕 تعيين اللون الافتراضي: أول لون متوفر
      if (data.variants && data.variants.length > 0) {
        // نختار أول لون متوفر في المخزون
        const firstAvailableColor = data.variants.find(v => v.stock > 0)?.color || data.variants[0].color;
        setSelectedColor(firstAvailableColor);
      }
      // ------------------------------------
      
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      toast.error('المنتج غير موجود');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // 🆕 تحقق من اختيار اللون إذا كان المنتج يتطلب ذلك
    if (product.variants && product.variants.length > 0 && !selectedColor) {
      toast.error('الرجاء اختيار لون المنتج أولاً');
      return;
    }

    // ******************************************************
    // ✅ الحل النهائي: تمرير خصائص المنتج مدمجة مع الكمية واللون.
    // هذا يتطلب أن تكون واجهة CartItem هي: interface CartItem extends Product { quantity: number; color: string | null; }
    // ******************************************************
    addToCart({ 
        ...product,            // نشر جميع خصائص كائن المنتج (id, nameAr, price, etc.)
        quantity: quantity,       // إضافة الكمية
        color: selectedColor,     // إضافة اللون المختار
    });
    
    toast.success(`تمت إضافة ${quantity} من ${product.nameAr} للسلة ✅`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    const productWithColor = { 
      ...product, 
      // حفظ اللون المختار، أو أول لون كإجراء احتياطي
      selectedColor: selectedColor || product.variants?.[0]?.color 
    };
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('تم إزالة المنتج من المفضلة');
    } else {
      addToWishlist(productWithColor);
      toast.success('تمت إضافة المنتج للمفضلة ❤️');
    }
  };

const getProductImage = (images: string[] | undefined) => {
  if (!images || images.length === 0) return null;
  
  const validImage = images.find(img => {
    if (!img || img === 'placeholder.jpg') return false;
    return img.startsWith('/uploads/') || 
           img.startsWith('https://res.cloudinary.com/') ||
           img.startsWith('http');
  });
  
  return validImage || null;
};


  const getProductIcon = (categoryId: string) => {
    const icons: any = {
      '0': '🍼',
      '1': '👶',
      '2': '👕',
      '3': '🎒',
      '4': '🛁',
      '5': '🌙',
    };
    return icons[categoryId] || '📦';
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
              <p className="text-xl text-gray-600 font-bold">جاري التحميل...</p>
            </div>
        ) : (
             <div className="text-center">
               <div className="text-9xl mb-6">😢</div>
               <h2 className="text-3xl font-bold text-gray-900 mb-4">المنتج غير موجود</h2>
               <Link href="/products" className="text-blue-600 hover:text-blue-700 font-bold">
                 ← العودة للمنتجات
               </Link>
             </div>
        )}
      </div>
    );
  }

  // 🆕 تحديد المخزون الفعلي بناءً على اللون المختار
  const currentVariant = product.variants?.find((v) => v.color === selectedColor);
  // نستخدم مخزون المتغير إذا كان متاحاً، وإلا نستخدم المخزون العام للمنتج
  const currentStock = currentVariant ? currentVariant.stock : product.stock; 
  const isOutOfStock = currentStock === 0;
  // ------------------------------------

  const productImage = getProductImage(product.images);

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Logo size="small" variant="text" />
            </Link>

            <div className="flex items-center gap-3">
              <UserMenu />
              <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <Heart className="w-5 h-5 text-gray-600" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">الرئيسية</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">المنتجات</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{product.nameAr}</span>
          </div>
            </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden mb-4">
                <div className="aspect-square bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                  {productImage ? (
                    <img
                      src={product.images[selectedImage] || productImage}
                      alt={product.nameAr}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-9xl">
                      {getProductIcon(product.categoryId)}
                    </div>
                  )}
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {product.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                        selectedImage === idx ? 'border-blue-600' : 'border-gray-200'
                      }`}
                      disabled={!getProductImage([img])} // منع النقر إذا كانت الصورة غير صالحة
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.badge && (
                <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                  {product.badge}
                </span>
              )}

              <h1 className="text-4xl font-black text-gray-900 mb-4">
                {product.nameAr}
              </h1>

              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
              </div>
                <span className="text-gray-600 font-semibold">({product.rating})</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">تم بيع {product.sales}+ قطعة</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-5xl font-black text-blue-600">
                      {product.salePrice.toLocaleString()} دج
                    </span>
                    <span className="text-2xl text-gray-400 line-through">
                      {product.price.toLocaleString()} دج
                    </span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      خصم {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                    </span>
                  </>
                ) : (
                  <span className="text-5xl font-black text-blue-600">
                    {product.price.toLocaleString()} دج
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3">الوصف:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.descriptionAr || 'لا يوجد وصف متاح'}
                </p>
              </div>

              {/* 🎨 NEW: Color Selection Section */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <label className="block font-bold text-gray-900 mb-3 flex items-center gap-2">
                    اللون المختار: 
                    {selectedColor ? (
                      <span className="text-blue-600 flex items-center gap-1">
                        {selectedColor}
                        <span 
                          className="inline-block w-4 h-4 rounded-full border border-gray-400 shadow-sm"
                          style={{ backgroundColor: getColorCode(selectedColor) }}
                          title={selectedColor}
                        ></span>
                      </span>
                    ) : (
                      <span className="text-red-500 font-normal">الرجاء الاختيار</span>
                    )}
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.color}
                        onClick={() => {
                          setSelectedColor(variant.color);
                          setQuantity(1); // إعادة تعيين الكمية عند تغيير اللون
                        }}
                        className={`
                          p-3 rounded-xl border-2 transition relative 
                          ${selectedColor === variant.color 
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600' 
                            : 'border-gray-300 hover:border-gray-400 bg-white'
                          }
                          ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        disabled={variant.stock === 0}
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-5 h-5 rounded-full border border-gray-400 shadow-sm"
                            style={{ backgroundColor: getColorCode(variant.color) }}
                            title={variant.color}
                          ></span>
                          <span className="font-semibold text-gray-800">{variant.color}</span>
                        </div>
                        <span className={`block mt-1 text-xs ${variant.stock === 0 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                          {variant.stock === 0 ? 'نفذت الكمية' : `مخزون: ${variant.stock}`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Product Details - ONLY Real Info ✅ */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📋 تفاصيل المنتج
                </h3>
                
                <div className="space-y-4">
                  {/* Category */}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">الفئة</span>
                    <span className="font-bold text-gray-900">{product.category}</span>
                  </div>

                  {/* Age Group - Only if set */}
                  {product.ageGroup && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">الفئة العمرية</span>
                      <span className="font-bold text-gray-900">
                        {product.ageGroup === 'newborn' ? 'حديثي الولادة (0-3 أشهر)' :
                         product.ageGroup === '0-3months' ? '0-3 أشهر' :
                         product.ageGroup === '3-6months' ? '3-6 أشهر' :
                         product.ageGroup === '6-12months' ? '6-12 شهر' :
                         product.ageGroup === '1-2years' ? '1-2 سنة' :
                         product.ageGroup === '2-4years' ? '2-4 سنوات' :
                         'جميع الأعمار'}
                      </span>
                    </div>
                  )}

                  {/* Gender - Only if set */}
                  {product.gender && product.gender !== 'unisex' && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">مناسب لـ</span>
                      <span className="font-bold text-gray-900">
                        {product.gender === 'boys' ? '👦 الأولاد' :
                         product.gender === 'girls' ? '👧 البنات' :
                         '👶 الجنسين'}
                      </span>
                    </div>
                  )}

                  {/* Stock Status - يستخدم المخزون الحالي للون المختار */}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">حالة التوفر</span>
                    <span className={`font-bold flex items-center gap-2 ${currentStock > 10 ? 'text-green-600' : currentStock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                      {currentStock > 10 ? (
                        <>✅ متوفر ({currentStock} قطعة)</>
                      ) : currentStock > 0 ? (
                        <>⚠️ كمية محدودة ({currentStock} قطعة فقط)</>
                      ) : (
                        <>❌ نفذت الكمية</>
                      )}
                    </span>
                  </div>

                  {/* Custom Specifications from Admin ✅ */}
                  {product.specifications && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3">مواصفات إضافية:</h4>
                      <div className="space-y-2">
                        {product.specifications.split('\n').filter((line: string) => line.trim()).map((line: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 text-gray-700">
                            <span className="text-blue-600 font-bold mt-1">✓</span>
                            <span className="flex-1">{line.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Safety Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🛡️ الأمان والجودة
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold text-xl">✓</span>
                    <span><strong>آمن للأطفال:</strong> خالي من المواد الضارة لأبنائكم </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold text-xl">✓</span>
                    <span><strong>جودة عالية:</strong> مصنوع من خامات ممتازة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold text-xl">✓</span>
                    <span><strong>ضمان الجودة:</strong> الصورة حقيقية للمنتوج</span>
                  </li>
                </ul>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block font-bold text-gray-900 mb-3">الكمية:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock} // تعطيل إذا لم يكن هناك مخزون
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))} // يستخدم المخزون الحالي
                    disabled={isOutOfStock || quantity >= currentStock} // تعطيل عند نفاد المخزون أو الوصول للحد الأقصى
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="text-gray-600 mr-4">
                    متوفر: {currentStock} قطعة {/* يعرض المخزون الحالي */}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock} // تعطيل عند نفاد المخزون الحالي
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {isOutOfStock ? 'نفذت الكمية' : 'أضف للسلة'}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className="w-16 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition"
                >
                  <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">توصيل سريع</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">جودة مضمونة</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <RefreshCw className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">إرجاع مجاني</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Form Section */}
            {/* Product Reviews Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              ⭐ تقييمات هذا المنتج
            </h2>

            <ProductReviewsList productName={product.nameAr} />
          </div>
            </div>
      </section>

      {/* Review Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                ⭐ شاركنا رأيك في هذا المنتج
              </h3>
              
              <form 
  onSubmit={(e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const rating = formData.get('rating') as string;
    const comment = formData.get('comment') as string;
    
    fetch('/api/reviews', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        customerName: name,
        rating: parseInt(rating),
        comment: comment,
        productName: product.nameAr,
      })
    })
    .then(r => r.json())
    .then(() => {
      toast.success('شكراً! تقييمك قيد المراجعة وسيظهر قريباً ✅');
      (e.target as HTMLFormElement).reset();
    })
    .catch(() => toast.error('حدث خطأ'));
  }}
>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">اسمك</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                    placeholder="أدخل اسمك"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">التقييم</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="cursor-pointer">
                        <input type="radio" name="rating" value={star} className="sr-only peer" required />
                        <Star className="w-10 h-10 text-gray-300 peer-checked:text-yellow-400 peer-checked:fill-yellow-400 hover:scale-110 transition" />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">تعليقك</label>
                  <textarea
                    name="comment"
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
                    placeholder="أخبرنا عن تجربتك مع المنتج..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                >
                  إرسال التقييم ⭐
                </button>
              </form>
            </div>
            </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
