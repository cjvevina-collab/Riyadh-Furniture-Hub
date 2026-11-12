import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Category, Product } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface HomeCategoriesBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (catName: string) => void;
  onViewAllCategories: () => void;
  products: Product[];
  lang?: Language;
}

export const HomeCategoriesBar: React.FC<HomeCategoriesBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onViewAllCategories,
  products,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const fallbackImage = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="pt-10 sm:pt-16 pb-8 sm:pb-12 bg-[#FAF8F5] border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C59A3F]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A2332]">
              {t.shopByCategory}
            </h2>
          </div>

          <button
            onClick={onViewAllCategories}
            className="text-xs sm:text-sm font-semibold text-[#C59A3F] hover:text-[#A67D28] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{t.viewAll} ({categories.length})</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>

        {/* Responsive Categories Grid - No slider, 2 per row on mobile, large images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {categories.map((cat) => {
            const isSelected = 
              (cat.id === 'all' && (selectedCategory === 'all' || selectedCategory === 'All Products')) ||
              selectedCategory.toLowerCase() === cat.name.toLowerCase();

            const itemCount = products.filter(p => 
              cat.id === 'all' || p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === 'all' ? 'all' : cat.name)}
                className={`group flex flex-col p-2.5 sm:p-3.5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isSelected
                    ? 'bg-[#FAF8F5] border-[#C59A3F] shadow-md -translate-y-1 ring-1 ring-[#C59A3F]/50'
                    : 'bg-white border-stone-200/90 hover:border-[#C59A3F]/60 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {/* Large Category Image Box (Double previous size) */}
                <div className="w-full aspect-4/3 sm:aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 mb-2.5 border border-stone-200/70 group-hover:border-[#C59A3F] transition-colors relative shadow-xs">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Subtle Item Count Badge */}
                  <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                    <span className="px-1.5 py-0.5 bg-black/55 backdrop-blur-xs text-[10px] font-semibold text-white rounded-md">
                      {itemCount}
                    </span>
                  </div>
                </div>

                {/* Category Title & Count */}
                <div className="text-center px-1">
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#1A2332] group-hover:text-[#C59A3F] line-clamp-1 transition-colors block">
                    {cat.name}
                  </span>
                  
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    {itemCount} {itemCount === 1 ? t.item : t.items}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
