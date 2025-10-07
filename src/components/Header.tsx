'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Heart } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import TopBanner from './TopBanner';
import Logo from './Logo';

export default function Header() {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();

  return (
    <>
      <TopBanner />
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group order-2 md:order-1">
              <Logo size="small" variant="text" />
            </Link>

            <div className="flex items-center gap-4 order-1 md:order-2">
              <Link href="/login">
                <User className="w-6 h-6 text-gray-600 hover:text-blue-600 transition" />
              </Link>
              <Link href="/wishlist" className="relative">
                <Heart className="w-6 h-6 text-gray-600 hover:text-red-500 transition" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
                    {getWishlistCount()}
                  </span>
                )}
              </Link>
              <Link href="/cart" className="relative">
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
              placeholder="ابحث عن منتجات الأطفال..."
              className="w-full px-5 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <nav className="hidden md:flex gap-8 mt-4 justify-center text-base font-bold">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition">الرئيسية</Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 transition">المنتجات</Link>
            <Link href="/offers" className="text-gray-700 hover:text-blue-600 transition">العروض 🎁</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">من نحن</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">اتصل بنا</Link>
          </nav>
        </div>
      </header>
    </>
  );
}
