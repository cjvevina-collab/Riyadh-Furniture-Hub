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
import { Product, OrderDetails } from './types';
import { INITIAL_PRODUCTS } from './data/initialData';

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
