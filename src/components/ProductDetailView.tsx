import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Check, 
  Star, 
  Share2, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Product } from '../types';
import { formatPrice, getWhatsAppLink, BUSINESS_INFO } from '../data/config';
import { Language, TRANSLATIONS } from '../data/translations';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  lang?: Language;
}

interface ReviewItem {
  id: string;
  name: string;
  district: string;
  rating: number;
  date: string;
  comment: string;
}

const DEFAULT_REVIEWS: Record<string, ReviewItem[]> = {
  default: [
    {
      id: 'rev-1',
      name: 'Faisal Al-Otaibi',
      district: 'Al-Malqa, Riyadh',
      rating: 5,
      date: '2 days ago',
      comment: 'Superb craftsmanship. Solid frame, zero wobble, and seamless Cash on Delivery.'
    },
    {
      id: 'rev-2',
      name: 'Noura Al-Shehri',
      district: 'Al-Nakheel, Riyadh',
      rating: 5,
      date: '1 week ago',
      comment: 'Great quality directly from Riyadh factory. WhatsApp communication was fast and helpful.'
    }
  ]
};

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCart,
  lang = 'en'
}) => {
  const isAr = lang === 'ar';
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const allImages = [product.imageUrl, ...(product.additionalImages || [])].filter(Boolean);

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const selectedImage = allImages[currentImageIndex] || product.imageUrl;

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    setIsZoomed(false);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setIsZoomed(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNextImage();
    } else if (distance < -45) {
      handlePrevImage();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Reviews state with localStorage persistence
  const storageKey = `rfh_reviews_${product.id}`;
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : DEFAULT_REVIEWS.default;
    } catch {
      return DEFAULT_REVIEWS.default;
    }
  });

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsFullscreen(false);
    setIsZoomed(false);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id, product.imageUrl]);

  // Keyboard navigation in fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setIsZoomed(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % Math.max(1, allImages.length));
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + Math.max(1, allImages.length)) % Math.max(1, allImages.length));
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreen, allImages.length]);

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: newName.trim(),
      district: newDistrict.trim() || (isAr ? 'الرياض' : 'Riyadh'),
      rating: newRating,
      date: isAr ? 'اليوم' : 'Today',
      comment: newComment.trim()
    };

    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setNewName('');
    setNewDistrict('');
    setNewComment('');
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3000);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // WhatsApp formatted inquiry message
  const whatsappInquiryText = isAr
    ? `*طلب أثاث جديد - مركز الرياض للأثاث*\n` +
      `*المنتج:* ${product.title}\n` +
      `*القسم:* ${product.category}\n` +
      `*الكمية:* ${quantity}\n` +
      `*السعر:* ${product.price * quantity} SAR\n` +
      `*العنوان:* أرجو تأكيد موعد التوصيل المجاني إلى عنواني بالرياض.`
    : `*New Order - Riyadh Furniture Hub*\n` +
      `*Product:* ${product.title}\n` +
      `*Category:* ${product.category}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Total Price:* ${product.price * quantity} SAR\n` +
      `*Delivery:* Please confirm Riyadh delivery with Cash on Delivery.`;

  // Related products
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id)
    .filter(p => p.category.toLowerCase() === product.category.toLowerCase() || p.isFeatured)
    .slice(0, 4);

  return (
    <div className="py-4 sm:py-8 bg-[#FAF8F5] min-h-screen text-[#1A2332]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Sleek, Minimal Mobile-First Header Bar (No bulky breadcrumb repetition) */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#C59A3F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{t.backToShop}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            <button
              onClick={handleShare}
              className="text-stone-500 hover:text-stone-800 p-1.5 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left: Interactive Image Slider & Fullscreen Trigger */}
          <div className="lg:col-span-7 space-y-3">
            <div 
              onClick={() => setIsFullscreen(true)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-4/3 sm:aspect-16/11 rounded-2xl overflow-hidden bg-white border border-stone-200/90 shadow-sm group cursor-zoom-in select-none"
            >
              <img
                src={selectedImage}
                alt={`${product.title} - ${currentImageIndex + 1}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover transition-transform duration-300"
              />

              {/* Top Badges */}
              <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
                {product.inStock ? (
                  <span className="px-2.5 py-1 bg-emerald-600/90 text-white text-[11px] font-semibold rounded-md flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{isAr ? 'متوفر' : 'In Stock'}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-stone-800/90 text-white text-[11px] font-semibold rounded-md">
                    {isAr ? 'حسب الطلب' : 'Made to Order'}
                  </span>
                )}
                <span className="px-2.5 py-1 bg-white/90 text-stone-800 text-[11px] font-semibold rounded-md border border-stone-200 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-[#C59A3F]" />
                  <span>{isAr ? 'توصيل مجاني بالرياض' : 'Free Riyadh Delivery'}</span>
                </span>
              </div>

              {/* Left / Right Slider Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs shadow-md transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Bottom Controls: Image Counter + Fullscreen Button */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                {allImages.length > 1 ? (
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold">
                    {currentImageIndex + 1} / {allImages.length}
                  </span>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(true);
                  }}
                  aria-label="Fullscreen view"
                  className="pointer-events-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/65 hover:bg-black/85 text-white text-[11px] font-semibold backdrop-blur-xs shadow-md transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#C59A3F]" />
                  <span>{isAr ? 'ملء الشاشة' : 'Fullscreen'}</span>
                </button>
              </div>
            </div>

            {/* Thumbnail Strip (Unlimited Images) */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
                {allImages.map((imgUrl, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      currentImageIndex === idx 
                        ? 'border-[#C59A3F] ring-2 ring-[#C59A3F]/30' 
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.title} preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Buying Actions */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C59A3F]">
                {product.category}
              </span>
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#1A2332] mt-1 leading-snug">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-1.5 mt-2 text-xs">
                <div className="flex items-center text-[#C59A3F]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#C59A3F]" />
                  ))}
                </div>
                <span className="font-semibold text-stone-800">4.9</span>
                <span className="text-stone-400">•</span>
                <span className="text-stone-500 text-[11px]">
                  {reviews.length} {isAr ? 'تقييمات' : 'reviews'}
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-3.5 bg-white rounded-xl border border-stone-200/90 flex items-baseline justify-between">
              <div>
                <span className="text-[11px] text-stone-500 block">
                  {isAr ? 'السعر' : 'Price'}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-bold text-[#1A2332]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-xs sm:text-sm text-stone-400 line-through">
                      {product.originalPrice} SAR
                    </span>
                  )}
                </div>
              </div>

              {product.originalPrice && product.originalPrice > product.price && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 text-[11px] font-bold rounded-md">
                  {isAr ? `وفر ${product.originalPrice - product.price} SAR` : `Save ${product.originalPrice - product.price} SAR`}
                </span>
              )}
            </div>

            {/* Concise Description */}
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            {/* Compact Specifications Grid (Designed not to overflow on mobile) */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">
                  {isAr ? 'المقاس' : 'Dimensions'}
                </span>
                <span className="font-semibold text-stone-800 text-xs truncate block mt-0.5">
                  {product.dimensions || (isAr ? 'مقاس قياسي' : 'Standard')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">
                  {isAr ? 'الخامة' : 'Material'}
                </span>
                <span className="font-semibold text-stone-800 text-xs truncate block mt-0.5">
                  {product.material || (isAr ? 'خشب مصنعي' : 'Solid Wood')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">
                  {isAr ? 'اللون' : 'Color'}
                </span>
                <span className="font-semibold text-stone-800 text-xs truncate block mt-0.5">
                  {product.color || (isAr ? 'طبيعي' : 'Natural')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">
                  {isAr ? 'التوصيل' : 'Delivery'}
                </span>
                <span className="font-semibold text-emerald-700 text-xs truncate block mt-0.5">
                  {isAr ? 'نفس اليوم بالرياض' : 'Same-Day Riyadh'}
                </span>
              </div>
            </div>

            {/* Quantity Selector & Main Purchasing Actions */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-stone-700 font-bold hover:bg-stone-100 transition-colors cursor-pointer text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-bold text-stone-900 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-stone-700 font-bold hover:bg-stone-100 transition-colors cursor-pointer text-xs"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#1A2332] hover:bg-[#C59A3F] text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>
                    {addedAnimation 
                      ? (isAr ? 'تمت الإضافة!' : 'Added!') 
                      : (isAr ? `إضافة للسلة (${formatPrice(product.price * quantity)})` : `Add to Bag (${formatPrice(product.price * quantity)})`)}
                  </span>
                </button>
              </div>

              {/* Direct WhatsApp Order Button */}
              <a
                href={getWhatsAppLink(whatsappInquiryText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-white" />
                <span>{isAr ? 'طلب فوري عبر واتساب' : 'Order on WhatsApp'}</span>
              </a>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 pt-1">
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-stone-200/70">
                <Truck className="w-3.5 h-3.5 text-[#C59A3F] shrink-0" />
                <span>{isAr ? 'توصيل مجاني بالرياض' : 'Free Riyadh Delivery'}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-stone-200/70">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C59A3F] shrink-0" />
                <span>{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        <section className="pt-8 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1A2332]">
                {t.customerReviews}
              </h2>
              <span className="text-xs text-stone-500">
                {reviews.length} {isAr ? 'تقييمات موثقة من عملاء الرياض' : 'verified reviews from Riyadh buyers'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-3">
              {reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-[#1A2332]">{rev.name}</span>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        {rev.district} • {rev.date}
                      </div>
                    </div>

                    <div className="flex items-center text-[#C59A3F]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#C59A3F]" />
                      ))}
                    </div>
                  </div>

                  <p className="text-stone-600 text-xs leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5 bg-white rounded-xl p-4 sm:p-5 border border-stone-200/80 shadow-xs space-y-3">
              <h3 className="font-bold text-xs text-[#1A2332]">
                {t.writeReview}
              </h3>

              {showReviewSuccess && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.thankYouReview}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {t.yourRating}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-0.5 cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating 
                              ? 'text-[#C59A3F] fill-[#C59A3F]' 
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {t.yourName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Name"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      {t.yourDistrict}
                    </label>
                    <input
                      type="text"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      placeholder="e.g. Al-Malqa"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    {t.reviewComment} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Feedback..."
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-md text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-3 bg-[#1A2332] hover:bg-[#C59A3F] text-white rounded-md text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.submitReview}
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-stone-200 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#1A2332]">
              {t.relatedProducts}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((relProduct) => (
                <div
                  key={relProduct.id}
                  onClick={() => onSelectProduct(relProduct)}
                  className="bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-xs hover:border-[#C59A3F] transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={relProduct.imageUrl}
                      alt={relProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 space-y-1">
                    <h3 className="font-serif font-bold text-xs text-stone-900 group-hover:text-[#C59A3F] transition-colors truncate">
                      {relProduct.title}
                    </h3>
                    <div className="font-bold text-xs text-[#1A2332]">
                      {formatPrice(relProduct.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Fullscreen Lightbox Slider Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between select-none animate-in fade-in duration-200"
          onClick={() => {
            setIsFullscreen(false);
            setIsZoomed(false);
          }}
        >
          {/* Top Bar */}
          <div 
            className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/60 border-b border-white/10 text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="px-2.5 py-1 rounded-full bg-white/15 text-xs font-bold shrink-0">
                {currentImageIndex + 1} / {allImages.length}
              </span>
              <span className="text-xs sm:text-sm font-serif truncate text-stone-200">
                {product.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsZoomed((z) => !z)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                {isZoomed ? <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" /> : <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFullscreen(false);
                  setIsZoomed(false);
                }}
                className="p-2 rounded-full bg-white/15 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                aria-label="Close fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Image Stage with Swipe & Slide Arrows */}
          <div 
            className="relative flex-1 flex items-center justify-center overflow-auto p-2 sm:p-6"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={selectedImage}
              alt={`${product.title} fullscreen ${currentImageIndex + 1}`}
              onClick={() => setIsZoomed((z) => !z)}
              className={`transition-transform duration-300 rounded-lg select-none ${
                isZoomed 
                  ? 'max-w-none max-h-none scale-150 cursor-zoom-out' 
                  : 'max-w-full max-h-[75vh] object-contain cursor-zoom-in'
              }`}
            />

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous fullscreen image"
                  className="fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-[#C59A3F] text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next fullscreen image"
                  className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-[#C59A3F] text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnail Strip inside Fullscreen */}
          {allImages.length > 1 && (
            <div 
              className="px-4 py-3 bg-black/75 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto z-20"
              onClick={(e) => e.stopPropagation()}
            >
              {allImages.map((imgUrl, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    currentImageIndex === idx 
                      ? 'border-[#C59A3F] scale-105' 
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
