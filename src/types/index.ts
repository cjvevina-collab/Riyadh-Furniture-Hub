export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  dimensions?: string;
  material?: string;
  color?: string;
  inStock: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderDetails {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'WhatsApp Inquiry';
  createdAt: string;
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}
