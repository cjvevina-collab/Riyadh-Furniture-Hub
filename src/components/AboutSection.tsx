import React from 'react';
import { ArrowRight, CheckCircle2, Factory, HeartHandshake, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../data/config';
import { Language, TRANSLATIONS } from '../data/translations';

interface AboutSectionProps {
  onShopNowClick: () => void;
  lang?: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onShopNowClick, lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Images Collage */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md aspect-4/5 bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
                    alt="Living Room Riyadh"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs">
                  <div className="flex items-center gap-2 text-[#C59A3F] font-bold text-xs uppercase tracking-wider mb-1">
                    <Factory className="w-4 h-4" />
                    <span>Direct Factory</span>
                  </div>
                  <p className="text-stone-600 text-xs">
                    {BUSINESS_INFO.legalName} • Riyadh, KSA
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 rounded-xl bg-[#1A2332] text-white shadow-md">
                  <div className="flex items-center gap-2 text-[#C59A3F] font-bold text-xs uppercase tracking-wider mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>Riyadh Central</span>
                  </div>
                  <p className="text-stone-300 text-xs">
                    {BUSINESS_INFO.address}
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md aspect-4/5 bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
                    alt="Master Bedroom Suite"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#A67D28] border border-[#C59A3F]/30 text-xs font-semibold uppercase tracking-wider">
              <HeartHandshake className="w-3.5 h-3.5 text-[#C59A3F]" />
              <span>{t.aboutBadge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2332] tracking-tight leading-tight">
              {t.aboutTitle}
            </h2>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              {t.aboutDesc}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C59A3F] shrink-0 mt-0.5" />
                <span className="text-stone-700 text-sm">
                  {t.aboutPillar1}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C59A3F] shrink-0 mt-0.5" />
                <span className="text-stone-700 text-sm">
                  {t.aboutPillar2}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C59A3F] shrink-0 mt-0.5" />
                <span className="text-stone-700 text-sm">
                  {t.aboutPillar3}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onShopNowClick}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{t.shopNow}</span>
                <ArrowRight className="w-4 h-4 text-[#C59A3F] rtl:rotate-180" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
