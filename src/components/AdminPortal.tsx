import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Key, 
  LogOut, 
  Plus, 
  Upload, 
  Check, 
  Copy, 
  Trash2, 
  Edit3, 
  FileCode, 
  Package, 
  ShoppingBag, 
  AlertCircle,
  ShieldCheck,
  Star,
  FolderPlus,
  Layers
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Product, OrderDetails, Category } from '../types';
import { formatPrice } from '../data/config';
import { 
  loginWithEmail, 
  logoutUser, 
  saveProduct, 
  deleteProduct, 
  saveCategory,
  deleteCategory,
  saveAllCategories,
  uploadImageToImgBB, 
  RECOMMENDED_FIRESTORE_RULES,
  getLocalOrders
} from '../firebase';
import { saveStoredCategories } from '../data/categories';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  products: Product[];
  categories: Category[];
  onRefreshProducts: () => void;
  onUpdateCategories: (cats: Category[]) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  currentUser,
  products,
  categories,
  onRefreshProducts,
  onUpdateCategories
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'rules' | 'orders'>('products');

  // Auth form states (only email & password as requested)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Product modal states
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Product form with multi-image support
  const [productForm, setProductForm] = useState<{
    title: string;
    category: string;
    price: string;
    originalPrice: string;
    description: string;
    imageUrl: string;
    additionalImages: string[];
    dimensions: string;
    material: string;
    color: string;
    inStock: boolean;
    isFeatured: boolean;
  }>({
    title: '',
    category: 'Single Bed',
    price: '',
    originalPrice: '',
    description: '',
    imageUrl: '',
    additionalImages: [],
    dimensions: '120 cm x 200 cm',
    material: 'Kiln-Dried Hardwood & Fabric',
    color: 'Sand Beige',
    inStock: true,
    isFeatured: false
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [rulesCopied, setRulesCopied] = useState(false);

  // New Category form modal
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [isUploadingCatImage, setIsUploadingCatImage] = useState(false);
  const [isSyncingAllCategories, setIsSyncingAllCategories] = useState(false);
  const [catSyncSuccess, setCatSyncSuccess] = useState('');

  const handleOpenAddCategory = () => {
    setEditingCategoryId(null);
    setCategoryForm({ name: '', description: '', imageUrl: '' });
    setIsAddingCategory(true);
  };

  const handleOpenEditCategory = (c: Category) => {
    setEditingCategoryId(c.id);
    setCategoryForm({
      name: c.name,
      description: c.description,
      imageUrl: c.imageUrl
    });
    setIsAddingCategory(true);
  };

  const handleSyncAllCategoriesToFirestore = async () => {
    setIsSyncingAllCategories(true);
    setCatSyncSuccess('');
    try {
      await saveAllCategories(categories);
      setCatSyncSuccess('All categories successfully synced to Firebase Firestore database!');
      setTimeout(() => setCatSyncSuccess(''), 5000);
    } catch (err: any) {
      alert(`Sync error: ${err.message}`);
    } finally {
      setIsSyncingAllCategories(false);
    }
  };

  const handleDeleteCategory = async (catId: string, name: string) => {
    if (catId === 'all') {
      alert('The "All Products" category cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      const updated = categories.filter(c => c.id !== catId);
      onUpdateCategories(updated);
      saveStoredCategories(updated);
      try {
        await deleteCategory(catId);
      } catch (err) {
        console.warn('Firestore delete category warning:', err);
      }
    }
  };

  if (!isOpen) return null;

  // Handle Admin Login (Email + Password only)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setAuthError(err.message || 'Invalid credentials. Please verify your Firebase email and password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    }
  };

  // Open add product form
  const handleOpenAddProduct = () => {
    setEditingId(null);
    setProductForm({
      title: '',
      category: categories.find(c => c.id !== 'all')?.name || 'Single Bed',
      price: '',
      originalPrice: '',
      description: '',
      imageUrl: '',
      additionalImages: [],
      dimensions: '120 cm x 200 cm',
      material: 'Kiln-Dried Hardwood & Fabric',
      color: 'Sand Beige',
      inStock: true,
      isFeatured: false
    });
    setImageUrlInput('');
    setUploadStatus('');
    setIsEditingProduct(true);
  };

  // Open edit product form
  const handleOpenEditProduct = (p: Product) => {
    setEditingId(p.id);
    setProductForm({
      title: p.title,
      category: p.category,
      price: p.price.toString(),
      originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
      description: p.description,
      imageUrl: p.imageUrl,
      additionalImages: p.additionalImages || [],
      dimensions: p.dimensions || '',
      material: p.material || '',
      color: p.color || '',
      inStock: p.inStock,
      isFeatured: !!p.isFeatured
    });
    setImageUrlInput('');
    setUploadStatus('');
    setIsEditingProduct(true);
  };

  // 1-Click Duplicate Product Feature (ڈپلیکیٹ ہو سکے)
  const handleDuplicateProduct = async (p: Product) => {
    const duplicatedProduct: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      title: `${p.title} (Copy)`,
      createdAt: new Date().toISOString()
    };
    await saveProduct(duplicatedProduct);
    onRefreshProducts();
  };

  // Handle Image Upload via ImgBB
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadStatus('Uploading image to ImgBB...');
    try {
      const hostedUrl = await uploadImageToImgBB(file);
      if (!productForm.imageUrl) {
        // If no primary image set, make this the primary cover
        setProductForm(prev => ({ ...prev, imageUrl: hostedUrl }));
      } else {
        // Otherwise append to gallery
        setProductForm(prev => ({
          ...prev,
          additionalImages: [...prev.additionalImages, hostedUrl]
        }));
      }
      setUploadStatus('Image uploaded successfully!');
    } catch (err: any) {
      alert(`Image upload error: ${err.message || 'Check ImgBB connection'}`);
      setUploadStatus('');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const url = imageUrlInput.trim();
    if (!productForm.imageUrl) {
      setProductForm(prev => ({ ...prev, imageUrl: url }));
    } else {
      setProductForm(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, url]
      }));
    }
    setImageUrlInput('');
  };

  // Set First / Cover Image (فرسٹ امیج سلیکٹ کر سکیں)
  const handleSetCoverImage = (url: string) => {
    if (url === productForm.imageUrl) return;
    const remaining = [productForm.imageUrl, ...productForm.additionalImages].filter(img => img !== url && Boolean(img));
    setProductForm(prev => ({
      ...prev,
      imageUrl: url,
      additionalImages: remaining
    }));
  };

  // Remove an image from product
  const handleRemoveImage = (url: string) => {
    if (url === productForm.imageUrl) {
      // If removed the cover image, promote the next additional image
      if (productForm.additionalImages.length > 0) {
        const nextCover = productForm.additionalImages[0];
        setProductForm(prev => ({
          ...prev,
          imageUrl: nextCover,
          additionalImages: prev.additionalImages.slice(1)
        }));
      } else {
        setProductForm(prev => ({ ...prev, imageUrl: '' }));
      }
    } else {
      setProductForm(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter(img => img !== url)
      }));
    }
  };

  // Save product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.title || !productForm.price || !productForm.imageUrl) {
      alert('Please enter title, price, and at least one image.');
      return;
    }

    const item: Product = {
      id: editingId || `prod-${Date.now()}`,
      title: productForm.title,
      category: productForm.category,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      description: productForm.description,
      imageUrl: productForm.imageUrl,
      additionalImages: productForm.additionalImages,
      dimensions: productForm.dimensions,
      material: productForm.material,
      color: productForm.color,
      inStock: productForm.inStock,
      isFeatured: productForm.isFeatured,
      createdAt: editingId ? undefined : new Date().toISOString()
    };

    await saveProduct(item);
    onRefreshProducts();
    setIsEditingProduct(false);
  };

  // Delete product
  const handleDeleteProduct = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteProduct(id);
      onRefreshProducts();
    }
  };

  // Add/Edit Category Handler (Syncs directly to Firestore backend & local cache)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    let updated: Category[];
    let savedCat: Category;
    if (editingCategoryId) {
      const existing = categories.find(c => c.id === editingCategoryId);
      savedCat = {
        ...existing!,
        id: editingCategoryId,
        name: categoryForm.name.trim(),
        slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryForm.description.trim() || existing?.description || 'Custom furniture collection handcrafted for Riyadh.',
        imageUrl: categoryForm.imageUrl.trim() || existing?.imageUrl || ''
      };
      updated = categories.map(c => c.id === editingCategoryId ? savedCat : c);
    } else {
      savedCat = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name.trim(),
        slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryForm.description.trim() || 'Custom furniture collection handcrafted for Riyadh.',
        imageUrl: categoryForm.imageUrl.trim() || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
      };
      updated = [...categories, savedCat];
    }

    onUpdateCategories(updated);
    saveStoredCategories(updated);

    // Save directly to Firestore database so changes persist across all refreshes and devices
    try {
      await saveCategory(savedCat);
      await saveAllCategories(updated);
    } catch (err: any) {
      console.warn('Firestore category sync warning:', err);
    }

    setIsAddingCategory(false);
    setEditingCategoryId(null);
    setCategoryForm({ name: '', description: '', imageUrl: '' });
  };

  // Handle Category Image Upload via ImgBB
  const handleCatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCatImage(true);
    try {
      const url = await uploadImageToImgBB(file);
      setCategoryForm(prev => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      alert(`Category image upload error: ${err.message}`);
    } finally {
      setIsUploadingCatImage(false);
    }
  };

  const handleCopyRules = () => {
    navigator.clipboard.writeText(RECOMMENDED_FIRESTORE_RULES);
    setRulesCopied(true);
    setTimeout(() => setRulesCopied(false), 2500);
  };

  const orders = getLocalOrders();
  const allCurrentImages = [productForm.imageUrl, ...productForm.additionalImages].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden z-10 border border-stone-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#1A2332] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C59A3F]/20 text-[#C59A3F] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base sm:text-lg tracking-wide">
                Riyadh Furniture Hub – Store Management
              </h2>
              <span className="text-[11px] text-stone-300">
                {currentUser ? `Admin: ${currentUser.email || 'UID: 7bcuidPHSUSh5RKyqGO9cKlDibz1'}` : 'Authorized Firebase Login'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Not Logged In - Clean Email/Password Form Only */}
        {!currentUser ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C59A3F] mx-auto flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-stone-900">
              Admin Portal
            </h3>
            <p className="text-stone-500 text-xs mt-1 mb-6">
              Enter your Firebase email & password to manage products, categories, and view orders.
            </p>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bfbcgi@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 py-3 px-4 bg-[#1A2332] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                {isLoggingIn ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div>
            {/* Tabs */}
            <div className="flex items-center justify-between px-6 border-b border-stone-200 bg-stone-50 overflow-x-auto">
              <div className="flex items-center gap-2 min-w-max">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-3.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'products'
                      ? 'border-[#C59A3F] text-[#1A2332] bg-white font-bold'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Package className="w-4 h-4 text-[#C59A3F]" />
                  <span>Products ({products.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`py-3.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'categories'
                      ? 'border-[#C59A3F] text-[#1A2332] bg-white font-bold'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Layers className="w-4 h-4 text-[#C59A3F]" />
                  <span>Categories ({categories.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('rules')}
                  className={`py-3.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'rules'
                      ? 'border-[#C59A3F] text-[#1A2332] bg-white font-bold'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <FileCode className="w-4 h-4 text-[#C59A3F]" />
                  <span>Firestore Rules</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-3.5 px-3.5 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
                    activeTab === 'orders'
                      ? 'border-[#C59A3F] text-[#1A2332] bg-white font-bold'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#C59A3F]" />
                  <span>Orders ({orders.length})</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-rose-700 hover:bg-stone-200 transition-colors ml-4 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>

            {/* TAB 1: PRODUCTS */}
            {activeTab === 'products' && (
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Product Catalog ({products.length} items)
                    </h3>
                    <p className="text-xs text-stone-500">
                      Add new products with multiple images, set primary cover, edit, duplicate or delete.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddProduct}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A2332] hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-[#C59A3F]" />
                    <span>Add New Product</span>
                  </button>
                </div>

                {/* Table of Products */}
                <div className="border border-stone-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs min-w-[600px]">
                      <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-semibold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Item & Images</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Price (SAR)</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {products.map((p) => {
                          const totalImgCount = 1 + (p.additionalImages?.length || 0);
                          return (
                            <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                                    <img
                                      src={p.imageUrl}
                                      alt={p.title}
                                      className="w-full h-full object-cover"
                                    />
                                    {totalImgCount > 1 && (
                                      <span className="absolute bottom-0 right-0 bg-black/75 text-white text-[9px] px-1 font-bold">
                                        +{totalImgCount - 1}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-semibold text-stone-900 block truncate max-w-xs">
                                      {p.title}
                                    </span>
                                    <span className="text-[10px] text-stone-400">
                                      {totalImgCount} {totalImgCount === 1 ? 'image' : 'images'}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-stone-600 font-medium">
                                {p.category}
                              </td>

                              <td className="py-3 px-4 font-bold text-stone-900">
                                {formatPrice(p.price)}
                              </td>

                              <td className="py-3 px-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                  p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                                }`}>
                                  {p.inStock ? 'In Stock' : 'On Order'}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  {/* Duplicate button (ڈپلیکیٹ ہو سکے) */}
                                  <button
                                    onClick={() => handleDuplicateProduct(p)}
                                    className="p-1.5 text-stone-500 hover:text-[#C59A3F] hover:bg-stone-100 rounded-md transition-colors"
                                    title="Duplicate / Clone Product"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Edit button */}
                                  <button
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                                    title="Edit Product"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete button */}
                                  <button
                                    onClick={() => handleDeleteProduct(p.id, p.title)}
                                    className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded-md transition-colors"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CATEGORIES (کیٹیگریز بنانے، ایڈٹ اور ڈیلیٹ کرنے کا آپشن) */}
            {activeTab === 'categories' && (
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Category Management ({categories.length})
                    </h3>
                    <p className="text-xs text-stone-500">
                      Add, edit, or delete categories. They will update across the entire website navigation.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSyncAllCategoriesToFirestore}
                      disabled={isSyncingAllCategories}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                      title="Sync all categories to Firebase Firestore database"
                    >
                      <Layers className="w-4 h-4 text-emerald-200" />
                      <span>{isSyncingAllCategories ? 'Syncing to Cloud...' : 'Sync All to Cloud'}</span>
                    </button>

                    <button
                      onClick={handleOpenAddCategory}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#1A2332] hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <FolderPlus className="w-4 h-4 text-[#C59A3F]" />
                      <span>Create New Category</span>
                    </button>
                  </div>
                </div>

                {catSyncSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{catSyncSuccess}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-stone-200 bg-white flex items-center justify-between gap-3 shadow-xs hover:border-[#C59A3F]/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img 
                          src={c.imageUrl} 
                          alt={c.name} 
                          className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0" 
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-serif font-bold text-xs text-stone-900 truncate">{c.name}</h4>
                          <p className="text-[11px] text-stone-500 line-clamp-1">{c.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleOpenEditCategory(c)}
                          className="p-1.5 text-stone-500 hover:text-[#C59A3F] hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {c.id !== 'all' && (
                          <button
                            onClick={() => handleDeleteCategory(c.id, c.name)}
                            className="p-1.5 text-stone-500 hover:text-rose-600 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: RULES */}
            {activeTab === 'rules' && (
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      Firebase Firestore Security Rules
                    </h3>
                    <p className="text-xs text-stone-500">
                      Copy and paste into Firebase Console ➔ Firestore Database ➔ Rules.
                    </p>
                  </div>

                  <button
                    onClick={handleCopyRules}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A2332] hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    {rulesCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#C59A3F]" />}
                    <span>{rulesCopied ? 'Copied!' : 'Copy Rules'}</span>
                  </button>
                </div>

                <div className="bg-[#1A2332] rounded-2xl p-5 font-mono text-xs text-emerald-300 overflow-x-auto shadow-inner leading-relaxed">
                  <pre>{RECOMMENDED_FIRESTORE_RULES}</pre>
                </div>
              </div>
            )}

            {/* TAB 4: ORDERS */}
            {activeTab === 'orders' && (
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Customer Orders ({orders.length})
                </h3>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-stone-500 text-xs bg-stone-50 rounded-xl border border-stone-200">
                    No orders logged in this browser yet. Customer orders will appear here automatically.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 text-xs">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                          <span className="font-bold text-stone-900">Order #{order.id}</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold">
                            {order.paymentMethod} • {order.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-stone-600">
                          <div><strong className="text-stone-900">Customer:</strong> {order.customerName}</div>
                          <div><strong className="text-stone-900">Phone:</strong> {order.phone}</div>
                          <div className="col-span-2"><strong className="text-stone-900">Address:</strong> {order.address}, {order.city}</div>
                          {order.notes && <div className="col-span-2"><strong className="text-stone-900">Notes:</strong> {order.notes}</div>}
                        </div>
                        <div className="border-t border-stone-100 pt-2 flex items-center justify-between font-bold text-stone-900">
                          <span>Total Amount:</span>
                          <span>{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>

      {/* Add / Edit Product Modal with Multi-Images & Cover Selector */}
      {isEditingProduct && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh] border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-stone-900">
                  {editingId ? 'Edit Product' : 'Add New Furniture Product'}
                </h3>
                <p className="text-xs text-stone-500">
                  Select as many images as you want, and choose the first/cover image.
                </p>
              </div>
              <button
                onClick={() => setIsEditingProduct(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  placeholder="e.g. Al-Yasmin King Size Bed Frame"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                  >
                    {categories.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Price in SAR (ر.س) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 1850"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Original Price (SAR - for discount badge)
                  </label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    placeholder="e.g. 2200"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Dimensions (e.g. 180cm x 200cm)
                  </label>
                  <input
                    type="text"
                    value={productForm.dimensions}
                    onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                    placeholder="e.g. 180 cm (W) x 200 cm (L)"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                  />
                </div>
              </div>

              {/* Multi-Image Gallery & ImgBB Upload Section */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block font-bold text-stone-900 text-xs">
                      Product Images Gallery ({allCurrentImages.length} images)
                    </label>
                    <p className="text-[11px] text-stone-500">
                      Upload via ImgBB or add URLs. Click "Set as Cover" to select the first/main image!
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-lg cursor-pointer transition-colors shadow-xs font-semibold text-xs">
                    <Upload className="w-3.5 h-3.5 text-[#C59A3F]" />
                    <span>{isUploadingImage ? 'Uploading...' : 'Upload via ImgBB'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                  </label>
                </div>

                {uploadStatus && (
                  <div className="text-[11px] text-[#C59A3F] font-semibold">
                    {uploadStatus}
                  </div>
                )}

                {/* Add image URL input */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Or paste image URL (https://...)"
                    className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3.5 py-2 bg-stone-800 hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
                  >
                    Add Image
                  </button>
                </div>

                {/* Image thumbnails list with Cover selector */}
                {allCurrentImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {allCurrentImages.map((imgUrl, idx) => {
                      const isCover = imgUrl === productForm.imageUrl;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 bg-white shadow-xs group ${
                            isCover ? 'border-[#C59A3F] ring-2 ring-[#C59A3F]/30' : 'border-stone-200'
                          }`}
                        >
                          <div className="aspect-square w-full">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </div>

                          {/* Cover badge */}
                          {isCover && (
                            <span className="absolute top-1 left-1 bg-[#C59A3F] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-white" /> First / Cover
                            </span>
                          )}

                          {/* Hover action overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverImage(imgUrl)}
                                className="px-2 py-1 bg-[#C59A3F] hover:bg-[#A67D28] text-white text-[10px] font-bold rounded-md transition-colors"
                              >
                                Set as Cover
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(imgUrl)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold rounded-md transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-stone-200 rounded-xl text-stone-400 text-xs">
                    No images added yet. Upload an image above or paste a URL.
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detail the materials, comfort, and craftsmanship..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productForm.inStock}
                    onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C59A3F] focus:ring-[#C59A3F] border-stone-300"
                  />
                  <span className="font-semibold text-stone-800">In Stock in Riyadh</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#C59A3F] focus:ring-[#C59A3F] border-stone-300"
                  />
                  <span className="font-semibold text-stone-800">Show in Featured Products</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditingProduct(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A2332] hover:bg-black text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create New Category Modal (کیٹیگریز بنانے کا آپشن) */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-60 bg-black/75 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {editingCategoryId ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsAddingCategory(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Dining Chairs & Tables"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Brief description for the shop catalog..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Category Image
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg cursor-pointer text-xs font-semibold">
                    <Upload className="w-3.5 h-3.5 text-[#C59A3F]" />
                    <span>{isUploadingCatImage ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCatImageUpload}
                      className="hidden"
                      disabled={isUploadingCatImage}
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={categoryForm.imageUrl}
                  onChange={(e) => setCategoryForm({ ...categoryForm, imageUrl: e.target.value })}
                  placeholder="Or paste category image URL"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 focus:outline-hidden focus:border-[#C59A3F]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A2332] text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
