import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Factory, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { BUSINESS_INFO } from '../data/config';

import { Language } from '../data/translations';

interface OurStoryViewProps {
  onExploreShop: () => void;
  lang?: Language;
}

export const OurStoryView: React.FC<OurStoryViewProps> = ({ onExploreShop, lang = 'en' }) => {
  const isAr = lang === 'ar';
  return (
    <div className="py-12 sm:py-20 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-[#C59A3F]" />
              <span>{isAr ? 'أصالة سعودية وحياة عصرية' : 'Saudi Heritage & Modern Living'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1A2332] tracking-tight leading-tight">
              {isAr ? 'صناعة راحة تدوم لكل منزل في الرياض' : 'Crafting Enduring Comfort for Every Riyadh Home'}
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              {isAr ? (
                <>
                  تأسس <span className="font-semibold text-stone-900">{BUSINESS_INFO.name}</span> كجزء من <span className="font-semibold text-stone-900">{BUSINESS_INFO.legalName}</span> برؤية واضحة: تصنيع وتوريد أثاث عالي الجودة ومتين وفاخر مباشرة إلى المنازل والشركات في جميع أنحاء الرياض.
                </>
              ) : (
                <>
                  Founded as part of <span className="font-semibold text-stone-900">{BUSINESS_INFO.legalName}</span>, Riyadh Furniture Hub was born with a singular focus: to manufacture and deliver premium, sturdy, and exceptionally designed furniture directly to homeowners and businesses throughout Riyadh.
                </>
              )}
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              {isAr 
                ? 'من الأسرّة الفردية المدمجة إلى مجموعات غرف النوم الكينج الفاخرة والمراتب الطبية، صُممت كل قطعة لتوائم مناخ المملكة والذوق السعودي المعاصر.'
                : 'From compact single beds to opulent king-size bedroom sets and medicated spine-relief mattresses, each piece is engineered using kiln-dried solid framing, premium joinery, and tailored fabrics suited to the Kingdom’s climate and contemporary aesthetics.'}
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreShop}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-sm font-semibold tracking-wide shadow-md transition-all cursor-pointer"
              >
                <span>{isAr ? 'تصفح تشكيلتنا' : 'Browse Our Collection'}</span>
                <ArrowRight className="w-4 h-4 text-[#C59A3F]" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-stone-200 border-4 border-white aspect-4/5">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85"
                alt="Riyadh Furniture Hub Workshop & Craft"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                  Riyadh Production Hub
                </div>
                <div className="font-serif font-bold text-lg mt-0.5">
                  JP6G+793, Riyadh 12656, Saudi Arabia
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Our Core Principles
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1E232B] mt-2">
              Why Riyadh Trusts Our Furniture
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Factory Direct Excellence
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                By producing directly under {BUSINESS_INFO.legalName}, we cut out middleman markups, passing pure quality and fair Saudi Riyal pricing straight to you.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Orthopedic & Spine Support
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Our spring and medicated mattress lines are tested for optimal spinal alignment, pressure point relief, and long-lasting elasticity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-stone-200/90 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Seamless Riyadh Logistics
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                We take care of the entire journey. With free delivery across all Riyadh neighborhoods and Cash on Delivery options, furnishing your home is stress-free.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment Banner */}
        <div className="rounded-3xl bg-[#1E232B] text-white p-8 sm:p-14 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified 2026 Collection</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Ready to create a space that inspires you every single day?
            </h3>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Explore our 12 specialized categories or chat with our Riyadh design specialists directly on WhatsApp for tailored sizing and custom orders.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={onExploreShop}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                Explore All Products
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
