import Link from 'next/link';
import Logo from './Logo';
import { Facebook, Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo size="small" variant="icon" />
              <span className="text-2xl font-bold">قصر الرضيع</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              متجركم الموثوق لملابس وأدوات الأطفال والرضع في الجزائر. جودة عالية وأسعار منافسة.
            </p>
            <div className="flex gap-3">
              <a href={CONTACT_INFO.facebook} target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={CONTACT_INFO.tiktok} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                <span className="text-xl">📱</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/" className="hover:text-white transition">الرئيسية</Link></li>
              <li><Link href="/products" className="hover:text-white transition">المنتجات</Link></li>
              <li><Link href="/offers" className="hover:text-white transition">العروض</Link></li>
              <li><Link href="/about" className="hover:text-white transition">من نحن</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-4">خدمة العملاء</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/orders/track" className="hover:text-white transition">تتبع الطلب</Link></li>
              <li><Link href="/account" className="hover:text-white transition">حسابي</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">السلة</Link></li>
              <li><Link href="/wishlist" className="hover:text-white transition">المفضلة</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">الهاتف</p>
                  <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">البريد</p>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">العنوان</p>
                  <p>{CONTACT_INFO.address}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2025 قصر الرضيع. جميع الحقوق محفوظة.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition">سياسة الخصوصية</Link>
              <Link href="/terms" className="hover:text-white transition">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
