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

        {/* Horizontal Category Cards / Circles */}
        <div className="overflow-x-auto pb-4 pt-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-stretch gap-4 sm:gap-5 min-w-max">
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
                  className={`group w-36 sm:w-44 flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isSelected
                      ? 'bg-[#FAF8F5] border-[#C59A3F] shadow-md -translate-y-1'
                      : 'bg-white border-stone-200/80 hover:border-[#C59A3F]/50 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {/* Category Image Circle */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-stone-100 mb-3 border-2 border-stone-200/90 group-hover:border-[#C59A3F] transition-colors relative shadow-xs">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                  </div>

                  <span className="font-serif font-bold text-xs sm:text-sm text-[#1A2332] group-hover:text-[#C59A3F] line-clamp-1 transition-colors">
                    {cat.name}
                  </span>
                  
                  <span className="text-[10px] text-stone-400 mt-1">
                    {itemCount} {itemCount === 1 ? t.item : t.items}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
