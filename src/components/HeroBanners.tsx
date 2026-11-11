import React from 'react';
import { ArrowRight, Briefcase, Shield, Truck, Award } from 'lucide-react';
import { TRANSLATIONS, Language } from '../data/translations';

interface HeroProps {
  onExploreClick: () => void;
  lang?: Language;
}

// Section 3: Home Furniture Banner
export const HomeFurnitureBanner: React.FC<HeroProps> = ({ onExploreClick, lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <section className="py-14 sm:py-20 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12">
          
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C59A3F]">
              Living & Bedroom Harmony
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A2332] leading-tight">
              {t.homeFurnitureTitle}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {t.homeFurnitureDesc}
            </p>
            <div className="pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <span>{t.exploreNewArrivals}</span>
                <ArrowRight className="w-4 h-4 text-[#C59A3F]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 min-h-[300px] lg:min-h-full relative overflow-hidden bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
              alt="Home Furniture in Riyadh"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85';
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

// Section 4: Office Furniture Banner (Redesigned with Light Luxury & Gold Palette)
export const OfficeFurnitureBanner: React.FC<HeroProps> = ({ onExploreClick, lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden bg-[#FAF8F5] border border-stone-200 shadow-sm grid grid-cols-1 lg:grid-cols-12">
          
          <div className="lg:col-span-6 order-2 lg:order-1 min-h-[300px] lg:min-h-full relative overflow-hidden bg-stone-100">
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85"
              alt="Executive Office Furniture Riyadh"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85';
              }}
            />
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-[#C59A3F]/30 text-[#A67D28] text-xs font-bold uppercase tracking-wider w-fit">
              <Briefcase className="w-3.5 h-3.5 text-[#C59A3F]" />
              <span>{t.officeFurnitureBadge}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A2332] leading-tight">
              {t.officeFurnitureTitle}
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {t.officeFurnitureDesc}
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <span>{t.exploreNewArrivals}</span>
                <ArrowRight className="w-4 h-4 text-[#C59A3F]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
