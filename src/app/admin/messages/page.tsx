'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail, MailOpen, RefreshCw, LogOut, Home, Search,
  Phone, Calendar, CheckCircle, Clock, MessageSquare,
  Trash2, Eye, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);

  useEffect(() => {
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/staff/login');
      return;
    }

    const userData = JSON.parse(adminUser);
    if (userData.role !== 'admin') {
      toast.error('ليس لديك صلاحية الوصول');
      router.push('/admin/dashboard');
      return;
    }

    setUser(userData);
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contact');
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data);
      toast.success(`تم تحميل ${data.length} رسالة ✅`);
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      toast.error('فشل تحميل الرسائل');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete message');

      setMessages(messages.filter(m => m.id !== id));
      setSelectedMessage(null);
      toast.success('تم حذف الرسالة ✅');
    } catch (error) {
      console.error('❌ Error deleting message:', error);
      toast.error('فشل حذف الرسالة');
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: 'read' } : m
      ));
    } catch (error) {
      console.error('❌ Error marking as read:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    toast.success('تم تسجيل الخروج');
    router.push('/staff/login');
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'new' && msg.status !== 'new') return false;
    if (filter === 'read' && msg.status === 'new') return false;
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        msg.name.toLowerCase().includes(search) ||
        msg.email.toLowerCase().includes(search) ||
        msg.message.toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  const newMessagesCount = messages.filter(m => m.status === 'new').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-arabic">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">رسائل العملاء</h1>
                <p className="text-sm text-gray-500">مرحباً {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchMessages}
                className="p-2 hover:bg-gray-50 rounded-lg transition"
                title="تحديث"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-50 rounded-lg transition"
                title="لوحة التحكم"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black">{messages.length}</span>
            </div>
            <p className="text-white/80 text-sm">إجمالي الرسائل</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <MailOpen className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black">{newMessagesCount}</span>
            </div>
            <p className="text-white/80 text-sm">رسائل جديدة</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-3xl font-black">{messages.length - newMessagesCount}</span>
            </div>
            <p className="text-white/80 text-sm">رسائل مقروءة</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                الكل ({messages.length})
              </button>
              <button
                onClick={() => setFilter('new')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'new'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                جديدة ({newMessagesCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'read'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                مقروءة ({messages.length - newMessagesCount})
              </button>
            </div>

            <div className="relative w-full md:w-auto">
              <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث في الرسائل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pr-10 pl-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-xl p-6 shadow-sm border-2 hover:shadow-lg transition ${
                  message.status === 'new'
                    ? 'border-green-200 bg-green-50/30'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold text-white">
                        {message.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{message.name}</h3>
                      <p className="text-sm text-gray-600">{message.email}</p>
                      {message.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {message.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {message.status === 'new' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        جديدة
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(message.createdAt).toLocaleDateString('ar-DZ')}
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedMessage(message);
                        if (message.status === 'new') {
                          markAsRead(message.id);
                        }
                      }}
                      className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition"
                      title="عرض التفاصيل"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition"
                      title="حذف"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border">
                  <p className="text-gray-800 leading-relaxed line-clamp-2">{message.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 font-bold">لا توجد رسائل</p>
              <p className="text-gray-400 text-sm mt-2">عندما يتم إرسال رسائل جديدة ستظهر هنا</p>
            </div>
          )}
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">{selectedMessage.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedMessage.name}</h3>
                  <p className="text-blue-100 text-sm">{selectedMessage.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedMessage.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">{selectedMessage.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(selectedMessage.createdAt).toLocaleString('ar-DZ')}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-semibold"
                >
                  <Trash2 className="w-5 h-5" />
                  حذف الرسالة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
