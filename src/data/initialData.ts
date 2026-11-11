import { Product } from '../types';

export const STARTER_PRODUCT: Product = {
  id: 'starter-single-bed-01',
  title: 'Al-Malaz Velvet Single Bed Frame',
  category: 'Single Bed',
  price: 1250,
  originalPrice: 1550,
  description: 'Handcrafted upholstered single bed frame designed for modern living in Riyadh. Engineered with solid kiln-dried beech and pine wood framing, upholstered in stain-resistant sand-beige linen-velvet fabric with an elegant channel-tufted headboard.',
  imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80',
  additionalImages: [
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80'
  ],
  dimensions: '120 cm (W) x 200 cm (L) x 115 cm (H)',
  material: 'Kiln-Dried Hardwood, High-Density Foam & Upholstery Fabric',
  color: 'Sand Beige',
  inStock: true,
  isFeatured: true,
  createdAt: '2026-11-10T00:00:00Z'
};

export const INITIAL_PRODUCTS: Product[] = [STARTER_PRODUCT];
