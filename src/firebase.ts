import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { Product, OrderDetails, Category } from './types';
import { INITIAL_PRODUCTS } from './data/initialData';
import { DEFAULT_PRODUCT_CATEGORIES, getStoredCategories, saveStoredCategories } from './data/categories';

// User provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyAjmV_02R9CZPlK4_lmXHnttYHt39qkKmw",
  authDomain: "riyadhfurniturehub-b3a08.firebaseapp.com",
  projectId: "riyadhfurniturehub-b3a08",
  storageBucket: "riyadhfurniturehub-b3a08.firebasestorage.app",
  messagingSenderId: "664659503087",
  appId: "1:664659503087:web:dcadc185cab5a76181781a",
  measurementId: "G-Q410WGEH7W"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// ImgBB API Key provided by user
export const IMGBB_API_KEY = "f20f56a14ab8d529a98745b32c5ef961";

// Suggested Firestore Security Rules snippet for the user
export const RECOMMENDED_FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Products: Anyone can read, only authenticated admin can create, update, or delete
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Categories: Anyone can read, only authenticated admin can create, update, or delete
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Customer Orders: Anyone can submit an order, only authenticated admin can view or modify
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Contact messages: Anyone can submit a message
    match /messages/{messageId} {
      allow create: if true;
      allow read, delete: if request.auth != null;
    }
  }
}`;

const LOCAL_STORAGE_KEY = 'rfh_products_cache_v1';
const LOCAL_ORDERS_KEY = 'rfh_orders_cache_v1';

// Get local cached products
function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Ignore storage errors
  }
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to cache products locally', e);
  }
}

// Fetch all products with graceful Firestore sync and local fallback
export async function fetchProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const remoteProducts: Product[] = [];
      snapshot.forEach(docSnap => {
        remoteProducts.push({ id: docSnap.id, ...(docSnap.data() as Omit<Product, 'id'>) });
      });
      saveLocalProducts(remoteProducts);
      return remoteProducts;
    }
    // If remote collection is completely empty, attempt to seed the starter product
    const local = getLocalProducts();
    return local;
  } catch (error) {
    console.warn('Firestore fetch failed or permission not set yet, using local data:', error);
    return getLocalProducts();
  }
}

// Save or Update a Product
export async function saveProduct(product: Product): Promise<void> {
  // Update local state first for instant UI response
  const current = getLocalProducts();
  const index = current.findIndex(p => p.id === product.id);
  let updatedList: Product[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = product;
  } else {
    updatedList = [product, ...current];
  }
  saveLocalProducts(updatedList);

  // Sync to Firestore
  try {
    const docRef = doc(db, 'products', product.id);
    await setDoc(docRef, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore write warning (saved locally):', error);
  }
}

// Delete a Product
export async function deleteProduct(productId: string): Promise<void> {
  const current = getLocalProducts();
  const filtered = current.filter(p => p.id !== productId);
  saveLocalProducts(filtered);

  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete warning (removed locally):', error);
  }
}

// ==========================================
// CATEGORIES FIRESTORE BACKEND SYNC
// ==========================================

// Fetch all categories with Firestore sync and local fallback
export async function fetchCategories(): Promise<Category[]> {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);

    if (!snapshot.empty) {
      const remoteCategories: Category[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as Category;
        remoteCategories.push({
          id: docSnap.id,
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          itemCount: data.itemCount,
          order: (data as any).order ?? 999
        } as any);
      });

      // Sort by order
      remoteCategories.sort((a: any, b: any) => (a.order ?? 999) - (b.order ?? 999));
      saveStoredCategories(remoteCategories);
      return remoteCategories;
    }

    // If Firestore collection is empty, return local data and seed in background
    const local = getStoredCategories();
    saveAllCategories(local).catch(e => console.warn('Categories auto-seed skipped:', e));
    return local;
  } catch (error) {
    console.warn('Firestore fetchCategories warning (using local):', error);
    return getStoredCategories();
  }
}

// Save or Update a single Category in Firestore & local cache
export async function saveCategory(category: Category): Promise<void> {
  const current = getStoredCategories();
  const index = current.findIndex(c => c.id === category.id);
  let updatedList: Category[];
  if (index >= 0) {
    updatedList = [...current];
    updatedList[index] = category;
  } else {
    updatedList = [...current, category];
  }
  saveStoredCategories(updatedList);

  try {
    const docRef = doc(db, 'categories', category.id);
    await setDoc(docRef, {
      ...category,
      order: index >= 0 ? index : updatedList.length - 1,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Firestore saveCategory write warning (saved locally):', error);
  }
}

// Save all categories to Firestore and local cache
export async function saveAllCategories(categories: Category[]): Promise<void> {
  saveStoredCategories(categories);

  try {
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const docRef = doc(db, 'categories', cat.id);
      await setDoc(docRef, {
        ...cat,
        order: i,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }
  } catch (error) {
    console.warn('Firestore saveAllCategories write warning (saved locally):', error);
  }
}

// Delete Category from Firestore and local cache
export async function deleteCategory(categoryId: string): Promise<void> {
  const current = getStoredCategories();
  const filtered = current.filter(c => c.id !== categoryId);
  saveStoredCategories(filtered);

  try {
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore deleteCategory warning (removed locally):', error);
  }
}

// ImgBB Image Upload
export async function uploadImageToImgBB(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (data && data.success && data.data && data.data.url) {
    return data.data.url;
  }
  throw new Error(data?.error?.message || 'Failed to upload image to ImgBB');
}

// Create an Order (COD or recorded)
export async function submitOrder(order: OrderDetails): Promise<void> {
  try {
    // save locally
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    const orders: OrderDetails[] = raw ? JSON.parse(raw) : [];
    orders.unshift(order);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));

    // Try firestore
    if (order.id) {
      const orderRef = doc(db, 'orders', order.id);
      await setDoc(orderRef, order);
    }
  } catch (err) {
    console.warn('Order submission local cache saved:', err);
  }
}

export function getLocalOrders(): OrderDetails[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Authentication helpers
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function listenToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
