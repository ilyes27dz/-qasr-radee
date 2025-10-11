'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Heart, Menu } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import Logo from '@/components/Logo';
import UserMenu from '@/components/UserMenu';

export default function Header() {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* ✅ الشعار على اليمين */}
          <Link href="/" className="order-1">
            <Logo size="small" variant="text" />
          </Link>

          {/* ✅ الأيقونات على اليسار */}
          <div className="flex items-center gap-3 order-2">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            <UserMenu />
            
            <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <Heart className="w-5 h-5 text-gray-600" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {getWishlistCount()}
                </span>
              )}
            </Link>
            
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

        {/* ✅ Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-3">
              <Link 
                href="/" 
                onClick={() => setShowMobileMenu(false)}
                className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition font-bold"
              >
                🏠 الرئيسية
              </Link>
              <Link 
                href="/products" 
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition font-bold"
              >
                📦 المنتجات
              </Link>
              <Link 
                href="/orders/track" 
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition font-bold"
              >
                📍 تتبع الطلب
              </Link>
              <Link 
                href="/about" 
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition font-bold"
              >
                ℹ️ من نحن
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition font-bold"
              >
                📞 اتصل بنا
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
