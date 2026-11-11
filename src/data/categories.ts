import { Category } from '../types';

export const DEFAULT_PRODUCT_CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Products',
    slug: 'all-products',
    description: 'Explore the full spectrum of premium furniture handcrafted for homes and offices across Riyadh.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'single-bed',
    name: 'Single Bed',
    slug: 'single-bed',
    description: 'Space-saving comfort with solid wooden and upholstered frames tailored for modern guest and children rooms.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'twin-bed',
    name: 'Twin Bed',
    slug: 'twin-bed',
    description: 'Durable and cozy twin beds designed for versatile bedrooms, guest accommodations, and compact suites.',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'double-queen-bed',
    name: 'Double Queen Bed',
    slug: 'double-queen-bed',
    description: 'Generous queen dimensions offering harmonious balance between luxury, room flow, and restful nights.',
    imageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'king-size-bed',
    name: 'King Size Bed',
    slug: 'king-size-bed',
    description: 'Master suite centerpiece beds featuring royal headboards, plush velvet upholstery, and ergonomic support.',
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'metal-bed-single',
    name: 'Metal Bed Single Size',
    slug: 'metal-bed-single-size',
    description: 'Industrial and modern powder-coated wrought metal single beds built for lifetime endurance and sleek styling.',
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'metal-bunk-bed',
    name: 'Metal Bunk Bed',
    slug: 'metal-bunk-bed',
    description: 'Ultra-sturdy dual-tier bunk beds with integrated safety railings, ideal for shared family rooms and camps.',
    imageUrl: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'single-bedroom-set',
    name: 'Single Bedroom Set',
    slug: 'single-bedroom-set',
    description: 'Complete coordinated sets including single bed, nightstand, wardrobe, and study desk with matching finishes.',
    imageUrl: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'twin-size-bedroom-set',
    name: 'Twin Size Bedroom Set',
    slug: 'twin-size-bedroom-set',
    description: 'Harmonious twin bedroom suites configured with matching bedside cabinets, vanity dressers, and storage.',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'luxury-bedroom-set',
    name: 'Luxury Bedroom Set',
    slug: 'luxury-bedroom-set',
    description: 'High-end artisan crafted full master bedroom ensembles with gold trims, premium headboards, and soft-close storage.',
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spring-mattress',
    name: 'Spring Mattress',
    slug: 'spring-mattress',
    description: 'Pocket spring and continuous coil mattresses offering motion isolation, edge support, and breathable airflow.',
    imageUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'medicated-mattress',
    name: 'Medicated Mattress',
    slug: 'medicated-mattress',
    description: 'Orthopedic high-density foam mattresses engineered for spine alignment, pressure point relief, and posture correction.',
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80'
  }
];

export const PRODUCT_CATEGORIES = DEFAULT_PRODUCT_CATEGORIES;

const CATEGORIES_STORAGE_KEY = 'rfh_categories_list_v1';

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PRODUCT_CATEGORIES;
}

export function saveStoredCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error(e);
  }
}
