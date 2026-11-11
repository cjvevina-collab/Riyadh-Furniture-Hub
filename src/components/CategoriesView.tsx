import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { getStoredCategories } from '../data/categories';
import { Product, Category } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';

interface CategoriesViewProps {
  products: Product[];
  categories?: Category[];
  onSelectCategory: (categoryName: string) => void;
  lang?: Language;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  products,
  categories,
  onSelectCategory,
  lang = 'en'
}) => {
  const activeCategories = categories && categories.length > 0 ? categories : getStoredCategories();
  const isAr = lang === 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="py-12 sm:py-16 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5 text-[#C59A3F]" />
            <span>{isAr ? 'أقسام متكاملة' : 'Curated Collections'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1A2332] tracking-tight">
            {isAr ? 'أقسام الأثاث' : 'Furniture Categories'}
          </h1>
          <p className="text-stone-600 text-base mt-3 leading-relaxed">
            {isAr
              ? 'تصفح جميع أقسامنا المصممة لتلبي احتياجات كل منزل في الرياض، بدءاً من أسرّة المفرد الفاخرة وحتى المجموعات المكتملة والمراتب الطبية.'
              : 'Browse our complete architectural categories, spanning ergonomic single beds, opulent master suites, bunk configurations, and medicated spine-support mattresses.'}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeCategories.map((cat, index) => {
            const count = products.filter(p => 
              cat.id === 'all' || p.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === 'all' ? 'all' : cat.name)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-[#C59A3F]/50 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Image Frame */}
                <div className="relative aspect-16/10 overflow-hidden bg-stone-100">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[11px] font-bold text-stone-800 rounded-md shadow-xs">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs text-[11px] font-medium text-stone-200 rounded-md">
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-bold text-[#1A2332] group-hover:text-[#C59A3F] transition-colors">
                      {cat.name}
                    </h2>
                    <p className="text-stone-500 text-xs sm:text-sm mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#C59A3F] group-hover:text-[#A67D28]">
                    <span>{isAr ? 'تصفح التشكيلة' : 'Explore Collection'}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
