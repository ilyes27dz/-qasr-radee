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


export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
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
      
      const data = await response.json();
      console.log('✅ Product loaded:', data);
      setProduct(data);
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
    addToCart(product, quantity);
    toast.success(`تمت إضافة ${quantity} من ${product.nameAr} للسلة ✅`);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('تم إزالة المنتج من المفضلة');
    } else {
      addToWishlist(product);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-6">😢</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">المنتج غير موجود</h2>
          <Link href="/products" className="text-blue-600 hover:text-blue-700 font-bold">
            ← العودة للمنتجات
          </Link>
        </div>
      </div>
    );
  }

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

                  {/* Stock Status */}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">حالة التوفر</span>
                    <span className={`font-bold flex items-center gap-2 ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                      {product.stock > 10 ? (
                        <>✅ متوفر ({product.stock} قطعة)</>
                      ) : product.stock > 0 ? (
                        <>⚠️ كمية محدودة ({product.stock} قطعة فقط)</>
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
                    <span><strong>آمن للأطفال:</strong> خالي من المواد الضارة ومعتمد صحياً</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold text-xl">✓</span>
                    <span><strong>جودة عالية:</strong> مصنوع من خامات ممتازة</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold text-xl">✓</span>
                    <span><strong>ضمان الجودة:</strong> إرجاع مجاني خلال 7 أيام</span>
                  </li>
                </ul>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block font-bold text-gray-900 mb-3">الكمية:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="text-gray-600 mr-4">
                    متوفر: {product.stock} قطعة
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {product.stock > 0 ? 'أضف للسلة' : 'نفذت الكمية'}
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
    productId: product.id,
    customerId: 'guest',
    rating: parseInt(rating),
    comment: comment,
  })
})
.then(r => r.json()).then(() => {
                    toast.success('شكراً! تقييمك قيد المراجعة وسيظهر قريباً ✅');
                    (e.target as HTMLFormElement).reset();
                  }).catch(() => toast.error('حدث خطأ'));
                }}
                className="space-y-6"
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

