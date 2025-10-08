'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2, Heart, Star, Sparkles } from 'lucide-react';
import { useWishlist } from '@/components/WishlistContext';
import { useCart } from '@/components/CartContext';
import AddToCartModal from '@/components/AddToCartModal';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const wishlistContext = useWishlist();
  const cartContext = useCart();
  
  if (!wishlistContext || !cartContext) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-xl text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  const { items, removeFromWishlist, clearWishlist, getWishlistCount } = wishlistContext;
  const { addToCart, getCartCount } = cartContext;
  
  const wishlistItems = items || [];
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast.success(`تم حذف ${productName} من المفضلة`);
  };

  const handleClearWishlist = () => {
    if (confirm('هل أنت متأكد من حذف جميع المفضلة؟')) {
      clearWishlist();
      toast.success('تم تفريغ المفضلة');
    }
  };

  const getProductImage = (images: string[]) => {
    if (!images || images.length === 0) return null;
    const validImage = images.find(img => img && img !== 'placeholder.jpg' && (img.startsWith('/uploads/') || img.startsWith('http')));
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

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center font-arabic">
        <div className="text-center animate-fade-in">
          <div className="text-[200px] mb-8 animate-bounce-slow">❤️</div>
          <h2 className="text-5xl font-black text-gray-900 mb-6">المفضلة فارغة</h2>
          <p className="text-gray-600 text-xl mb-10">لم تقم بإضافة أي منتجات للمفضلة بعد</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-10 py-5 rounded-full hover:from-red-600 hover:to-pink-700 transition font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 text-lg"
          >
            <ShoppingCart className="w-6 h-6" />
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
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 font-arabic">
      {/* Header - Logo فقط على الموبايل ✅ */}
      {/* Header - الشعار فقط ✅ */}
<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      {/* الشعار فقط على اليمين ✅ */}
      <Link href="/" className="flex items-center">
        <Logo size="small" />
      </Link>

      {/* الأيقونات على اليسار */}
      <div className="flex items-center gap-3">
        <UserMenu />
        <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
          <Heart className="w-5 h-5 md:w-6 md:h-6 text-red-500 fill-red-500" />
          {getWishlistCount() > 0 && (
            <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold">
              {getWishlistCount()}
            </span>
          )}
        </Link>
        <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-gray-600 hover:text-blue-600 transition" />
          {getCartCount() > 0 && (
            <span className="absolute -top-1 -left-1 bg-blue-600 text-white text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
              {getCartCount()}
            </span>
          )}
        </Link>
      </div>
    </div>
  </div>
</header>


      {/* Page Header */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-red-500 via-pink-500 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 text-6xl md:text-9xl animate-bounce-slow">❤️</div>
          <div className="absolute bottom-10 left-10 text-6xl md:text-9xl animate-float">✨</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 drop-shadow-2xl">
              المفضلة ❤️
            </h1>
            <p className="text-lg md:text-2xl text-white/90 font-semibold drop-shadow-lg">
              لديك <span className="text-yellow-300 font-black">{wishlistItems.length}</span> منتج في المفضلة
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-10 bg-white p-4 md:p-6 rounded-2xl shadow-lg gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2 md:gap-3">
              <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
              منتجاتك المفضلة
            </h2>
            <button
              onClick={handleClearWishlist}
              className="text-red-600 hover:text-red-700 transition flex items-center gap-1 md:gap-2 font-bold hover:scale-110 transform bg-red-50 px-4 md:px-5 py-2 md:py-3 rounded-xl text-sm md:text-base"
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              <span>تفريغ المفضلة</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {wishlistItems.map((product, index) => {
              const productImage = getProductImage(product.images || []);
              
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl md:rounded-3xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-red-500 transition-all duration-500 animate-slide-in hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <Link href={`/products/${product.id}`}>
                      <div className="h-48 md:h-72 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 cursor-pointer relative overflow-hidden">
                        {productImage ? (
                          <img 
                            src={productImage} 
                            alt={product.nameAr}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-pink-400/10 group-hover:scale-150 transition-transform duration-700"></div>
                            <span className="relative z-10 text-6xl md:text-9xl">
                              {getProductIcon(product.categoryId || "0")}
                            </span>
                          </>
                        )}
                      </div>
                    </Link>
                    {product.salePrice && (
                      <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-full text-xs font-bold shadow-2xl animate-pulse">
                        خصم {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                      </div>
                    )}
                    <button
                      onClick={() => handleRemove(product.id, product.nameAr)}
                      className="absolute top-2 right-2 md:top-4 md:right-4 bg-white p-2 md:p-3 rounded-full shadow-2xl hover:scale-125 transition-transform z-10"
                    >
                      <Trash2 className="w-4 h-4 md:w-6 md:h-6 text-red-500" />
                    </button>
                  </div>

                  <div className="p-3 md:p-6">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-sm md:text-xl font-black text-gray-900 mb-2 md:mb-3 hover:text-blue-600 transition cursor-pointer line-clamp-2">
                        {product.nameAr}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-3 md:mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 md:w-5 md:h-5 ${
                            i < Math.floor(product.rating || 4.5)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 md:gap-2 mb-3 md:mb-4">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg md:text-3xl font-black text-blue-600">
                            {product.salePrice.toLocaleString()} دج
                          </span>
                          <span className="text-gray-400 line-through text-xs md:text-lg">
                            {product.price.toLocaleString()} دج
                          </span>
                        </>
                      ) : (
                        <span className="text-lg md:text-3xl font-black text-blue-600">
                          {product.price.toLocaleString()} دج
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 md:py-4 rounded-xl md:rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105 text-sm md:text-base"
                    >
                      أضف للسلة 🛒
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <AddToCartModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={selectedProduct || { nameAr: '', price: 0 }}
      />

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
            <Logo size="small" />
            <span className="text-2xl md:text-3xl font-black">قصر الرضيع</span>
          </div>
          <p className="text-gray-400 mb-6 md:mb-8 text-base md:text-lg">
            متجركم الموثوق لملابس وأدوات الأطفال والرضع
          </p>
          <div className="flex gap-4 md:gap-8 justify-center text-sm text-gray-400 font-semibold flex-wrap">
            <Link href="/about" className="hover:text-white transition hover:scale-110">من نحن</Link>
            <Link href="/contact" className="hover:text-white transition hover:scale-110">اتصل بنا</Link>
            <Link href="/orders/track" className="hover:text-white transition hover:scale-110">تتبع الطلب</Link>
          </div>
          <p className="text-gray-600 text-sm mt-8 md:mt-10">
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

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
