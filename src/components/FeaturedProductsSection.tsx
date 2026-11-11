import React from 'react';
import { ArrowRight, ShoppingBag, Eye, MessageCircle, PlusCircle } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, getWhatsAppLink } from '../data/config';
import { Language, TRANSLATIONS } from '../data/translations';

interface FeaturedProductsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSeeAllClick: () => void;
  isAdmin?: boolean;
  onOpenAdminAdd?: () => void;
  lang?: Language;
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onSeeAllClick,
  isAdmin,
  onOpenAdminAdd,
  lang = 'en'
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const featured = products.filter(p => p.isFeatured || products.length <= 4);
  const fallbackImage = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80';

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and "See All Products" Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C59A3F] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C59A3F]" />
              <span>{t.curatedSelection}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1A2332] tracking-tight">
              {t.enjoyFeaturedProducts}
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {t.featuredSub}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={onOpenAdminAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#C59A3F]/30 text-[#A67D28] bg-amber-50 hover:bg-amber-100 text-xs font-semibold transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.addProduct}</span>
              </button>
            )}
            <button
              onClick={onSeeAllClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-stone-300 hover:border-[#1A2332] text-stone-800 text-xs sm:text-sm font-semibold transition-all hover:bg-stone-50 cursor-pointer"
            >
              <span>{t.seeAllProducts}</span>
              <ArrowRight className="w-4 h-4 text-stone-500 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featured.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-[#FAF8F5] rounded-2xl overflow-hidden border border-stone-200/80 hover:border-[#C59A3F]/50 hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image Frame */}
                <div 
                  className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-stone-100 cursor-pointer" 
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-col gap-1">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-stone-800 rounded-md shadow-xs">
                      {product.category}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="px-2 py-0.5 bg-[#1A2332] text-amber-300 text-[10px] font-bold rounded-md shadow-xs border border-amber-400/30">
                        {t.save} {product.originalPrice - product.price} SAR
                      </span>
                    )}
                  </div>

                  {/* Hover Quick Actions (Brand Navy & Gold - No Green) */}
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="p-2.5 bg-white hover:bg-stone-100 text-stone-800 rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
                      title={lang === 'ar' ? 'عرض صفحة المنتج' : 'View Full Details'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={getWhatsAppLink(`Hello Riyadh Furniture Hub, I'm interested in "${product.title}" (${product.price} SAR). Is it available for delivery in Riyadh?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform border border-amber-400/40"
                      title={t.orderViaWhatsApp}
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-[#1A2332]" />
                    </a>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-serif font-bold text-base text-[#1A2332] hover:text-[#C59A3F] transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.title}
                    </h3>
                    <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-200/60 flex items-center justify-between">
                    <div>
                      <span className="block text-sm font-bold text-stone-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="block text-[11px] text-stone-400 line-through">
                          {product.originalPrice} SAR
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{t.addToCart}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-2xl border-2 border-dashed border-stone-200 p-12 text-center bg-stone-50/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center text-[#C59A3F]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">
              New Handcrafted Collections Uploading Soon
            </h3>
            <p className="text-stone-500 text-sm max-w-md mx-auto mt-2">
              Our factory craftsmen are curating exclusive pieces for Riyadh. Browse our category catalog or contact us directly on WhatsApp for custom orders.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={onSeeAllClick}
                className="px-6 py-2.5 bg-[#1A2332] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
              >
                {t.seeAllProducts}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
