'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Send, Mail, Phone, MapPin, MessageSquare, 
  Facebook, ArrowRight, User
} from 'lucide-react';
import toast from 'react-hot-toast';
import { CONTACT_INFO } from '@/lib/constants';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      
      const newMessage = {
        id: Date.now().toString(),
        ...formData,
        status: 'unread',
        createdAt: new Date().toISOString(),
      };

      messages.unshift(newMessage);
      localStorage.setItem('contact_messages', JSON.stringify(messages));

      toast.success('تم إرسال رسالتك بنجاح! ✅');
      toast('سنتواصل معك قريباً 📞', { icon: '👋' });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('حدث خطأ أثناء إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-3xl">🍼</span>
              <div>
                <span className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition block">
                  قصر الرضيع
                </span>
                <span className="text-xs text-gray-500">Baby Palace</span>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-semibold"
            >
              <ArrowRight className="w-5 h-5" />
              العودة للمتجر
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-black mb-4">تواصل معنا 💬</h1>
          <p className="text-xl text-blue-100">نحن هنا للإجابة على جميع استفساراتك</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* معلومات الاتصال */}
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-6">معلومات التواصل</h2>
            
            <div className="space-y-4 mb-8">
              {/* الهاتف */}
              <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">اتصل بنا</p>
                    <a href={`tel:${CONTACT_INFO.phone}`} className="text-xl font-bold text-gray-900 hover:text-blue-600">
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* واتساب */}
              <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">واتساب</p>
                    <a 
                      href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-gray-900 hover:text-green-600"
                    >
                      +{CONTACT_INFO.whatsapp}
                    </a>
                  </div>
                </div>
              </div>

              {/* البريد */}
              <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني</p>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-xl font-bold text-gray-900 hover:text-red-600">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* العنوان */}
              <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">العنوان</p>
                    <p className="text-xl font-bold text-gray-900">{CONTACT_INFO.address}</p>
                  </div>
                </div>
              </div>

              {/* فيسبوك */}
              <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Facebook className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">فيسبوك</p>
                    <a 
                      href={CONTACT_INFO.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-gray-900 hover:text-blue-600"
                    >
                      قصر الرضيع
                    </a>
                  </div>
                </div>
              </div>

              {/* تيك توك */}
              <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تيك توك</p>
                    <a 
                      href={CONTACT_INFO.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-bold text-gray-900 hover:text-black"
                    >
                      @mostapha.lak
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">ساعات العمل 🕐</h3>
              <div className="space-y-2 text-gray-700">
                <p className="flex justify-between">
                  <span className="font-semibold">السبت - الخميس:</span>
                  <span>{CONTACT_INFO.workingHours.weekdays}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-semibold">الجمعة:</span>
                  <span className="text-red-600 font-bold">{CONTACT_INFO.workingHours.friday}</span>
                </p>
              </div>
            </div>
          </div>

          {/* نموذج الاتصال */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border">
              <h2 className="text-3xl font-black text-gray-900 mb-6">أرسل لنا رسالة 📩</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="أحمد محمد"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0555123456"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الموضوع
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="استفسار عن المنتجات"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    الرسالة
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
