'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([
    { id: 1, text: 'توصيل مجاني للطلبات +5000 دج 🚚', color: 'from-blue-600 to-indigo-600', enabled: true },
    { id: 2, text: '🎁 خصم 30% على جميع المنتجات', color: 'from-purple-600 to-pink-600', enabled: true },
    { id: 3, text: '⚡ توصيل سريع 24-48 ساعة', color: 'from-orange-600 to-red-600', enabled: true },
    { id: 4, text: '✅ منتجات مضمونة 100%', color: 'from-green-600 to-emerald-600', enabled: true },
    { id: 5, text: '📦 تغليف آمن ومميز', color: 'from-teal-600 to-cyan-600', enabled: true },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const toggleBanner = (id: number) => {
    setBanners(banners.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b));
    toast.success('تم تحديث حالة الشعار');
  };

  const deleteBanner = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الشعار؟')) {
      setBanners(banners.filter(b => b.id !== id));
      toast.success('تم حذف الشعار');
    }
  };

  const startEdit = (id: number, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id: number) => {
    setBanners(banners.map(b => b.id === id ? { ...b, text: editText } : b));
    setEditingId(null);
    toast.success('تم حفظ التعديلات');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الشعارات</h1>
            <p className="text-gray-600">تحكم في الإعلانات المتحركة في أعلى الموقع</p>
          </div>
          <Link 
            href="/admin/dashboard"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للوحة التحكم
          </Link>
        </div>

        {/* Add New Banner */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            إضافة شعار جديد
          </h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="نص الشعار..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            />
            <select className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500">
              <option>from-blue-600 to-indigo-600</option>
              <option>from-purple-600 to-pink-600</option>
              <option>from-orange-600 to-red-600</option>
              <option>from-green-600 to-emerald-600</option>
              <option>from-teal-600 to-cyan-600</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold">
              إضافة
            </button>
          </div>
        </div>

        {/* Banners List */}
        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition ${
                banner.enabled ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className={`flex-1 bg-gradient-to-r ${banner.color} text-white px-6 py-3 rounded-xl`}>
                  {editingId === banner.id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-transparent border-b border-white/50 focus:outline-none text-white font-semibold"
                    />
                  ) : (
                    <span className="font-semibold">{banner.text}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {editingId === banner.id ? (
                    <button
                      onClick={() => saveEdit(banner.id)}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(banner.id, banner.text)}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    onClick={() => toggleBanner(banner.id)}
                    className={`p-2 rounded-lg transition ${
                      banner.enabled 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                    }`}
                  >
                    {banner.enabled ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
