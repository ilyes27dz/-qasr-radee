'use client';

import { forwardRef } from 'react';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import Image from 'next/image';


interface InvoicePrintProps {
  order: any;
}

const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(({ order }, ref) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (order) {
      // إنشاء QR Code يحتوي على رابط تتبع الطلب
      const trackingUrl = `${window.location.origin}/orders/track?order=${order.orderNumber}&phone=${order.customerPhone}`;
      
      QRCode.toDataURL(trackingUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).then(url => {
        setQrCodeUrl(url);
      }).catch(err => {
        console.error('QR Code generation error:', err);
      });
    }
  }, [order]);

  if (!order) return null;

  const invoiceDate = new Date(order.createdAt).toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // دعم كلا التسميتين
  const subtotal = order.subtotal || 0;
  const shippingCost = order.shipping || order.shippingCost || 0;
  const total = order.total || 0;

  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto font-arabic" style={{ direction: 'rtl' }}>
      {/* Header */}
      <div className="border-b-4 border-blue-600 pb-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
  <Image 
    src="/LOGO.jpg" 
    alt="قصر الرضيع" 
    width={80} 
    height={80}
    className="w-20 h-20 rounded-xl"
  />
  <div>
    <h1 className="text-3xl font-black text-gray-900">قصر الرضيع</h1>
    <p className="text-sm text-gray-600">Baby Palace Store</p>
  </div>
</div>

          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">فاتورة</h2>
            <p className="text-sm text-gray-600">Invoice</p>
          </div>
        </div>
      </div>

      {/* Info Row */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Company Info */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">معلومات المتجر</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-semibold">العنوان:</span> الجزائر</p>
            <p><span className="font-semibold">الهاتف:</span> +213 555 000 000</p>
            <p><span className="font-semibold">البريد:</span> info@babypalace.dz</p>
            <p><span className="font-semibold">الموقع:</span> www.babypalace.dz</p>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">معلومات العميل</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-semibold">الاسم:</span> {order.customerName}</p>
            <p><span className="font-semibold">الهاتف:</span> {order.customerPhone}</p>
            {order.customerEmail && (
              <p><span className="font-semibold">البريد:</span> {order.customerEmail}</p>
            )}
            <p><span className="font-semibold">العنوان:</span> {order.wilaya} - {order.commune}</p>
            <p className="text-xs mt-2">{order.address}</p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-3 gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 mb-1">رقم الفاتورة</p>
          <p className="font-bold text-gray-900">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">تاريخ الفاتورة</p>
          <p className="font-bold text-gray-900">{invoiceDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">طريقة الدفع</p>
          <p className="font-bold text-gray-900">
            {order.paymentMethod === 'cash' 
              ? 'الدفع عند الاستلام' 
              : order.paymentMethod === 'card'
              ? 'بطاقة بنكية'
              : 'الدفع عند الاستلام'}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="p-3 text-right text-sm font-bold border">المنتج</th>
              <th className="p-3 text-center text-sm font-bold border">الكمية</th>
              <th className="p-3 text-right text-sm font-bold border">السعر</th>
              <th className="p-3 text-right text-sm font-bold border">المجموع</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="p-3 text-sm text-gray-900 border">{item.productName}</td>
                <td className="p-3 text-center text-sm text-gray-900 border">{item.quantity}</td>
                <td className="p-3 text-sm text-gray-900 border">{(item.price || 0).toLocaleString()} دج</td>
                <td className="p-3 text-sm font-bold text-gray-900 border">
                  {((item.price || 0) * (item.quantity || 0)).toLocaleString()} دج
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals & QR Code */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Totals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">المجموع الفرعي:</span>
            <span className="font-bold text-gray-900">{subtotal.toLocaleString()} دج</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">تكلفة الشحن:</span>
            <span className="font-bold text-gray-900">{shippingCost.toLocaleString()} دج</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t-2 border-gray-300">
            <span className="text-lg font-bold text-gray-900">الإجمالي:</span>
            <span className="text-2xl font-black text-blue-600">{total.toLocaleString()} دج</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center">
          {qrCodeUrl ? (
            <>
              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32 mb-2" />
              <p className="text-xs text-gray-600 text-center">
                امسح الكود لتتبع طلبك
              </p>
            </>
          ) : (
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
              <p className="text-xs text-gray-400">QR Code</p>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="mb-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm font-semibold text-gray-900 mb-1">ملاحظات:</p>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t-2 border-gray-300 pt-6 mt-8">
        <div className="grid grid-cols-2 gap-8 text-xs text-gray-600">
          <div>
            <p className="font-bold text-gray-900 mb-2">شروط وأحكام:</p>
            <ul className="space-y-1">
              <li>• يمكن إرجاع المنتج خلال 7 أيام من تاريخ الاستلام</li>
              <li>• المنتج يجب أن يكون في حالته الأصلية</li>
              <li>• الدفع عند الاستلام متاح لجميع الطلبات</li>
            </ul>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900 mb-2">تواصل معنا:</p>
            <p>الهاتف: +213 558 86 47 55 </p>
            <p>واتساب: +213 558 86 47 55 </p>
            <p>البريد: info@babypalace.dz</p>
            <p className="mt-3 font-semibold text-blue-600">شكراً لتعاملكم معنا! 💙</p>
          </div>
        </div>
      </div>

      {/* Print Footer */}
      <div className="text-center mt-8 pt-4 border-t text-xs text-gray-500">
        <p>© 2025 قصر الرضيع - جميع الحقوق محفوظة</p>
        <p>Baby Palace Store - All Rights Reserved</p>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        
        .font-arabic {
          font-family: 'Cairo', sans-serif !important;
        }

        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint;
