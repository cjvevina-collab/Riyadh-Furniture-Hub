import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const BANNER_SLIDES = [
  {
    id: 2,
    imageUrl: 'https://i.postimg.cc/6pKwN0bQ/banner2323-(2).jpg',
    alt: 'Riyadh Furniture Hub Banner 1'
  },
  {
    id: 3,
    imageUrl: 'https://i.postimg.cc/Z5mZhcsR/banner2323-(3).jpg',
    alt: 'Riyadh Furniture Hub Banner 2'
  },
  {
    id: 4,
    imageUrl: 'https://i.postimg.cc/Mpwx8D3H/banner2323-(4).jpg',
    alt: 'Riyadh Furniture Hub Banner 3'
  }
];

interface FullHeroSliderProps {
  onBannerClick?: () => void;
}

export const FullHeroSlider: React.FC<FullHeroSliderProps> = ({ onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  const totalSlides = BANNER_SLIDES.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-slide effect every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused]);

  return (
    <section 
      className="relative w-full overflow-hidden bg-stone-100 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Banners"
    >
      {/* Full Aspect-ratio container matching the remaining 1280x527 banners */}
      <div className="relative w-full aspect-[1280/527] max-h-[720px] bg-[#F5F2EB]">
        {BANNER_SLIDES.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={slide.id}
              onClick={onBannerClick}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer flex items-center justify-center ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.imageUrl}
                alt={slide.alt}
                className="w-full h-full object-contain object-center select-none"
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            </div>
          );
        })}

        {/* Slide Indicator Dots (Bottom Center/Left) */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 z-20 flex items-center gap-2 sm:gap-2.5 bg-black/35 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
          {BANNER_SLIDES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(dotIdx);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                dotIdx === currentIndex
                  ? 'w-6 sm:w-7 h-2 bg-[#C59A3F]'
                  : 'w-2 h-2 bg-white/70 hover:bg-white'
              }`}
              aria-label={`Go to slide ${dotIdx + 1}`}
            />
          ))}
        </div>

        {/* Previous & Next Arrows - Grouped in Bottom-Right Corner as requested */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-8 z-20 flex items-center gap-1.5 bg-black/45 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-lg">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <span className="w-px h-3.5 bg-white/30" />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
