'use client';

import { Star, Quote } from 'lucide-react';

const reviews = [
  { id: 1, name: 'أم محمد', location: 'الجزائر', rating: 5, comment: 'منتجات رائعة وجودة ممتازة! طفلي يحب كل شيء اشتريته من هنا.', avatar: '👩', date: '2025-09-20' },
  { id: 2, name: 'سارة أحمد', location: 'وهران', rating: 5, comment: 'أفضل متجر للأطفال في الجزائر! أنصح به بشدة لكل الأمهات.', avatar: '👩‍🦰', date: '2025-09-15' },
  { id: 3, name: 'فاطمة الزهراء', location: 'قسنطينة', rating: 5, comment: 'تجربة تسوق ممتازة من البداية للنهاية. شكراً لكم!', avatar: '👩‍🦱', date: '2025-09-10' },
];

export default function CustomerReviews() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold mb-4">
            ⭐ تقييمات العملاء
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">ماذا يقول عملاؤنا؟</h2>
          <p className="text-xl text-gray-600">آلاف العائلات السعيدة يثقون بنا</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <div key={review.id} className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-gray-100 relative">
              <div className="absolute top-4 right-4 text-blue-100"><Quote className="w-16 h-16" /></div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl shadow-lg">
                  {review.avatar}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">"{review.comment}"</p>
              <p className="text-sm text-gray-400">{review.date}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">5000+</div>
            <p className="text-gray-600 font-semibold">عميل سعيد</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-2">4.9</div>
            <p className="text-gray-600 font-semibold">تقييم ممتاز</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">98%</div>
            <p className="text-gray-600 font-semibold">رضا العملاء</p>
          </div>
        </div>
      </div>
    </section>
  );
}
