import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppLink } from '../data/config';
import { Language, TRANSLATIONS } from '../data/translations';

interface FAQSectionProps {
  lang?: Language;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang = 'en' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const faqs = [
    {
      question: t.q1,
      answer: t.a1
    },
    {
      question: t.q2,
      answer: t.a2
    },
    {
      question: t.q3,
      answer: t.a3
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 sm:py-24 bg-white border-b border-stone-200/60 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C59A3F] mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>{t.faqBadge}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A2332] tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            {t.faqSub}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200/90 overflow-hidden bg-[#FAF8F5] transition-all duration-200"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left rtl:text-right px-6 py-5 flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-[#1A2332] hover:text-[#C59A3F] transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#C59A3F]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-stone-600 text-sm sm:text-base leading-relaxed border-t border-stone-200/50 pt-4 bg-white/60">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Callout (Navy & Gold, No Green) */}
        <div className="mt-10 p-6 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left rtl:sm:text-right">
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-base">
              Have another question about customized sizes or finishes?
            </h4>
            <p className="text-stone-500 text-xs sm:text-sm mt-0.5">
              Our factory consultation team in Riyadh is available 24/7 on WhatsApp.
            </p>
          </div>
          <a
            href={getWhatsAppLink("Hello Riyadh Furniture Hub, I have a custom inquiry about your products.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold shadow-sm transition-all whitespace-nowrap border border-amber-400/30"
          >
            <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
            <span>Ask via WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
