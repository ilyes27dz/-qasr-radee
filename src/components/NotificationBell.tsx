'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [prevUnreadCount, setPrevUnreadCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // إنشاء الصوت
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869.wav');
    
    fetchNotifications();
    
    // تحديث كل 5 ثوانٍ
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('Could not play sound:', err);
      });
    }
  };

  const fetchNotifications = async (isAutoUpdate = false) => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      
      const newNotifications = data.notifications || [];
      const newUnreadCount = data.unreadCount || 0;
      
      setNotifications(newNotifications);
      setUnreadCount(newUnreadCount);
      
      if (isAutoUpdate && newUnreadCount > prevUnreadCount) {
        playNotificationSound();
        
        const latestNotification = newNotifications.find(n => !n.read);
        if (latestNotification) {
          toast.success(
            `${latestNotification.title}\n${latestNotification.message}`,
            {
              icon: getNotificationIcon(latestNotification.type),
              duration: 5000,
            }
          );
        }
      }
      
      setPrevUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '📦';
      case 'review': return '⭐';
      case 'contact': return '💬';
      default: return '🔔';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell className={`w-5 h-5 text-gray-600 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-gray-200 z-50 max-h-[500px] overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  🔔 الإشعارات
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount} جديد
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded-lg transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">لا توجد إشعارات</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                      !notif.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getNotificationIcon(notif.type)}</div>
                      
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">
                          {notif.title}
                        </p>
                        <p className="text-gray-600 text-xs mt-1">
                          {notif.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(notif.createdAt).toLocaleString('ar-DZ')}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          {notif.link && (
                            <Link
                              href={notif.link}
                              onClick={() => {
                                markAsRead(notif.id);
                                setIsOpen(false);
                              }}
                              className="text-blue-600 hover:text-blue-700 text-xs font-semibold"
                            >
                              عرض التفاصيل ←
                            </Link>
                          )}
                          
                          {!notif.read && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="text-green-600 hover:text-green-700 text-xs font-semibold"
                            >
                              تعليم كمقروء
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notif.id)}
                            className="text-red-600 hover:text-red-700 text-xs font-semibold ml-auto"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
