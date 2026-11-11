import React from 'react';
import { Truck, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface WhyChooseUsSectionProps {
  lang?: Language;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ lang = 'en' }) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const features = [
    {
      icon: Truck,
      title: t.feature1Title,
      description: t.feature1Desc,
      tag: 'Zero Hidden Fees'
    },
    {
      icon: ShieldCheck,
      title: t.feature2Title,
      description: t.feature2Desc,
      tag: 'Verified Handling'
    },
    {
      icon: HeartHandshake,
      title: t.feature3Title,
      description: t.feature3Desc,
      tag: 'Cash on Delivery (COD)'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59A3F]">
            {t.whySubtitle}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2332] mt-2 tracking-tight">
            {t.whyChooseUs}
          </h2>
          <p className="text-stone-500 text-sm sm:text-base mt-3 leading-relaxed">
            We unite factory-grade durability, respectful pricing, and customer-centric delivery services across the capital.
          </p>
        </div>

        {/* 3 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="relative bg-[#FAF8F5] rounded-2xl p-8 border border-stone-200/80 hover:border-[#C59A3F]/50 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-[#C59A3F] group-hover:bg-[#1A2332] group-hover:text-[#C59A3F] transition-colors shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wide px-3 py-1 bg-white rounded-full text-stone-600 border border-stone-200">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#1A2332] mb-3 group-hover:text-[#C59A3F] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200/60 flex items-center gap-2 text-xs font-medium text-stone-500">
                  <CheckCircle className="w-4 h-4 text-[#C59A3F]" />
                  <span>Guaranteed by Riyadh Furniture Hub</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
