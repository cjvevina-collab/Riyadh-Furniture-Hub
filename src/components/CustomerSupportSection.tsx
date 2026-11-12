import React from 'react';
import { Headphones, ArrowRight, MessageCircle, Phone, Mail } from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppLink } from '../data/config';
import { Language, TRANSLATIONS } from '../data/translations';

interface CustomerSupportSectionProps {
  onContactClick: () => void;
  lang?: Language;
}

export const CustomerSupportSection: React.FC<CustomerSupportSectionProps> = ({
  onContactClick,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5] border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#1A2332] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl border border-stone-800">
          
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-[#C59A3F] text-xs font-semibold uppercase tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              <span>{t.supportBadge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {t.supportTitle}
            </h2>

            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              {t.supportDesc}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={onContactClick}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C59A3F] hover:bg-[#A67D28] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>{t.contactUs}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>

              <a
                href={getWhatsAppLink("Hello Riyadh Furniture Hub Support, I need help with an order.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs sm:text-sm font-semibold border border-white/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
                <span>{lang === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Us'}</span>
              </a>
            </div>

            {/* Quick Contact Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-stone-300 border-t border-stone-700/60">
              <a 
                href={getWhatsAppLink("Hello Riyadh Furniture Hub Support")} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp: {BUSINESS_INFO.whatsapp}</span>
              </a>
              <a 
                href={`mailto:${BUSINESS_INFO.email}`}
                className="flex items-center gap-1.5 hover:text-[#C59A3F] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#C59A3F]" />
                <span>{BUSINESS_INFO.email}</span>
              </a>
            </div>
          </div>

          {/* Decorative ambient background */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-10 pointer-events-none hidden lg:flex items-center justify-center">
            <Headphones className="w-96 h-96 text-white" />
          </div>

        </div>
      </div>
    </section>
  );
};
