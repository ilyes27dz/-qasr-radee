'use client';

import Link from 'next/link';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Heart, Sparkles, Package } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import { formatPrice } from '@/lib/utils';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const shippingCost = 500;
  const total = getCartTotal() + shippingCost;

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`تم حذف ${productName} من السلة`, {
      icon: '🗑️',
    });
  };

  const handleClearCart = () => {
    if (confirm('هل أنت متأكد من حذف جميع المنتجات؟')) {
      clearCart();
      toast.success('تم تفريغ السلة');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center font-arabic">
        <div className="text-center animate-fade-in">
          <div className="text-[200px] mb-8 animate-bounce-slow">🛒</div>
          <h2 className="text-5xl font-black text-gray-900 mb-6">السلة فارغة</h2>
          <p className="text-gray-600 text-xl mb-10">لم تقم بإضافة أي منتجات بعد</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-5 rounded-full hover:from-blue-700 hover:to-indigo-700 transition font-bold shadow-2xl hover:shadow-3xl transform hover:scale-110 text-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-arabic">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group order-2 md:order-1">
              <Logo size="small" />
              <div>
                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-purple-600 group-hover:to-pink-600 transition block">
                  قصر الرضيع
                </span>
                <span className="text-xs text-gray-500 font-semibold">Baby Palace Store</span>
              </div>
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
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 text-9xl animate-bounce-slow">🛒</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-float">✨</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              سلة التسوق 🛒
            </h1>
            <p className="text-2xl text-white/90 font-semibold drop-shadow-lg">
              لديك <span className="text-yellow-300 font-black">{cartItems.length}</span> منتج في السلة
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                  المنتجات
                </h2>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700 transition flex items-center gap-2 font-bold hover:scale-110 transform bg-red-50 px-5 py-3 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>تفريغ السلة</span>
                </button>
              </div>

              {cartItems.map((item, index) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 animate-slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl flex items-center justify-center text-6xl group-hover:scale-110 transition-transform shadow-lg">
                      {item.product.images && item.product.images[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.nameAr}
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      ) : (
                        '🍼'
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-gray-900 mb-3">
                        {item.product.nameAr}
                      </h3>
                      <p className="text-gray-600 text-base mb-6 font-medium">
                        {item.product.descriptionAr}
                      </p>

                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-3 shadow-md">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl hover:bg-blue-50 hover:text-blue-600 transition shadow-sm hover:scale-110"
                          >
                            <Minus className="w-6 h-6" />
                          </button>
                          <span className="text-2xl font-black text-gray-900 w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl hover:bg-blue-50 hover:text-blue-600 transition shadow-sm hover:scale-110"
                          >
                            <Plus className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-4xl font-black text-blue-600">
                            {formatPrice((item.product.salePrice || item.product.price) * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 font-semibold">
                            {formatPrice(item.product.salePrice || item.product.price)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product.id, item.product.nameAr)}
                      className="text-red-600 hover:text-red-700 hover:scale-125 transition-transform bg-red-50 p-3 rounded-xl h-fit"
                    >
                      <Trash2 className="w-7 h-7" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 border-2 border-blue-200 shadow-2xl sticky top-24 animate-fade-in">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <Package className="w-8 h-8 text-blue-600" />
                  ملخص الطلب
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="flex justify-between text-gray-600 text-lg">
                    <span className="font-semibold">المجموع الفرعي</span>
                    <span className="font-black">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-lg">
                    <span className="font-semibold">تكلفة الشحن</span>
                    <span className="font-black">{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="border-t-2 border-blue-200 pt-6">
                    <div className="flex justify-between text-3xl font-black text-gray-900">
                      <span>المجموع الكلي</span>
                      <span className="text-blue-600">{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black hover:from-blue-700 hover:to-indigo-700 transition shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 mb-4 transform hover:scale-105 text-lg"
                >
                  <span>إتمام الطلب</span>
                  <ArrowRight className="w-6 h-6" />
                </Link>

                <Link
                  href="/products"
                  className="w-full bg-white text-gray-700 py-5 rounded-2xl font-black hover:bg-gray-50 transition border-2 border-gray-200 flex items-center justify-center gap-3 transform hover:scale-105 text-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>متابعة التسوق</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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
