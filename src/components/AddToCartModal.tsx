'use client';

import { X, ShoppingCart, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    nameAr: string;
    price: number;
    salePrice?: number;
    image?: string;
  };
}

export default function AddToCartModal({ isOpen, onClose, product }: AddToCartModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">
          تم الإضافة!
        </h2>

        {/* Product Info */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <p className="text-center text-gray-700 mb-2">
            تم إضافة <span className="font-bold text-blue-600">{product.nameAr}</span> إلى سلة المشتريات
          </p>
          <p className="text-center text-sm text-gray-600">
            هل ترغب بمواصلة التسوق؟
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            href="/cart"
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            عرض السلة
          </Link>
          <button
            onClick={onClose}
            className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition"
          >
            نعم، متابعة
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
