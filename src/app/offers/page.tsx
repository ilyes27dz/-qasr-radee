'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '@/components/CartContext';
import { useWishlist } from '@/components/WishlistContext';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import UserMenu from '@/components/UserMenu';

export default function OffersPage() {
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Hero */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🎁</div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            العروض والخصومات
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            أفضل العروض الحصرية على منتجات الأطفال والرضع
          </p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin text-6xl mb-4">⏳</div>
              <p className="text-gray-600 font-bold">جاري التحميل...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-9xl mb-6">🎁</div>
              <p className="text-2xl text-gray-600 font-bold">لا توجد عروض حالياً</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`bg-white rounded-xl p-6 border-2 border-${offer.color}-200 hover:shadow-lg hover:border-${offer.color}-500 transition`}
                >
                  {offer.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className={`flex items-center gap-3 mb-4`}>
                    <div className={`w-12 h-12 bg-${offer.color}-50 rounded-lg flex items-center justify-center`}>
                      <span className={`text-${offer.color}-600 font-bold text-xl`}>
                        {offer.discount}%
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{offer.title}</h3>
                  </div>

                  <p className="text-gray-700 mb-4">{offer.description}</p>

                  {offer.endDate && (
                    <div className={`bg-${offer.color}-50 rounded-lg p-3 mb-4`}>
                      <p className={`text-${offer.color}-600 font-semibold text-sm`}>
                        ينتهي: {new Date(offer.endDate).toLocaleDateString('ar-DZ')}
                      </p>
                    </div>
                  )}

                  <Link
                    href={offer.link}
                    className={`block text-center bg-${offer.color}-600 text-white py-2.5 rounded-lg font-bold hover:bg-${offer.color}-700 transition`}
                  >
                    تسوق الآن
                  </Link>
                </div>
              ))}
            </div>
          )}
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
