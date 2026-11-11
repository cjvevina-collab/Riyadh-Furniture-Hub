import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  CreditCard,
  Clock,
  ArrowRight,
  Lock,
  Building2
} from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppLink } from '../data/config';
import { Language, TRANSLATIONS } from '../data/translations';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  lang?: Language;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAdmin, lang = 'en' }) => {
  const isAr = lang === 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleNav = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#FAF8F5] text-stone-700 pt-16 pb-12 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4 Value Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 mb-12 border-b border-stone-200/90">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-[#C59A3F] shadow-xs shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[#1A2332] font-bold text-sm">Free Delivery Riyadh</h4>
              <p className="text-stone-500 text-xs mt-0.5">Complimentary door-to-door delivery across all Riyadh zones.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-[#C59A3F] shadow-xs shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[#1A2332] font-bold text-sm">Cash on Delivery</h4>
              <p className="text-stone-500 text-xs mt-0.5">Inspect your furniture upon arrival and pay in cash easily.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-[#C59A3F] shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[#1A2332] font-bold text-sm">Factory Direct Quality</h4>
              <p className="text-stone-500 text-xs mt-0.5">Manufactured with seasoned hardwoods and premium fabrics.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-[#C59A3F] shadow-xs shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[#1A2332] font-bold text-sm">24/7 Dedicated Support</h4>
              <p className="text-stone-500 text-xs mt-0.5">Instant assistance on WhatsApp and telephone.</p>
            </div>
          </div>
        </div>

        {/* 4 Left-Aligned Columns (RTL aligned for Arabic) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12">
          
          {/* Column 1: Large Logo & About */}
          <div className="lg:col-span-4 space-y-4 text-left rtl:text-right">
            <div>
              <img 
                src={BUSINESS_INFO.logoUrl} 
                alt={BUSINESS_INFO.name} 
                className="h-20 sm:h-24 w-auto object-contain cursor-pointer"
                onClick={() => handleNav('home')}
              />
            </div>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-sm">
              Your destination for stylish, durable and comfortable furniture in Riyadh, Saudi Arabia. 
              Elevating bedrooms, living suites and workspaces with authentic craftsmanship.
            </p>

            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C59A3F] shrink-0" />
              <span>{BUSINESS_INFO.address}</span>
            </div>
          </div>

          {/* Column 2: Quick Links (Strictly Left Aligned) */}
          <div className="lg:col-span-2 space-y-4 text-left rtl:text-right">
            <h3 className="text-[#1A2332] font-serif font-bold text-sm uppercase tracking-wider border-b border-stone-200 pb-2">
              {t.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-left rtl:text-right">
              <li>
                <button 
                  onClick={() => handleNav('home')}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.home}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('story')}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.story}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('shop')}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.shop}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('categories')}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.categories}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.contacts}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Additional Links (Strictly Left Aligned) */}
          <div className="lg:col-span-3 space-y-4 text-left rtl:text-right">
            <h3 className="text-[#1A2332] font-serif font-bold text-sm uppercase tracking-wider border-b border-stone-200 pb-2">
              {t.additionalLinks}
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-left rtl:text-right">
              <li>
                <button 
                  onClick={() => handleNav('categories')}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.ideasInspiration}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.helpAdvice}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('story')}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.tradeTerms}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleNav('home');
                    setTimeout(() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="text-stone-600 hover:text-[#C59A3F] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-[#C59A3F] rtl:rotate-180" />
                  <span>{t.faqTitle}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="text-stone-600 hover:text-[#1A2332] transition-colors flex items-center gap-1.5 font-semibold text-xs pt-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span>{t.adminPortal}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details (Strictly Left Aligned) */}
          <div className="lg:col-span-3 space-y-4 text-left rtl:text-right">
            <h3 className="text-[#1A2332] font-serif font-bold text-sm uppercase tracking-wider border-b border-stone-200 pb-2">
              {t.contactDetails}
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-left rtl:text-right">
              <a
                href={getWhatsAppLink("Hello Riyadh Furniture Hub, I need assistance with an order.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-stone-700 hover:text-[#C59A3F] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C59A3F] shrink-0 mt-0.5" />
                <span>WhatsApp: {BUSINESS_INFO.whatsapp}</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="flex items-start gap-2.5 text-stone-700 hover:text-[#C59A3F] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C59A3F] shrink-0 mt-0.5" />
                <span>Call: {BUSINESS_INFO.phone}</span>
              </a>

              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="flex items-start gap-2.5 text-stone-700 hover:text-[#C59A3F] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C59A3F] shrink-0 mt-0.5" />
                <span className="truncate">{BUSINESS_INFO.email}</span>
              </a>

              <div className="flex items-start gap-2.5 text-stone-600">
                <MapPin className="w-4 h-4 text-[#C59A3F] shrink-0 mt-0.5" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 mt-8 border-t border-stone-200/90 text-center text-xs text-stone-500 space-y-4">
          <p className="font-medium text-stone-600">
            {t.copyright}
          </p>

          {/* Continuous Sliding Marquee Ticker (Riyadh, Currency SAR, Admin Portal & Factory Trust) */}
          <div className="bg-[#1A2332] text-stone-300 py-2.5 px-4 rounded-xl overflow-hidden shadow-inner border border-stone-800 select-none">
            <div className="animate-marquee flex items-center gap-10 font-medium text-xs tracking-wide">
              {[...Array(2)].flatMap(() => [
                {
                  id: 'riyadh',
                  content: (
                    <span className="flex items-center gap-2 text-stone-200 shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-[#C59A3F]" />
                      <span>{isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}</span>
                    </span>
                  )
                },
                {
                  id: 'currency',
                  content: (
                    <span className="flex items-center gap-2 text-stone-200 shrink-0">
                      <span className="text-[#C59A3F] font-bold">SAR</span>
                      <span>{isAr ? 'العملة الرسمية: ريال سعودي (SAR)' : 'Official Currency: Saudi Riyal (SAR)'}</span>
                    </span>
                  )
                },
                {
                  id: 'admin',
                  content: (
                    <button
                      onClick={onOpenAdmin}
                      className="flex items-center gap-2 text-[#C59A3F] hover:text-white font-semibold underline underline-offset-4 shrink-0 cursor-pointer transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{t.adminPortal}</span>
                    </button>
                  )
                },
                {
                  id: 'factory',
                  content: (
                    <span className="flex items-center gap-2 text-stone-200 shrink-0">
                      <Building2 className="w-3.5 h-3.5 text-[#C59A3F]" />
                      <span>{BUSINESS_INFO.legalName}</span>
                    </span>
                  )
                },
                {
                  id: 'delivery',
                  content: (
                    <span className="flex items-center gap-2 text-stone-200 shrink-0">
                      <Truck className="w-3.5 h-3.5 text-[#C59A3F]" />
                      <span>{isAr ? 'توصيل مجاني لجميع أحياء ومناطق الرياض' : 'Free Delivery Across All Riyadh Districts'}</span>
                    </span>
                  )
                }
              ]).map((item, idx) => (
                <div key={idx} className="flex items-center gap-8 shrink-0">
                  {item.content}
                  <span className="text-stone-600 font-bold">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
