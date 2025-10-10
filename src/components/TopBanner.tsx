'use client';

import { useState, useEffect } from 'react';
import { Truck, Phone, Gift, Zap, Package, Shield, X, Sparkles, Heart } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function TopBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب الشعارات من API
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      
      // تحويل البيانات من API لنفس الشكل السابق
      const formattedBanners = data.map((banner: any) => ({
        id: banner.id,
        icon: getIconForBanner(banner.text),
        text: banner.text,
        color: banner.color,
        enabled: banner.enabled,
      }));
      
      setAnnouncements(formattedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      // في حالة الخطأ، استخدم البيانات الافتراضية
      setAnnouncements([
        {
          id: 1,
          icon: Truck,
          text: 'توصيل مجاني للطلبات +5000 دج 🚚',
          color: 'from-blue-600 to-indigo-600',
          enabled: true,
        },
        {
          id: 2,
          icon: Gift,
          text: '🎁 خصم 30% على جميع المنتجات',
          color: 'from-purple-600 to-pink-600',
          enabled: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // دالة لاختيار الأيقونة حسب النص
  const getIconForBanner = (text: string) => {
    if (text.includes('توصيل') || text.includes('🚚')) return Truck;
    if (text.includes('خصم') || text.includes('🎁')) return Gift;
    if (text.includes('سريع') || text.includes('⚡')) return Zap;
    if (text.includes('مضمونة') || text.includes('✅')) return Shield;
    if (text.includes('تغليف') || text.includes('📦')) return Package;
    if (text.includes('عملاء') || text.includes('❤️')) return Heart;
    if (text.includes('جديدة') || text.includes('✨')) return Sparkles;
    return Gift;
  };

  // فلترة الإعلانات النشطة فقط
  const activeAnnouncements = announcements.filter(a => a.enabled);

  useEffect(() => {
    if (isPaused || !isVisible || activeAnnouncements.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 4000); // يتغير كل 4 ثواني

    return () => clearInterval(interval);
  }, [isPaused, isVisible, activeAnnouncements.length]);

  if (loading || !isVisible || activeAnnouncements.length === 0) return null;

  const current = activeAnnouncements[currentIndex];
  const Icon = current.icon;

  return (
    <div 
      className={`relative bg-gradient-to-r ${current.color} text-white py-2 overflow-hidden transition-all duration-700`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Background Shimmer */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full opacity-40 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/4 left-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-3/4 w-2.5 h-2.5 bg-white rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between text-sm">
          {/* Main Content */}
          <div className="flex items-center gap-6 flex-1">
            <div className="flex items-center gap-2 animate-slide-in">
              <Icon className="w-4 h-4 animate-bounce" />
              <span className="font-semibold">{current.text}</span>
            </div>
            <span className="hidden md:flex items-center gap-2">
              <Phone className="w-4 h-4" />
<span>{CONTACT_INFO.phone}</span>
            </span>
          </div>

          {/* Progress Dots */}
          <div className="hidden md:flex items-center gap-2 mx-6">
            {activeAnnouncements.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`الإعلان ${index + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-white w-6 h-2' 
                    : 'bg-white/50 w-2 h-2 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <a 
              href="/offers" 
              className="hover:underline whitespace-nowrap hidden sm:inline-block"
            >
              عروض خاصة 🎁
            </a>
            <button
              onClick={() => setIsVisible(false)}
              aria-label="إغلاق"
              className="hover:bg-white/20 p-1 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0) translateX(0); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) translateX(10px); 
            opacity: 0.6;
          }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
