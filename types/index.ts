// User Types
export type UserRole = 'customer' | 'dealer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends User {
  role: 'customer';
  savedProducts?: string[];
  purchaseHistory?: string[];
}

export interface Dealer extends User {
  role: 'dealer';
  commission: number;
  totalSales: number;
  totalEarnings: number;
  rating: number;
  activeChats: string[];
  completedDeals: number;
  specialties?: string[];
  bio?: string;
  profileImage?: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Product Types
export interface Product {
  id: string;
  name: string;
  brand: string;
  designer?: string;
  category: ProductCategory;
  subcategory?: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  condition: ProductCondition;
  images: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'inch';
  };
  materials?: string[];
  colors?: string[];
  stock: number;
  featured: boolean;
  source: ProductSource;
  sourceDetails?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
}

export type ProductCategory = 
  | 'seating'
  | 'tables'
  | 'storage'
  | 'lighting'
  | 'decor'
  | 'rugs'
  | 'outdoor';

export type ProductCondition = 
  | 'new'
  | 'like-new'
  | 'excellent'
  | 'good'
  | 'fair';

export type ProductSource = 
  | 'model-house'
  | 'exhibition'
  | 'display'
  | 'photoshoot'
  | 'other';

// Chat Types
export interface ChatSession {
  id: string;
  customerId: string;
  dealerId?: string;
  productId: string;
  status: ChatStatus;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

export type ChatStatus = 
  | 'waiting'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface Message {
  id: string;
  senderId: string;
  senderType: 'customer' | 'dealer' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: string[];
}

// Order Types
export interface Order {
  id: string;
  customerId: string;
  dealerId?: string;
  products: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  discount: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentStatus = 
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

// Analytics Types
export interface DealerAnalytics {
  dealerId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  totalSales: number;
  totalRevenue: number;
  totalCommission: number;
  averageOrderValue: number;
  conversionRate: number;
  activeChats: number;
  completedChats: number;
  customerSatisfaction: number;
} 