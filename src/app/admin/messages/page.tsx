'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare, Search, RefreshCw, LogOut, Home,
  Mail, Phone, User, Calendar, Check, Trash2, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    setUser(JSON.parse(adminUser));
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    setLoading(true);
    try {
      const storedMessages = localStorage.getItem('contact_messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('فشل تحميل الرسائل');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const handleMarkAsRead = (id: string) => {
    const updated = messages.map(msg =>
      msg.id === id ? { ...msg, status: 'read' } : msg
    );
    setMessages(updated);
    localStorage.setItem('contact_messages', JSON.stringify(updated));
    toast.success('تم وضع علامة مقروء ✅');
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      const updated = messages.filter(msg => msg.id !== id);
      setMessages(updated);
      localStorage.setItem('contact_messages', JSON.stringify(updated));
      toast.success('تم حذف الرسالة');
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg relative">
                <MessageSquare className="w-6 h-6 text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">رسائل العملاء</h1>
                <p className="text-sm text-gray-500">{unreadCount} رسالة غير مقروءة</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={fetchMessages} className="p-2 hover:bg-gray-50 rounded-lg transition">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <Link href="/admin/dashboard" className="p-2 hover:bg-gray-50 rounded-lg transition">
                <Home className="w-5 h-5 text-gray-600" />
              </Link>

              <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg transition">
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث عن رسالة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-bold">لا توجد رسائل</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div 
                key={message.id} 
                className={`bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition ${
                  message.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xl">
                      {message.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{message.name}</h3>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {message.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {message.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {new Date(message.createdAt).toLocaleString('ar-DZ')}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {message.status === 'unread' && (
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                        title="وضع علامة مقروء"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-bold text-gray-700 mb-2">الموضوع: {message.subject}</p>
                  <p className="text-gray-700 leading-relaxed">{message.message}</p>
                </div>

                {message.status === 'unread' && (
                  <div className="mt-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      جديدة
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        .font-arabic { font-family: 'Cairo', sans-serif !important; }
      `}</style>
    </div>
  );
}
