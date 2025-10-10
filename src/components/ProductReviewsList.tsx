'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

export default function ProductReviewsList({ productName }: { productName: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productName]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?approved=true');
      if (!response.ok) throw new Error('Failed');
      
      const data = await response.json();
      // فلترة التقييمات الخاصة بهذا المنتج فقط
      const productReviews = data.filter((r: any) => r.productName === productName);
      setReviews(productReviews);
    } catch (error) {
      console.error('Error:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-xl text-gray-500 font-bold mb-2">
          لا توجد تقييمات لهذا المنتج بعد
        </p>
        <p className="text-gray-400">كن أول من يقيّم هذا المنتج!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* إحصائيات التقييمات */}
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          <span className="text-4xl font-black text-gray-900">
            {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
          </span>
        </div>
        <p className="text-gray-600 font-semibold">
          بناءً على {reviews.length} تقييم
        </p>
      </div>

      {/* قائمة التقييمات */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-start gap-4">
              {/* صورة التقييم */}
              {review.image && (
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={review.image} 
                    alt="صورة التقييم" 
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{review.customerName}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 italic mb-2">"{review.comment}"</p>

                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('ar-DZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
