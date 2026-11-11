import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Phone, 
  Search, 
  Truck,
  ChevronDown,
  Layers,
  CreditCard,
  MapPin,
  Globe,
  Award,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { BUSINESS_INFO, getWhatsAppLink } from '../data/config';
import { Category } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Category[];
  onSelectCategory: (catName: string) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  categories,
  onSelectCategory,
  language,
  onToggleLanguage
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catName: string) => {
    onSelectCategory(catName);
    setActiveTab('shop');
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sleek ticker items with clean vector icons - NO emojis and NO AI sparkles!
  const tickerItems = [
    { icon: ShieldCheck, text: t.ticker1 },
    { icon: Truck, text: t.ticker2 },
    { icon: CreditCard, text: t.ticker3 },
    { icon: Phone, text: t.ticker4 },
    { icon: Award, text: t.ticker5 },
    { icon: MapPin, text: t.ticker6 }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
      
      {/* Auto-sliding Marquee Ticker Top Bar (Clean Lucide Icons Only, No Emojis) */}
      <div className="bg-[#1A2332] text-stone-200 text-xs py-2 overflow-hidden border-b border-stone-800 select-none">
        <div className="animate-marquee flex items-center gap-10 font-medium tracking-wide">
          {tickerItems.concat(tickerItems).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2.5 shrink-0 text-[11px] sm:text-xs">
                <Icon className="w-3.5 h-3.5 text-[#C59A3F] shrink-0" />
                <span className="text-stone-200">{item.text}</span>
                <span className="text-stone-600 ml-4 font-bold">•</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Prominent Large Logo (Unboxed, clean, no side text) */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            title="Riyadh Furniture Hub - Home"
          >
            <img 
              src={BUSINESS_INFO.logoUrl} 
              alt={BUSINESS_INFO.name}
              className="h-16 sm:h-20 w-auto object-contain max-w-[200px] sm:max-w-[260px]"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 text-sm font-medium transition-all rounded-md relative cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#1A2332] font-bold'
                  : 'text-stone-600 hover:text-[#1A2332]'
              }`}
            >
              {t.home}
              {activeTab === 'home' && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#C59A3F] rounded-full" />
              )}
            </button>

            {/* Categories Dropdown in Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                onClick={() => handleNavClick('categories')}
                className={`px-3.5 py-2 text-sm font-medium transition-all rounded-md flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'categories'
                    ? 'text-[#1A2332] font-bold'
                    : 'text-stone-600 hover:text-[#1A2332]'
                }`}
              >
                <span>{t.categories}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoryDropdownOpen ? 'rotate-180 text-[#C59A3F]' : ''}`} />
                {activeTab === 'categories' && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#C59A3F] rounded-full" />
                )}
              </button>

              {/* Flyout Menu for Categories */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 rtl:left-auto rtl:right-0 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1 flex items-center justify-between">
                    <span>{t.productCategories}</span>
                    <Layers className="w-3 h-3 text-[#C59A3F]" />
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.name)}
                        className="w-full text-left rtl:text-right px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF8F5] hover:text-[#C59A3F] font-medium transition-colors cursor-pointer"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('shop')}
              className={`px-3.5 py-2 text-sm font-medium transition-all rounded-md relative cursor-pointer ${
                activeTab === 'shop'
                  ? 'text-[#1A2332] font-bold'
                  : 'text-stone-600 hover:text-[#1A2332]'
              }`}
            >
              {t.shop}
              {activeTab === 'shop' && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#C59A3F] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('story')}
              className={`px-3.5 py-2 text-sm font-medium transition-all rounded-md relative cursor-pointer ${
                activeTab === 'story'
                  ? 'text-[#1A2332] font-bold'
                  : 'text-stone-600 hover:text-[#1A2332]'
              }`}
            >
              {t.story}
              {activeTab === 'story' && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#C59A3F] rounded-full" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`px-3.5 py-2 text-sm font-medium transition-all rounded-md relative cursor-pointer ${
                activeTab === 'contact'
                  ? 'text-[#1A2332] font-bold'
                  : 'text-stone-600 hover:text-[#1A2332]'
              }`}
            >
              {t.contacts}
              {activeTab === 'contact' && (
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#C59A3F] rounded-full" />
              )}
            </button>
          </nav>

          {/* Action Icons: Language Toggle + Search + Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse">
            
            {/* Language Switcher (English / العربية) */}
            <div className="flex items-center bg-stone-100 p-1 rounded-full border border-stone-200">
              <button
                onClick={() => onToggleLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#1A2332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => onToggleLanguage('ar')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  language === 'ar'
                    ? 'bg-[#1A2332] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="التحويل للغة العربية"
              >
                العربية
              </button>
            </div>

            {/* Search Input / Toggle */}
            <div className="relative">
              {showSearchInput ? (
                <div className="flex items-center bg-stone-100 rounded-full px-3 py-1.5 border border-stone-300 w-44 sm:w-60 transition-all">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    autoFocus
                    className="w-full bg-transparent text-xs text-stone-800 focus:outline-hidden"
                  />
                  <button 
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="text-stone-400 hover:text-stone-700 ml-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowSearchInput(true);
                    if (activeTab !== 'shop') setActiveTab('shop');
                  }}
                  className="p-2.5 text-stone-700 hover:text-[#1A2332] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                  title="Search products"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-stone-700 hover:text-[#1A2332] hover:bg-stone-100 rounded-full transition-colors group cursor-pointer"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5 text-stone-800 group-hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C59A3F] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1 mb-4">
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full text-left rtl:text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home'
                  ? 'bg-amber-50 text-amber-900 font-bold border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C59A3F]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {t.home}
            </button>

            <button
              onClick={() => handleNavClick('shop')}
              className={`w-full text-left rtl:text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'shop'
                  ? 'bg-amber-50 text-amber-900 font-bold border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C59A3F]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {t.shop}
            </button>

            <button
              onClick={() => handleNavClick('categories')}
              className={`w-full text-left rtl:text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-amber-50 text-amber-900 font-bold border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C59A3F]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {t.categories}
            </button>

            {/* Mobile Categories list */}
            <div className="pl-4 rtl:pl-0 rtl:pr-4 py-1 space-y-1 border-l-2 rtl:border-l-0 rtl:border-r-2 border-stone-100 my-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryClick(c.name)}
                  className="w-full text-left rtl:text-right px-3 py-1.5 text-xs text-stone-600 hover:text-[#C59A3F] font-medium"
                >
                  • {c.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleNavClick('story')}
              className={`w-full text-left rtl:text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'story'
                  ? 'bg-amber-50 text-amber-900 font-bold border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C59A3F]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {t.story}
            </button>

            <button
              onClick={() => handleNavClick('contact')}
              className={`w-full text-left rtl:text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'contact'
                  ? 'bg-amber-50 text-amber-900 font-bold border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#C59A3F]'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {t.contacts}
            </button>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-2">
            <a
              href={`tel:${BUSINESS_INFO.phone}`}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-800"
            >
              <Phone className="w-4 h-4 text-[#C59A3F]" />
              <span>{BUSINESS_INFO.phone}</span>
            </a>
            <a
              href={getWhatsAppLink("Hello Riyadh Furniture Hub, I'm reaching out from your website.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1A2332] text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
              <span>{language === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Us'}</span>
            </a>
          </div>
        </div>
      )}

    </header>
  );
};
