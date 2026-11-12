import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface TestimonialsSectionProps {
  lang?: Language;
}

interface TestimonialItem {
  id: string;
  nameEn: string;
  nameAr: string;
  districtEn: string;
  districtAr: string;
  productEn: string;
  productAr: string;
  rating: number;
  dateEn: string;
  dateAr: string;
  commentEn: string;
  commentAr: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    nameEn: 'Eng. Faisal Al-Otaibi',
    nameAr: 'م. فيصل العتيبي',
    districtEn: 'Al-Malqa, Riyadh',
    districtAr: 'حي الملقا، الرياض',
    productEn: 'Single Bed & Medicated Mattress',
    productAr: 'سرير مفرد مع مرتبة طبية',
    rating: 5,
    dateEn: '2 weeks ago',
    dateAr: 'منذ أسبوعين',
    commentEn: 'The single bed framing is exceptionally rigid, made with real solid wood and flawless joinery. Delivered to Al-Malqa within 36 hours and the Cash on Delivery upon inspection made the purchase completely risk-free. Highly recommended!',
    commentAr: 'هيكل السرير المفرد متين جداً وخشب صلب أصلي وتشطيب فاخر. تم التوصيل إلى حي الملقا خلال 36 ساعة، وميزة الدفع عند الاستلام بعد المعاينة منحتنا راحة بال تامة. أنصح بالتعامل معهم بشدة!'
  },
  {
    id: '2',
    nameEn: 'Sarah Al-Ghamdi',
    nameAr: 'سارة الغامدي',
    districtEn: 'Al-Nakheel, Riyadh',
    districtAr: 'حي النخيل، الرياض',
    productEn: 'Luxury Bedroom Set',
    productAr: 'طقم غرفة نوم فاخر',
    rating: 5,
    dateEn: '1 month ago',
    dateAr: 'منذ شهر',
    commentEn: 'We furnished our master bedroom with Riyadh Furniture Hub. The craftsmanship rivals international designer showrooms, but at direct factory prices. The headboard upholstery and nightstands are absolutely stunning.',
    commentAr: 'أثثنا غرفة النوم الرئيسية بالكامل من مركز الرياض للأثاث. الجودة تضاهي أفخم المعارض العالمية وبأسعار المصنع المباشرة بدون وسيط. تنجيد رأس السرير والكومودينات في غاية الروعة.'
  },
  {
    id: '3',
    nameEn: 'Dr. Tariq Al-Shehri',
    nameAr: 'د. طارق الشهري',
    districtEn: 'Hittin, Riyadh',
    districtAr: 'حي حطين، الرياض',
    productEn: 'Medicated Orthopedic Mattress',
    productAr: 'مرتبة طبية لراحة العمود الفقري',
    rating: 5,
    dateEn: '3 weeks ago',
    dateAr: 'منذ 3 أسابيع',
    commentEn: 'As someone suffering from lower back discomfort, the medicated mattress has made a noticeable difference from night one. Exceptional edge support, firm spine alignment, and prompt doorstep delivery across Riyadh.',
    commentAr: 'بصفتي أعاني من آلام أسفل الظهر، المرتبة الطبية فرقت معي كثيراً من أول ليلة. ثبات ودعم رائع للعمود الفقري، وتوصيل سريع ومحترم لباب المنزل في الرياض.'
  },
  {
    id: '4',
    nameEn: 'Noura Al-Dosari',
    nameAr: 'نورة الدوسري',
    districtEn: 'Al-Yasmin, Riyadh',
    districtAr: 'حي الياسمين، الرياض',
    productEn: 'Metal Bunk Bed Set',
    productAr: 'سرير حديد طابقين للأطفال',
    rating: 5,
    dateEn: 'Just recently',
    dateAr: 'مؤخراً',
    commentEn: 'Ordered the heavy-gauge metal bunk bed for our kids. Very stable, zero squeaks or wobbling, and safe rounded edges. The Riyadh team installed it neatly in under an hour. Great WhatsApp support as well!',
    commentAr: 'طلبنا سرير دورين حديد قوي للأولاد. ثابت جداً وبدون أي صوت صرير أو اهتزاز، وزوايا آمنة. فريق التركيب في الرياض ركبه باحترافية وسرعة، والتواصل عبر واتساب كان ممتازاً.'
  }
];

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ lang = 'en' }) => {
  const isAr = lang === 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-stone-200/90 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C59A3F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1A2332]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#1A2332] text-xs font-semibold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 text-[#C59A3F] fill-[#C59A3F]" />
              <span>{t.testimonialsBadge}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2332] tracking-tight">
              {t.testimonialsTitle}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2.5 leading-relaxed">
              {t.testimonialsSub}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={prev}
              aria-label="Previous Testimonial"
              className="p-3 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-[#C59A3F] hover:border-[#C59A3F] shadow-xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              onClick={next}
              aria-label="Next Testimonial"
              className="p-3 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-[#C59A3F] hover:border-[#C59A3F] shadow-xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Testimonials Grid (Desktop 3 cards, Mobile 1-2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-7 border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-[#C59A3F]/50 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Rating & Quote */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C59A3F]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C59A3F]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-stone-200 group-hover:text-[#C59A3F]/30 transition-colors" />
                </div>

                {/* Comment Text */}
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{isAr ? item.commentAr : item.commentEn}"
                </p>
              </div>

              {/* Author & Verification Info */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#1A2332]">
                    {isAr ? item.nameAr : item.nameEn}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#C59A3F]" />
                    <span>{isAr ? item.districtAr : item.districtEn}</span>
                  </div>
                  <div className="text-[10px] text-[#C59A3F] font-semibold mt-1">
                    {isAr ? item.productAr : item.productEn}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-600 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200/60">
                  <CheckCircle2 className="w-3 h-3 text-[#C59A3F]" />
                  <span>{isAr ? 'مشترٍ موثق' : 'Verified'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Metric Strip */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-stone-200/90 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A2332]">
              4.9 / 5.0
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {isAr ? 'متوسط تقييم العملاء في الرياض' : 'Riyadh Customer Satisfaction'}
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#C59A3F]">
              100%
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {isAr ? 'خشب وحديد صلب مصنعي' : 'Solid Factory Framing'}
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">
              {isAr ? 'نفس اليوم' : 'Same-Day'}
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {isAr ? 'توصيل لباب المنزل بالرياض' : 'Doorstep Delivery in Riyadh'}
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#C59A3F]">
              COD
            </div>
            <div className="text-xs text-stone-500 mt-1">
              {isAr ? 'الدفع عند الاستلام والمعاينة' : 'Inspection Before Payment'}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
