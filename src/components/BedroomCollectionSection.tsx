import React from 'react';
import { ArrowRight, Bed, Check } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface BedroomCollectionSectionProps {
  onSeeAllClick: () => void;
  lang?: Language;
}

export const BedroomCollectionSection: React.FC<BedroomCollectionSectionProps> = ({
  onSeeAllClick,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <section className="py-16 sm:py-24 bg-[#F8F6F1] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Card */}
        <div className="rounded-3xl bg-white border border-stone-200/90 shadow-sm p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#A67D28] border border-[#C59A3F]/30 text-xs font-semibold uppercase tracking-wider">
                <Bed className="w-3.5 h-3.5 text-[#C59A3F]" />
                <span>{t.bedroomCollectionBadge}</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A2332] tracking-tight leading-tight">
                {t.singleBedroomSetTitle}
              </h2>

              <p className="text-stone-600 text-base leading-relaxed">
                {t.singleBedroomSetDesc}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <Check className="w-4 h-4 text-[#C59A3F]" />
                  <span>Matching Nightstand Included</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <Check className="w-4 h-4 text-[#C59A3F]" />
                  <span>High-Grade Solid Slats</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <Check className="w-4 h-4 text-[#C59A3F]" />
                  <span>Free Riyadh Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-700">
                  <Check className="w-4 h-4 text-[#C59A3F]" />
                  <span>Cash on Delivery Option</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onSeeAllClick}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-sm font-semibold tracking-wide shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>{t.seeAllProducts}</span>
                  <ArrowRight className="w-4 h-4 text-[#C59A3F] rtl:rotate-180" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden aspect-16/10 shadow-xl bg-stone-100 relative group">
                <img
                  src="https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=1200&q=85"
                  alt="Single Bedroom Set Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1A2332]/90 border border-[#C59A3F]/50 text-amber-300 text-xs font-semibold mb-2">
                    <Bed className="w-3 h-3 text-[#C59A3F]" />
                    <span>Featured Category</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold">Riyadh Factory Signature Series</h3>
                  <p className="text-xs text-stone-200 mt-1">Ready for custom upholstery and timber finishes.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
