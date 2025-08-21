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
  // 사용자 관리용 추가 필드들
  points?: number; // 적립금
  group?: string; // 사용자 그룹
  memo?: string; // 관리자 메모
  stats?: {
    posts: number; // 게시글 수
    comments: number; // 댓글 수
    reviews: number; // 구매평 수
    inquiries: number; // 문의 수
  };
  totalPurchases?: number; // 총 구매 횟수
  totalSpent?: number; // 누적 구매 금액
  lastLoginAt?: Date; // 마지막 로그인 일시
  isActive?: boolean; // 활성 상태
}

export interface Customer extends User {
  role: 'customer';
  savedProducts?: string[]; // 찜 목록 (상품 ID 배열)
  purchaseHistory?: string[]; // 구매 내역 (주문 ID 배열)
  shippingAddresses?: Address[]; // 배송지 목록
  defaultAddressId?: string; // 기본 배송지 ID
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

// Product Option Types
export interface ProductOption {
  id: string;
  name: string; // 옵션명 (예: "색상", "사이즈", "재질")
  type: 'color' | 'size' | 'material' | 'style' | 'custom'; // 옵션 타입
  values: ProductOptionValue[]; // 옵션 값들
  required: boolean; // 필수 선택 여부
  displayOrder: number; // 표시 순서
}

export interface ProductOptionValue {
  id: string;
  value: string; // 옵션 값 (예: "블루", "L", "가죽")
  displayName?: string; // 표시명 (값과 다르게 표시하고 싶을 때)
  priceModifier?: number; // 가격 변동 (예: +10000, -5000)
  stockQuantity?: number; // 해당 옵션의 재고 수량
  isAvailable: boolean; // 현재 선택 가능 여부
  colorCode?: string; // 색상 옵션인 경우 색상 코드
  imageUrl?: string; // 옵션별 이미지 URL
}

// 선택된 옵션 조합
export interface SelectedOptions {
  [optionId: string]: string; // optionId: selectedValueId
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
  // 상품 옵션 필드 추가
  hasOptions?: boolean; // 옵션이 있는 상품인지 여부
  options?: ProductOption[]; // 상품 옵션들
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
    dimensions?: string;
    weight?: string;
    maxWeight?: string;
    material?: string;
    color?: string;
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

// 찜 목록 관련 타입
export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
  product?: Product; // populated product data
}

// 토스 페이먼츠 관련 타입
export interface TossPaymentConfig {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail: string;
  customerName: string;
  customerMobilePhone?: string;
}

export interface TossPaymentResponse {
  paymentKey: string;
  orderId: string;
  amount: number;
  status: 'READY' | 'IN_PROGRESS' | 'WAITING_FOR_DEPOSIT' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
  requestedAt: string;
  approvedAt?: string;
  method: 'CARD' | 'VIRTUAL_ACCOUNT' | 'SIMPLE_PAY' | 'PHONE' | 'CULTURE_GIFT_CERTIFICATE' | 'BOOK_CULTURE_GIFT_CERTIFICATE' | 'GAME_CULTURE_GIFT_CERTIFICATE';
  totalAmount: number;
  balanceAmount: number;
  suppliedAmount: number;
  vat: number;
  taxFreeAmount: number;
  taxExemptionAmount: number;
  receipt?: {
    url: string;
  };
  checkout?: {
    url: string;
  };
  card?: {
    issuerCode: string;
    acquirerCode: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
    approveNo: string;
    useCardPoint: boolean;
    cardType: 'CREDIT' | 'DEBIT' | 'GIFT';
    ownerType: 'PERSONAL' | 'CORPORATE';
    acquireStatus: 'READY' | 'REQUESTED' | 'COMPLETED' | 'CANCEL_REQUESTED' | 'CANCELED';
    amount: number;
  };
}

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

// Order Types 확장
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  dealerId?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  finalAmount: number;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentKey?: string; // 토스 페이먼츠 결제 키
  shippingAddress?: Address;
  billingAddress?: Address;
  shippingInfo?: ShippingInfo;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  canceledAt?: string;
  cancelReason?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  originalPrice: number;
  discount: number;
  product?: Product; // populated product data
  selectedOptions?: {
    [optionId: string]: {
      optionName: string;
      valueId: string;
      valueName: string;
      colorCode?: string;
      priceModifier?: number;
    };
  };
}

export type OrderStatus = 
  | 'pending'           // 주문 대기
  | 'confirmed'         // 주문 확인
  | 'payment_completed' // 결제 완료
  | 'preparing'         // 상품 준비중
  | 'shipped'           // 배송 중
  | 'delivered'         // 배송 완료
  | 'cancelled'         // 주문 취소
  | 'returned'          // 반품
  | 'refunded';         // 환불 완료

export type PaymentStatus = 
  | 'pending'    // 결제 대기
  | 'completed'  // 결제 완료
  | 'failed'     // 결제 실패
  | 'cancelled'  // 결제 취소
  | 'refunded';  // 환불 완료

export type PaymentMethod = 
  | 'toss_card'          // 토스 카드 결제
  | 'toss_account'       // 토스 계좌 결제
  | 'toss_simple'        // 토스 간편결제
  | 'bank_transfer'      // 무통장 입금
  | 'virtual_account';   // 가상계좌

// 배송 정보 타입
export interface ShippingInfo {
  id?: string;
  orderId?: string;
  customerId?: string;
  trackingNumber?: string;
  carrier?: string; // 택배사
  carrierUrl?: string; // 택배사 추적 URL
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  shippingCost?: number;
  installationRequired?: boolean;
  installationCost?: number;
  installationDate?: Date;
  status: ShippingStatus;
  shippingAddress?: {
    recipientName: string;
    recipientPhone: string;
    zipCode: string;
    address: string;
    detailAddress: string;
  };
  trackingHistory?: TrackingEvent[];
  createdAt?: string;
  updatedAt?: string;
}

export type ShippingStatus =
  | 'preparing'    // 배송 준비중
  | 'in_transit'   // 배송 중
  | 'out_for_delivery' // 배송 중 (마지막 단계)
  | 'delivered'    // 배송 완료
  | 'failed'       // 배송 실패
  | 'returned';    // 반송

export interface TrackingEvent {
  timestamp: string;
  status: string;
  location?: string;
  description: string;
}



export interface Address {
  id?: string;
  customerId: string;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
  label: string; // '집', '회사', '기타' 등
  createdAt: string;
  updatedAt: string;
}

// 결제 내역 조회용 타입
export interface PaymentHistory {
  id: string;
  orderId: string;
  paymentKey: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt: Date;
  refundedAt?: Date;
  refundAmount?: number;
  order?: Order; // populated order data
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

// 반품 관련 타입
export interface ReturnRequest {
  id?: string;
  orderId: string;
  customerId: string;
  items: ReturnItem[];
  reason: ReturnReason;
  description: string;
  returnMethod: ReturnMethod;
  status: ReturnStatus;
  requestedAt: string;
  processedAt?: string;
  completedAt?: string;
  refundAmount?: number;
  notes?: string;
  images?: string[]; // 반품 사유 증빙 이미지
}

export interface ReturnItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  reason: string;
}

export type ReturnReason = 
  | 'defective'           // 상품 불량
  | 'different_from_description' // 설명과 다름
  | 'size_mismatch'       // 사이즈 불일치
  | 'color_mismatch'      // 색상 불일치
  | 'damaged_delivery'    // 배송 중 파손
  | 'changed_mind'        // 단순 변심
  | 'quality_issue'       // 품질 문제
  | 'other';             // 기타

export type ReturnMethod = 
  | 'pickup'             // 택배 수거
  | 'direct_delivery'    // 직접 반납
  | 'store_visit';       // 매장 방문

export type ReturnStatus = 
  | 'requested'          // 반품 신청
  | 'approved'           // 반품 승인
  | 'rejected'           // 반품 거부
  | 'in_progress'        // 반품 진행중
  | 'completed'          // 반품 완료
  | 'refunded';          // 환불 완료

// 마이페이지 대시보드용 요약 타입
export interface CustomerDashboard {
  totalOrders: number;
  pendingOrders: number;
  totalSpent: number;
  wishlistCount: number;
  recentOrders: Order[];
  trackingInfo: ShippingInfo[];
} 