/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { FullHeroSlider } from './components/FullHeroSlider';
import { HomeCategoriesBar } from './components/HomeCategoriesBar';
import { 
  HomeFurnitureBanner, 
  OfficeFurnitureBanner 
} from './components/HeroBanners';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { AboutSection } from './components/AboutSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { BedroomCollectionSection } from './components/BedroomCollectionSection';
import { FAQSection } from './components/FAQSection';
import { CustomerSupportSection } from './components/CustomerSupportSection';
import { DeliveryBannerSection } from './components/DeliveryBannerSection';
import { ShopView } from './components/ShopView';
import { CategoriesView } from './components/CategoriesView';
import { ContactView } from './components/ContactView';
import { OurStoryView } from './components/OurStoryView';
import { ProductDetailView } from './components/ProductDetailView';
import { TestimonialsSection } from './components/TestimonialsSection';
import { CartDrawer } from './components/CartDrawer';
import { AdminPortal } from './components/AdminPortal';
import { Product, CartItem, Category } from './types';
import { fetchProducts, fetchCategories, saveAllCategories, listenToAuth } from './firebase';
import { INITIAL_PRODUCTS } from './data/initialData';
import { getStoredCategories } from './data/categories';
import { Language } from './data/translations';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<'home' | 'story' | 'shop' | 'categories' | 'contact' | 'product'>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rfh_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load products & categories from Firebase Firestore
  const loadProductData = async () => {
    const list = await fetchProducts();
    setProducts(list);
  };

  const loadCategoriesData = async () => {
    const list = await fetchCategories();
    if (list && list.length > 0) {
      setCategories(list);
    }
  };

  useEffect(() => {
    loadProductData();
    loadCategoriesData();
    const unsubscribe = listenToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rfh_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => 
          i.product.id === product.id 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev => prev.map(i => 
      i.product.id === productId ? { ...i, quantity } : i
    ));
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectCategoryFromView = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div 
      dir={language === 'ar' ? 'rtl' : 'ltr'} 
      className={`min-h-screen flex flex-col bg-[#FAFAF7] text-[#1A2332] ${language === 'ar' ? 'font-sans' : ''}`}
    >
      
      {/* Navigation Header with Marquee, Large Logo, Menu, Language Switcher & Cart */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        onSelectCategory={handleSelectCategoryFromView}
        language={language}
        onToggleLanguage={(l) => setLanguage(l)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Full-Size Auto-sliding Banners (4 provided banner images, bottom-right arrows) */}
            <FullHeroSlider 
              onBannerClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />

            {/* Immediately below the banners: Categories Carousel/Bar */}
            <HomeCategoriesBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategoryFromView}
              onViewAllCategories={() => {
                setActiveTab('categories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              products={products}
              lang={language}
            />

            {/* Immediately below categories: Featured Products Section */}
            <FeaturedProductsSection
              products={products}
              onSelectProduct={handleOpenProduct}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onSeeAllClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isAdmin={!!currentUser}
              onOpenAdminAdd={() => setIsAdminOpen(true)}
              lang={language}
            />

            {/* Section 3: Home Furniture Banner */}
            <HomeFurnitureBanner 
              onExploreClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              lang={language}
            />

            {/* Section 4: Office Furniture Banner (Redesigned with soft light background & gold tones) */}
            <OfficeFurnitureBanner 
              onExploreClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              lang={language}
            />

            {/* Section 5: About Business */}
            <AboutSection 
              onShopNowClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              lang={language}
            />

            {/* Section 6: Why Choose Us */}
            <WhyChooseUsSection lang={language} />

            {/* Section 7: Bedroom Collection (Single Bedroom Set) */}
            <BedroomCollectionSection 
              onSeeAllClick={() => {
                setSelectedCategory('Single Bedroom Set');
                setActiveTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              lang={language}
            />

            {/* Section: Verified Customer Testimonials on Homepage */}
            <TestimonialsSection lang={language} />

            {/* Section 8: Frequently Asked Questions */}
            <FAQSection lang={language} />

            {/* Section 9: Customer Support */}
            <CustomerSupportSection 
              onContactClick={() => {
                setActiveTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              lang={language}
            />

            {/* Section 10: Delivery Banner */}
            <DeliveryBannerSection 
              onLearnMoreClick={() => {
                setActiveTab('story');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              lang={language}
            />
          </div>
        )}

        {activeTab === 'story' && (
          <OurStoryView 
            onExploreShop={() => {
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            lang={language}
          />
        )}

        {activeTab === 'shop' && (
          <ShopView
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleOpenProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            isAdmin={!!currentUser}
            onOpenAdminAdd={() => setIsAdminOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            lang={language}
          />
        )}

        {activeTab === 'product' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onBack={() => {
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={handleOpenProduct}
            onAddToCart={(p, qty) => handleAddToCart(p, qty)}
            lang={language}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            products={products}
            categories={categories}
            onSelectCategory={handleSelectCategoryFromView}
            lang={language}
          />
        )}

        {activeTab === 'contact' && (
          <ContactView lang={language} />
        )}
      </main>

      {/* Footer (Light Theme, Large Logo, Left-Aligned Links, Admin Link) */}
      <Footer 
        setActiveTab={(tab: string) => setActiveTab(tab as any)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        lang={language}
      />

      {/* WhatsApp Fixed Button with Phone Number (NO DOT!) */}
      <FloatingWhatsApp isAr={language === 'ar'} />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Admin Portal Modal with Multi-Images, Cover Image selector, Duplicate product & Category manager */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        products={products}
        categories={categories}
        onRefreshProducts={loadProductData}
        onUpdateCategories={(newCats) => {
          setCategories(newCats);
          saveAllCategories(newCats);
        }}
      />

    </div>
  );
}
