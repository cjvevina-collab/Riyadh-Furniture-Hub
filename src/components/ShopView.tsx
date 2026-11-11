import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  ShoppingBag, 
  Eye, 
  MessageCircle, 
  PlusCircle, 
  Check, 
  ArrowUpDown,
  X
} from 'lucide-react';
import { Product, Category } from '../types';
import { PRODUCT_CATEGORIES } from '../data/categories';
import { formatPrice, getWhatsAppLink } from '../data/config';
import { Language } from '../data/translations';

interface ShopViewProps {
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAdmin?: boolean;
  onOpenAdminAdd?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories?: Category[];
  lang?: Language;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  onAddToCart,
  isAdmin,
  onOpenAdminAdd,
  searchQuery,
  setSearchQuery,
  categories,
  lang = 'en'
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category match
      const matchesCategory = 
        selectedCategory === 'all' || 
        selectedCategory === 'All Products' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = 
        !query || 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      // Stock match
      const matchesStock = !inStockOnly || item.inStock;

      return matchesCategory && matchesSearch && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.createdAt || '').localeCompare(a.createdAt || '');
      // default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, sortBy]);

  const activeCategories = categories && categories.length > 0 ? categories : PRODUCT_CATEGORIES;

  const currentCategoryObj = activeCategories.find(c => 
    c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="py-10 sm:py-14 bg-[#FAF8F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="text-xs text-stone-500 mb-2">
            <span>Home</span> <span className="mx-1">/</span> <span className="text-stone-900 font-semibold">Shop Catalog</span>
            {selectedCategory !== 'all' && (
              <> <span className="mx-1">/</span> <span className="text-amber-700 font-semibold">{currentCategoryObj?.name || selectedCategory}</span></>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E232B] tracking-tight">
                {currentCategoryObj ? currentCategoryObj.name : 'Furniture Catalog'}
              </h1>
              <p className="text-stone-500 text-sm mt-1 max-w-2xl">
                {currentCategoryObj 
                  ? currentCategoryObj.description 
                  : 'Discover handcrafted beds, bedroom sets, and mattresses available for free delivery across Riyadh.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={onOpenAdminAdd}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              )}
              
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-800 shadow-xs"
              >
                <Filter className="w-4 h-4 text-amber-600" />
                <span>Categories & Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Horizontal Scrolling Pills */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {activeCategories.map((cat) => {
              const isSelected = 
                (cat.id === 'all' && (selectedCategory === 'all' || selectedCategory === 'All Products')) ||
                selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === 'all' ? 'all' : cat.name)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#1E232B] text-white shadow-xs font-semibold'
                      : 'bg-white text-stone-700 border border-stone-200/90 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Search, Filters & Sorting */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by title or specs..."
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:border-amber-600"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-end text-xs">
            {/* In stock toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300"
              />
              <span>In Stock Only</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-stone-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-hidden focus:border-amber-600 cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            <span className="text-stone-400 text-xs hidden lg:inline">|</span>
            <span className="text-stone-500 font-medium">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Main Grid or Empty Category State */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-amber-600/50 hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-stone-100 cursor-pointer" 
                  onClick={() => onSelectProduct(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-stone-800 rounded-md shadow-xs">
                      {product.category}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-md shadow-xs">
                        Save {product.originalPrice - product.price} SAR
                      </span>
                    )}
                  </div>

                  {/* Stock tag */}
                  <div className="absolute top-3 right-3 z-10">
                    {product.inStock ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-md flex items-center gap-1 shadow-xs">
                        <Check className="w-2.5 h-2.5" /> In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-stone-200 text-stone-700 text-[10px] font-medium rounded-md">
                        Made to Order
                      </span>
                    )}
                  </div>

                  {/* Overlay Quick Action Buttons */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="p-3 bg-white hover:bg-amber-50 text-stone-800 rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform cursor-pointer"
                      title={lang === 'ar' ? 'عرض صفحة المنتج' : 'View Product Details'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <a
                      href={getWhatsAppLink(`Hello Riyadh Furniture Hub, I would like to order "${product.title}" (${product.price} SAR). Please confirm delivery to Riyadh.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-3 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
                      title="Instant WhatsApp Order"
                    >
                      <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif font-bold text-base text-[#1E232B] hover:text-amber-700 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.title}
                    </h3>
                    <p className="text-stone-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>

                    {product.dimensions && (
                      <div className="mt-2 text-[11px] text-stone-400">
                        Dim: {product.dimensions}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="block text-sm sm:text-base font-bold text-stone-900">
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
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1E232B] hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Ready state for categories that are pending user uploads */
          <div className="rounded-2xl border-2 border-dashed border-stone-200 bg-white p-12 text-center max-w-2xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center mb-4">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-800">
              No Listings in "{currentCategoryObj?.name || selectedCategory}" Yet
            </h3>
            <p className="text-stone-500 text-sm mt-2 leading-relaxed">
              This category structure is fully prepared and active. Products can be added anytime through the Admin Panel, or you can inquire directly on WhatsApp for custom factory orders in Riyadh!
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {isAdmin && (
                <button
                  onClick={onOpenAdminAdd}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Upload Product to this Category</span>
                </button>
              )}

              <button
                onClick={() => setSelectedCategory('all')}
                className="px-5 py-2.5 bg-[#1E232B] hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors"
              >
                View All Categories
              </button>

              <a
                href={getWhatsAppLink(`Hello Riyadh Furniture Hub, I would like to inquire about availability and custom orders for "${currentCategoryObj?.name || selectedCategory}".`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-[#C59A3F]" />
                <span>{lang === 'ar' ? 'طلب تفصيل خاص عبر واتساب' : 'WhatsApp Custom Request'}</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
