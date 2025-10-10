'use client';

import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?approved=true');
      if (!response.ok) throw new Error('Failed');
      
      const data = await response.json();
      setReviews(data.slice(0, 6)); // عرض 6 تقييمات
    } catch (error) {
      console.error('Error:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3">
              ماذا يقول عملاؤنا
            </h2>
            <p className="text-gray-600">تجارب حقيقية من عملاء سعداء</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-lg transition">
                {/* الصورة إن وجدت */}
                {review.image && (
                  <div 
                    className="mb-4 overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setSelectedImage(review.image)}
                  >
                    <img 
                      src={review.image} 
                      alt="صورة التقييم" 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 mb-4 italic">"{review.comment}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{review.customerName}</p>
                    {review.productName && (
                      <p className="text-xs text-gray-500">{review.productName}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal لتكبير الصورة */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-white text-gray-900 p-2 rounded-full hover:bg-gray-200 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={selectedImage} 
            alt="صورة مكبرة" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </>
  );
}
