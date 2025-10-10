'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869.wav');
    
    fetchNotifications();
    
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
        
        const latestNotification = newNotifications.find((n: Notification) => !n.read);
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

  const NotificationDropdown = () => (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[9998] bg-black/20"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Dropdown */}
      <div 
        className="fixed top-20 right-4 w-[400px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 z-[9999] overflow-hidden"
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Header - Sticky */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
              🔔 الإشعارات
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700 rounded-lg transition"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="font-bold text-lg">لا توجد إشعارات</p>
              <p className="text-sm mt-2">سيتم إشعارك عند وصول طلبات جديدة</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
                  !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">{getNotificationIcon(notif.type)}</div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {notif.title}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1 break-words">
                      {notif.message}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                      {new Date(notif.createdAt).toLocaleString('ar-DZ', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => {
                            markAsRead(notif.id);
                            setIsOpen(false);
                          }}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-bold hover:underline"
                        >
                          عرض التفاصيل ←
                        </Link>
                      )}
                      
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-xs font-bold hover:underline"
                        >
                          ✓ تعليم كمقروء
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-bold ml-auto hover:underline"
                      >
                        🗑️ حذف
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
  );

return (
  <>
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
    >
      <Bell className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>

    {isOpen && (

  <div className="fixed inset-0 z-[99999] flex items-start justify-center p-4 pt-20 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 w-full max-w-md max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                🔔 الإشعارات
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-96 p-2">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="font-semibold text-gray-500 dark:text-gray-400">لا توجد إشعارات</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl mb-2 ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}
                >
                  <div className="flex gap-3">
                    <div className="text-2xl">{getNotificationIcon(notif.type)}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{notif.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{notif.message}</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
                        {new Date(notif.createdAt).toLocaleString('ar-DZ')}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {notif.link && (
                          <Link
                            href={notif.link}
                            onClick={() => { markAsRead(notif.id); setIsOpen(false); }}
                            className="text-blue-600 dark:text-blue-400 text-xs font-semibold"
                          >
                            عرض ←
                          </Link>
                        )}
                        {!notif.read && (
                          <button onClick={() => markAsRead(notif.id)} className="text-green-600 dark:text-green-400 text-xs font-semibold">
                            ✓ قرأت
                          </button>
                        )}
                        <button onClick={() => deleteNotification(notif.id)} className="text-red-600 dark:text-red-400 text-xs font-semibold ml-auto">
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
      </div>
    )}
  </>
);
}
