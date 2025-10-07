'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Search, Heart, Star } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import AddToCartModal from '@/components/AddToCartModal';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import toast from 'react-hot-toast';

const categories = [
  { id: 'all', name: 'الكل', icon: '🛍️' },
  { id: 'للتغذية', name: 'للتغذية', icon: '🍼' },
  { id: 'للرضاعة', name: 'للرضاعة', icon: '👶' },
  { id: 'ملابس', name: 'ملابس', icon: '👕' },
  { id: 'للخرجات', name: 'للخرجات', icon: '🎒' },
  { id: 'للنظافة', name: 'للنظافة', icon: '🛁' },
  { id: 'للنوم', name: 'للنوم', icon: '🌙' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams?.get('category');
  const searchFromUrl = searchParams?.get('search');
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const { addToCart, getCartCount } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount } = useWishlist();

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [categoryFromUrl, searchFromUrl]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error('Products data is not an array:', data);
        setProducts([]);
        toast.error('خطأ في تحميل المنتجات');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('فشل تحميل المنتجات');
      setProducts([]);
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

  const getProductImage = (images: string[]) => {
    if (!images || images.length === 0) return null;
    const validImage = images.find(img => img && img !== 'placeholder.jpg' && img.startsWith('/uploads/'));
    return validImage || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-arabic">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="order-2 md:order-1">
  <Logo size="small" variant="text" />
</Link>


            <div className="flex items-center gap-4 order-1 md:order-2">
              <UserMenu />
              <Link href="/wishlist" className="relative hover:scale-110 transition">
                <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 transition" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative hover:scale-110 transition">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-blue-600 transition" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pr-12 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 text-9xl animate-bounce-slow">🛍️</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-float">✨</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              {selectedCategory === 'all' ? 'جميع المنتجات' : selectedCategory}
            </h1>
            <p className="text-2xl text-white/90 font-semibold drop-shadow-lg">
              اكتشف أفضل منتجات الأطفال والرضع
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap font-bold transition transform hover:scale-110 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
              <p className="text-3xl text-gray-500 font-bold">جاري التحميل...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-9xl mb-6">😢</div>
              <p className="text-3xl text-gray-500 font-bold">لا توجد منتجات في هذا القسم</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.isArray(products) && products.map((product, index) => {
                const productImage = getProductImage(product.images);
                
                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-500 animate-slide-in hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <Link href={`/products/${product.id}`}>
                        <div className="h-72 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 cursor-pointer relative overflow-hidden">
                          {productImage ? (
                            <img 
                              src={productImage} 
                              alt={product.nameAr}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Image failed to load:', productImage);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 group-hover:scale-150 transition-transform duration-700"></div>
                              <div className="text-9xl relative z-10">
                                {getProductIcon(product.categoryId)}
                              </div>
                            </>
                          )}
                        </div>
                      </Link>
                      {product.salePrice && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl animate-pulse">
                          خصم {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                        </div>
                      )}
                      {product.badge && (
                        <div className={`absolute top-3 right-3 px-4 py-2 rounded-full text-xs font-bold text-white shadow-2xl ${
                          product.badge === 'أكثر مبيعاً' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                          product.badge === 'جديد' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                          'bg-gradient-to-r from-red-500 to-pink-500'
                        }`}>
                          {product.badge}
                        </div>
                      )}
                      <button 
                        onClick={() => handleWishlistToggle(product)}
                        className="absolute bottom-3 right-3 bg-white p-3 rounded-full hover:scale-125 transition shadow-2xl z-10"
                      >
                        <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>

                    <div className="p-6">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xl font-black text-gray-900 mb-3 hover:text-blue-600 transition cursor-pointer">
                          {product.nameAr}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 font-medium">
                        {product.descriptionAr}
                      </p>

                      <div className="flex items-center gap-1 mb-4">
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
                        <span className="text-gray-600 text-sm font-bold mr-2">({product.rating})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        {product.salePrice ? (
                          <>
                            <span className="text-3xl font-black text-blue-600">
                              {product.salePrice.toLocaleString()} دج
                            </span>
                            <span className="text-gray-400 line-through text-lg">
                              {product.price.toLocaleString()} دج
                            </span>
                          </>
                        ) : (
                          <span className="text-3xl font-black text-blue-600">
                            {product.price.toLocaleString()} دج
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-xl hover:shadow-2xl hover:scale-105"
                      >
                        أضف للسلة 🛒
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <AddToCartModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={selectedProduct || { nameAr: '', price: 0 }}
      />

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Logo size="small" />
            <span className="text-3xl font-black">قصر الرضيع</span>
          </div>
          <p className="text-gray-400 mb-8 text-lg">
            متجركم الموثوق لملابس وأدوات الأطفال والرضع
          </p>
          <div className="flex gap-8 justify-center text-sm text-gray-400 font-semibold">
            <Link href="/about" className="hover:text-white transition hover:scale-110">من نحن</Link>
            <Link href="/contact" className="hover:text-white transition hover:scale-110">اتصل بنا</Link>
            <Link href="/orders/track" className="hover:text-white transition hover:scale-110">تتبع الطلب</Link>
          </div>
          <p className="text-gray-600 text-sm mt-10">
            © 2025 قصر الرضيع. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
