'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

export default function AdminNotifications() {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // تحديث كل 15 ثانية
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/orders/notifications');
      const data = await res.json();
      const newCount = data.count || 0;
      
      // إشعار صوتي عند وجود طلب جديد
      if (newCount > prevCount && prevCount > 0) {
        playNotificationSound();
        showBrowserNotification(newCount - prevCount);
      }
      
      setPrevCount(count);
      setCount(newCount);
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
    }
  };

  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYHGGS57O2USwsMT6Xh8bJqHgU7k9jyy3krBSl+zPDckj8KEWNV3+q' );
      audio.volume = 0.5;
      audio.play().catch(e => console.log('تعذر تشغيل الصوت:', e));
    } catch (e) {
      console.log('خطأ في الصوت:', e);
    }
  };

  const showBrowserNotification = (newOrders: number) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('طلب جديد! 🎉', {
        body: `لديك ${newOrders} طلب جديد في انتظار المعالجة`,
        icon: '/icon.png',
      });
    }
  };

  // طلب إذن الإشعارات عند التحميل
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (count === 0) return null;

  return (
    <div className="fixed top-4 left-4 z-50 animate-bounce">
      <div className="bg-red-500 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2">
        <Bell className="w-5 h-5 animate-pulse" />
        <span className="font-bold text-lg">{count} طلب جديد!</span>
      </div>
    </div>
  );
}
