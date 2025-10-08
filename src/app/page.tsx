'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Heart, Star, Truck, Shield, Phone, MessageCircle, Facebook, X, CreditCard } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import TopBanner from '@/components/TopBanner';
import AddToCartModal from '@/components/AddToCartModal';
import Logo from '@/components/Logo';
import HeroSlider from '@/components/HeroSlider';
import CustomerReviews from '@/components/CustomerReviews';
import UserMenu from '@/components/UserMenu';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';

export default function HomePage() {
  const { addToCart, getCartCount } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount } = useWishlist();
  const [showContactMenu, setShowContactMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { title: 'للتغذية', icon: '🍼', count: 15 },
    { title: 'للرضاعة', icon: '👶', count: 10 },
    { title: 'ملابس', icon: '👕', count: 25 },
    { title: 'للخرجات', icon: '🎒', count: 12 },
    { title: 'للنظافة', icon: '🛁', count: 18 },
    { title: 'للنوم', icon: '🌙', count: 8 },
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products?featured=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      console.log('✅ Featured products loaded:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setBestSellers(data.slice(0, 3));
      } else {
        console.log('⚠️ No featured products found');
        setBestSellers([]);
      }
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      toast.error('فشل تحميل المنتجات');
      setBestSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleWishlistToggle = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('تم إزالة المنتج من المفضلة');
    } else {
      addToWishlist(product);
      toast.success('تمت إضافة المنتج للمفضلة ❤️');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    } else {
      toast.error('يرجى إدخال كلمة بحث');
    }
  };

const getProductImage = (images: string[] | undefined) => {
  if (!images || images.length === 0) return null;
  
  // قبول صور Cloudinary أو صور محلية ✅
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

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      <TopBanner />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
  {/* الشعار على اليمين ✅ */}
  <Link href="/" className="order-1">
    <Logo size="small" variant="text" />
  </Link>

  {/* الأيقونات على اليسار ✅ */}
  <div className="flex items-center gap-3 order-2">
    <UserMenu />
    <button onClick={() => window.location.href = '/wishlist'} className="relative p-2 hover:bg-gray-100 rounded-lg transition">
      <Heart className="w-5 h-5 text-gray-600" />
      {getWishlistCount() > 0 && (
        <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
          {getWishlistCount()}
        </span>
      )}
    </button>
    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
      <ShoppingCart className="w-5 h-5 text-gray-600" />
      {getCartCount() > 0 && (
        <span className="absolute -top-1 -left-1 bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
          {getCartCount()}
        </span>
      )}
    </Link>
  </div>
</div>


          <div className="mt-4 relative">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="ابحث عن منتجات الأطفال..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400 hover:text-blue-600 transition" />
              </button>
            </form>
          </div>

          <nav className="hidden md:flex gap-8 mt-4 justify-center text-base font-bold">
            <Link href="/" className="text-blue-600 hover:text-blue-700 transition">الرئيسية</Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">المنتجات</Link>
            
            <button 
              onClick={() => {
                const section = document.getElementById('categories-section');
                section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              الأقسام
            </button>
            
            <Link href="/orders/track" className="text-gray-700 hover:text-blue-600 transition">
              تتبع الطلب
            </Link>
            
            <Link href="/offers" className="text-gray-700 hover:text-blue-600 transition">العروض</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">من نحن</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">اتصل بنا</Link>
          </nav>
        </div>
      </header>

      {/* Hero Slider */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <HeroSlider />
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              الأكثر مبيعاً
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              المنتجات الأكثر طلباً
            </h2>
            <p className="text-gray-600">اختيار الآلاف من العائلات السعيدة</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          ) : bestSellers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-9xl mb-6">📦</div>
              <p className="text-2xl text-gray-600 font-bold mb-4">لا توجد منتجات مميزة</p>
              <Link href="/products" className="text-blue-600 hover:text-blue-700 font-bold">
                تصفح جميع المنتجات →
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {bestSellers.map((product) => {
                const productImage = getProductImage(product.images);
                
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-500 transition-all"
                  >
                    <div className="relative">
                      <Link href={`/products/${product.id}`}>
                        <div className="h-64 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center cursor-pointer hover:scale-105 transition">
                          {productImage ? (
                            <img 
                              src={productImage} 
                              alt={product.nameAr}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-8xl">
                              {getProductIcon(product.categoryId)}
                            </div>
                          )}
                        </div>
                      </Link>
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold">
                          {product.badge}
                        </div>
                      )}
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className="absolute top-3 right-3 bg-white p-2 rounded-lg shadow hover:shadow-md transition"
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>

                    <div className="p-5">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition cursor-pointer">
                          {product.nameAr}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-gray-500 text-sm mr-2">({product.rating})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-blue-600">
                          {(product.salePrice || product.price).toLocaleString()} دج
                        </span>
                        {product.salePrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {product.price.toLocaleString()} دج
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 mb-4">
                        تم بيع {product.sales}+ قطعة
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
                      >
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {/* Categories */}
      <section id="categories-section" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
              تصفح حسب الفئة
            </h2>
            <p className="text-gray-600">اختر ما يناسب طفلك</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {categories.map((cat, index) => (
              <Link
                key={index}
                href={`/products?category=${cat.title}`}
                className="group bg-white rounded-xl p-8 border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-center"
              >
                <div className="text-6xl mb-4">
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {cat.title}
                </h3>
                <p className="text-gray-500 text-sm">
                  {cat.count} منتج متوفر
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CustomerReviews />

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">توصيل سريع</h3>
              <p className="text-gray-600 text-sm">24-48 ساعة لجميع الولايات</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">دفع آمن</h3>
              <p className="text-gray-600 text-sm">الدفع عند الاستلام</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">جودة مضمونة</h3>
              <p className="text-gray-600 text-sm">منتجات آمنة 100%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Contact Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => setShowContactMenu(!showContactMenu)}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <Phone className="w-6 h-6" />
        </button>

        {showContactMenu && (
          <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-xl p-3 space-y-2 w-48">
            <a
              href="https://wa.me/213555000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </a>
            <a
              href="https://facebook.com/qsrradi3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              <Facebook className="w-4 h-4" />
              <span>فيسبوك</span>
            </a>
            <button
              onClick={() => setShowContactMenu(false)}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              <X className="w-4 h-4" />
              <span>إغلاق</span>
            </button>
          </div>
        )}
      </div>

      <AddToCartModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={selectedProduct || { nameAr: '', price: 0 }}
      />

      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }
      `}</style>
    </div>
  );
}
