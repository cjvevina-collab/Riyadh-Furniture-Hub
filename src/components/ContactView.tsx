import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Truck,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppLink } from '../data/config';
import { Language } from '../data/translations';

interface ContactViewProps {
  lang?: Language;
}

export const ContactView: React.FC<ContactViewProps> = ({ lang = 'en' }) => {
  const isAr = lang === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: isAr ? 'استفسار عن سرير مفرد أو طقم غرفة نوم' : 'Single Bed or Bedroom Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsAppDirectSubmit = () => {
    const text = isAr 
      ? `*طلب تواصل جديد - مركز الرياض للأثاث*\n` +
        `*الاسم:* ${formData.name || 'عميل'}\n` +
        `*الهاتف:* ${formData.phone || 'غير محدد'}\n` +
        `*البريد:* ${formData.email || 'غير محدد'}\n` +
        `*الموضوع:* ${formData.subject}\n` +
        `*الرسالة:* ${formData.message || 'أود الاستفسار عن الأثاث والتوصيل داخل الرياض.'}`
      : `*New Contact Inquiry - Riyadh Furniture Hub*\n` +
        `*Name:* ${formData.name || 'Customer'}\n` +
        `*Phone:* ${formData.phone || 'N/A'}\n` +
        `*Email:* ${formData.email || 'N/A'}\n` +
        `*Subject:* ${formData.subject}\n` +
        `*Message:* ${formData.message || 'I would like to inquire about furniture and delivery.'}`;
    window.open(getWhatsAppLink(text), '_blank');
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59A3F]">
            {isAr ? 'تواصل معنا' : 'Get In Touch'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A2332] mt-2 tracking-tight">
            {isAr ? 'تواصل مع مركز الرياض للأثاث' : 'Contact Riyadh Furniture Hub'}
          </h1>
          <p className="text-stone-600 text-base mt-3 leading-relaxed">
            {isAr 
              ? 'سواء كنت ترغب في مقاسات مخصصة، أسعار للطلبات الكبيرة، أو الاستفسار عن حالة التوصيل في الرياض، فريقنا دائماً في خدمتكم.'
              : 'Whether you want custom sizing, volume order quotations, or delivery status across Riyadh, our team is always ready to assist.'}
          </p>
        </div>

        {/* 3 Quick Action Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* WhatsApp Card - Brand Navy & Gold */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm flex flex-col justify-between hover:border-[#C59A3F] transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#1A2332] text-[#C59A3F] flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {isAr ? 'محادثة واتساب' : 'WhatsApp Chat'}
              </h3>
              <p className="text-stone-500 text-xs mt-1">
                {isAr ? 'مراسلة فورية، مشاركة الصور واستفسارات الكتالوج.' : 'Instant messaging, picture sharing & catalog queries.'}
              </p>
              <div className="mt-3 text-sm font-semibold text-stone-800" dir="ltr">
                {BUSINESS_INFO.whatsapp}
              </div>
            </div>
            <div className="mt-6">
              <a
                href={getWhatsAppLink(isAr ? "مرحباً مركز الرياض للأثاث، أتواصل معكم من صفحة التواصل." : "Hello Riyadh Furniture Hub, I'm reaching out through your contact page.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
                <span>{isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
              </a>
            </div>
          </div>

          {/* Phone Call Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm flex flex-col justify-between hover:border-[#C59A3F] transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-[#C59A3F]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {isAr ? 'اتصال هاتفي' : 'Telephone Call'}
              </h3>
              <p className="text-stone-500 text-xs mt-1">
                {isAr ? 'خط اتصال مباشر للتوصيل السريع واستفسارات المصنع.' : 'Direct phone line for quick dispatch and factory inquiries.'}
              </p>
              <div className="mt-3 text-sm font-semibold text-stone-800" dir="ltr">
                {BUSINESS_INFO.phone}
              </div>
            </div>
            <div className="mt-6">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C59A3F]" />
                <span>{isAr ? 'اتصل بنا الآن' : 'Call Us Now'}</span>
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm flex flex-col justify-between hover:border-[#C59A3F] transition-colors group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-stone-600" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {isAr ? 'البريد الإلكتروني' : 'Email Address'}
              </h3>
              <p className="text-stone-500 text-xs mt-1">
                {isAr ? 'البريد الرسمي للاستفسارات السكنية والمؤسسية.' : 'Official inbox for corporate and residential inquiries.'}
              </p>
              <div className="mt-3 text-sm font-semibold text-stone-800 truncate" dir="ltr">
                {BUSINESS_INFO.email}
              </div>
            </div>
            <div className="mt-6">
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold border border-stone-200 transition-colors"
              >
                <Mail className="w-4 h-4 text-stone-600" />
                <span>{isAr ? 'إرسال بريد' : 'Send Email'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form & Google Maps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Left */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 sm:p-10 border border-stone-200/90 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#1A2332] mb-2">
              {isAr ? 'أرسل لنا رسالة' : 'Send Us a Message'}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mb-6 leading-relaxed">
              {isAr 
                ? 'املأ النموذج وسيقوم ممثل خدمة العملاء بالتواصل معك مباشرة عبر الهاتف أو الواتساب.' 
                : 'Fill out this form and our client representative will reach back out immediately via WhatsApp or phone call.'}
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-stone-50 border border-[#C59A3F]/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1A2332] text-[#C59A3F] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-[#1A2332] text-base">
                  {isAr ? 'شكراً لك! تم استلام رسالتك بنجاح.' : 'Thank you! Your message has been received.'}
                </h4>
                <p className="text-stone-600 text-xs max-w-sm mx-auto">
                  {isAr 
                    ? `سيتواصل معك فريقنا في الرياض قريباً على ${formData.phone || formData.email || 'رقمك'}.`
                    : `Our Riyadh support team will contact you shortly on ${formData.phone || formData.email || 'your number'}.`}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs text-[#C59A3F] font-semibold underline hover:text-[#A67D28] cursor-pointer"
                >
                  {isAr ? 'إرسال استفسار آخر' : 'Send another inquiry'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isAr ? 'مثال: فيصل العتيبي' : 'e.g. Faisal Al-Otaibi'}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={isAr ? 'مثال: 0570713184' : 'e.g. +966 50 123 4567'}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={isAr ? 'مثال: customer@example.com' : 'e.g. customer@example.com'}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isAr ? 'نوع الاستفسار' : 'Inquiry Category'}
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                    >
                      {isAr ? (
                        <>
                          <option>استفسار سرير مفرد</option>
                          <option>استفسار سرير كينج</option>
                          <option>استفسار طقم غرفة نوم</option>
                          <option>مراتب طبية ونوابض</option>
                          <option>تفصيل ومقاسات خاصة</option>
                          <option>التوصيل في الرياض</option>
                        </>
                      ) : (
                        <>
                          <option>Single Bed Inquiry</option>
                          <option>King Size Bed Inquiry</option>
                          <option>Bedroom Set Inquiry</option>
                          <option>Spring / Medicated Mattress</option>
                          <option>Custom Manufacturing & Sizing</option>
                          <option>Delivery Across Riyadh</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isAr ? 'رسالتك / متطلباتك *' : 'Your Message / Requirements *'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={isAr ? 'أخبرنا عن المنتجات والمقاسات المطلوبة أو عنوان التوصيل المفضل بالرياض...' : 'Tell us about the items you need, sizes, or preferred Riyadh delivery address...'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C59A3F]" />
                    <span>{isAr ? 'إرسال الاستفسار' : 'Submit Inquiry'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirectSubmit}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#1A2332] hover:bg-[#C59A3F] text-white border border-[#C59A3F]/30 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#C59A3F]" />
                    <span>{isAr ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Location & Google Maps Right */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Business Address Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#C59A3F] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    {BUSINESS_INFO.name}
                  </h3>
                  <div className="text-xs text-[#C59A3F] font-medium">
                    {BUSINESS_INFO.legalName}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C59A3F] shrink-0 mt-0.5" />
                  <span className="font-medium text-stone-900">{BUSINESS_INFO.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C59A3F] shrink-0" />
                  <span>{isAr ? 'توصيل مجاني لجميع أحياء ومناطق الرياض' : 'Free delivery to all Riyadh districts'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C59A3F] shrink-0" />
                  <span>{isAr ? 'الدفع عند الاستلام متاح بعد المعاينة' : 'Cash on Delivery (COD) supported upon inspection'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C59A3F] shrink-0" />
                  <span>{isAr ? 'مفتوح يومياً: 9:00 صباحاً – 11:00 مساءً' : 'Open Daily: 9:00 AM – 11:00 PM'}</span>
                </div>
              </div>
            </div>

            {/* Embedded Google Maps Container */}
            <div className="rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-100 h-72 sm:h-80 relative">
              <iframe
                title="Riyadh Furniture Hub Location"
                src={BUSINESS_INFO.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

