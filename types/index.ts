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
  model?: string;
  sku?: string;
  description: string;
  // 상품 개요 관련 필드 추가
  overviewDescription?: string; // 구조적인 개요 설명
  overviewImages?: string[];     // 개요 전용 이미지들
  originalPrice: number;
  salePrice: number;
  discount: number;
  condition: ProductCondition;
  availability?: 'in_stock' | 'out_of_stock' | 'discontinued';
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
  sourceLocation?: string;
  sourceDate?: string;
  sourceUsage?: string;
  tags: string[];
  // 연계 상품 추천 기능
  relatedProducts?: string[]; // 연계 상품 ID 배열
  // 상세 설명
  detailedDescription?: {
    overview: string;
    targetUsers: string[];
    suitableSpaces: string[];
    designStory: string;
  };
  // 상태 리포트
  conditionReport?: {
    overall: string;
    details: Array<{
      item: string;
      condition: string;
      note: string;
    }>;
    minorFlaws: string[];
    strengths: string[];
  };
  // 사용 가이드
  usageGuide?: {
    setup: string[];
    maintenance: string[];
    tips: string[];
  };
  // 제품 사양
  specifications?: {
    weight?: string;
    maxWeight?: string;
    origin?: string;
    year?: string;
  };
  // 배송 정보
  shipping?: {
    free: boolean;
    period: string;
    installation: boolean;
    installationFee: number;
  };
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  rating?: number;
}

export type ProductCategory = 
  | 'new'
  | 'furniture'
  | 'lighting'
  | 'kitchen'
  | 'accessories'
  | 'textile'
  | 'kids'
  | 'book'
  | 'sale';

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