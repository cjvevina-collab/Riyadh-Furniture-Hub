import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppLink } from '../data/config';

interface FloatingWhatsAppProps {
  isAr?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ isAr = false }) => {
  const defaultMessage = isAr 
    ? `مرحباً ${BUSINESS_INFO.name}، أود الاستفسار عن تفاصيل الأثاث والتوصيل بالرياض.`
    : `Hello ${BUSINESS_INFO.name}, I would like to inquire about your furniture in Riyadh.`;
    
  const whatsappUrl = getWhatsAppLink(defaultMessage);

  return (
    <aside aria-label="WhatsApp Contact" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rtl:right-auto rtl:left-4 rtl:sm:left-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A2332] hover:bg-[#C59A3F] text-white flex items-center justify-center shadow-lg border border-[#C59A3F]/50 hover:border-white transition-all duration-200 transform hover:scale-105 active:scale-95"
        title="WhatsApp"
      >
        <MessageCircle className="w-5 h-5 text-[#C59A3F] hover:text-white transition-colors" />
      </a>
    </aside>
  );
};
