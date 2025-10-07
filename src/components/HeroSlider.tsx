'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  { 
    id: 1, 
    title: 'أفضل منتجات الأطفال', 
    subtitle: 'جودة عالية وأمان مضمون', 
    image: 'https://i.pinimg.com/736x/72/6a/b4/726ab49109530c39c46fe6b1862d8e3c.jpg', 
    bgGradient: 'from-blue-400 via-purple-400 to-pink-400' 
  },
  { 
    id: 2, 
    title: 'توصيل سريع', 
    subtitle: 'توصيل مجاني لجميع الولايات', 
    image: 'https://i.pinimg.com/736x/1d/03/e5/1d03e5daf4591eb4188b7ee22fc7b7b9.jpg', 
    bgGradient: 'from-green-400 via-teal-400 to-blue-400' 
  },
  { 
    id: 3, 
    title: 'خصومات حصرية', 
    subtitle: 'وفّر حتى 40% على المنتجات', 
    image: 'https://i.pinimg.com/736x/99/73/75/997375d6ac84565a9b189218e6ae101e.jpg', 
    bgGradient: 'from-orange-400 via-red-400 to-pink-400' 
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient}`} />
          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-8 md:px-16">
            {/* Text Content */}
            <div className="text-white text-center md:text-right z-10 md:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-2xl animate-fade-in">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl font-semibold mb-6 drop-shadow-lg animate-fade-in-delay">
                {slide.subtitle}
              </p>
              <button 
                onClick={() => window.location.href = '/products'}
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-2xl animate-fade-in-delay-2"
              >
                تسوق الآن ←
              </button>
            </div>

            {/* Image */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 mt-6 md:mt-0 animate-bounce-slow">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover rounded-full shadow-2xl ring-4 ring-white/30"
                onError={(e) => {
                  console.error('Failed to load image:', slide.image);
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E👶%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 rounded-full transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
