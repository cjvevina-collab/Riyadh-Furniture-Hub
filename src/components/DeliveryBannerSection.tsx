import React from 'react';
import { Truck, ArrowRight, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../data/config';
import { Language, TRANSLATIONS } from '../data/translations';

interface DeliveryBannerSectionProps {
  onLearnMoreClick: () => void;
  lang?: Language;
}

export const DeliveryBannerSection: React.FC<DeliveryBannerSectionProps> = ({
  onLearnMoreClick,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-stone-200 bg-[#FAF8F5] p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#A67D28] border border-[#C59A3F]/30 text-xs font-semibold uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5 text-[#C59A3F]" />
                <span>{t.deliveryBadge}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#1A2332] leading-tight">
                {t.deliveryTitle}
              </h2>

              <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                {t.deliveryDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#C59A3F] shrink-0" />
                  <span>All Riyadh Districts</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#C59A3F] shrink-0" />
                  <span>Careful Furniture Handling</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700 font-medium">
                  <MapPin className="w-4 h-4 text-[#C59A3F] shrink-0" />
                  <span>Cash on Delivery Supported</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onLearnMoreClick}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs sm:text-sm font-semibold tracking-wide shadow-md transition-all cursor-pointer"
                >
                  <span>{t.learnMore}</span>
                  <ArrowRight className="w-4 h-4 text-[#C59A3F] rtl:rotate-180" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs p-6 rounded-2xl bg-white border border-stone-200/90 shadow-lg text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C59A3F] mx-auto flex items-center justify-center">
                  <Truck className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-stone-900">
                  White Glove Delivery
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Our professional fleet operates daily from our central Riyadh facility ({BUSINESS_INFO.address}).
                </p>
                <div className="text-xs font-bold text-[#A67D28] bg-amber-50 py-2 rounded-lg border border-amber-200">
                  Cost: 0 SAR (100% Free)
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
