export const BUSINESS_INFO = {
  name: 'Riyadh Furniture Hub',
  legalName: 'Riyadh Furniture Factory',
  type: 'Furniture Store',
  country: 'Saudi Arabia',
  city: 'Riyadh',
  postalCode: '12656',
  address: 'JP6G+793, Riyadh 12656, Saudi Arabia',
  phone: '+966 570 713 184',
  whatsapp: '+966 570 713 184',
  whatsappRaw: '966570713184',
  email: 'bfbcgi@gmail.com',
  website: 'https://riyadhfurniturehub.com/',
  logoUrl: 'https://i.postimg.cc/Gp6fJ3yx/Chat-GPT-Image-Aug-14-2026-11-10-57-AM.png',
  currency: 'SAR',
  currencyArabic: 'ر.س',
  copyrightYear: '2026',
  googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115982.93489814467!2d46.6752957!3d24.7135517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d48939b%3A0x8670562e6d623b37!2sRiyadh%20Saudi%20Arabia!5e0!3m2!1sen!2ssa!4v1714000000000!5m2!1sen!2ssa'
};

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${BUSINESS_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
}

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString()} SAR`;
}
