// 상품 수정 페이지 전용 타입 정의
import { ProductOption } from '@/types';

export interface ProductForm {
  // 기본 정보
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  model: string;
  sku: string;
  originalPrice: number;
  salePrice: number;
  condition: string;
  
  // 재고 및 상태
  stockCount: number;
  availability: string;
  
  // 옵션 설정
  hasOptions: boolean;
  options: ProductOption[];
  
  // 설명
  description: string;
  // 상품 개요 관련 필드 추가
  overviewDescription: string;
  overviewImages: Array<{
    id: string;
    url: string;
    file?: File;
    alt?: string;
    caption?: string;
  }>;
  detailedDescription: {
    overview: string;
    targetUsers: string[];
    suitableSpaces: string[];
    designStory: string;
  };
  
  // 상태 리포트
  conditionReport: {
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
  usageGuide: {
    setup: string[];
    maintenance: string[];
    tips: string[];
  };
  
  // 제품 사양
  specifications: {
    dimensions: string;
    weight: string;
    maxWeight: string;
    material: string;
    color: string;
    origin: string;
    year: string;
  };
  
  // 이미지 및 기타
  images: Array<{
    id: string;
    url: string;
    file?: File;
    isPrimary: boolean;
    alt?: string;
    caption?: string;
  }>;
  tags: string[];
  featured: boolean;
  rawDescriptionText: string;
  
  // 연계 상품 추천 기능
  relatedProducts: string[];
  
  // 소스 정보
  source: {
    type: string;
    name: string;
    location: string;
    date: string;
    usage: string;
  };
  
  // 배송 정보
  shipping: {
    free: boolean;
    period: string;
    installation: boolean;
    installationFee: number;
  };
}

export const initialForm: ProductForm = {
  name: '',
  brand: '',
  category: 'furniture',
  subcategory: '',
  model: '',
  sku: '',
  originalPrice: 0,
  salePrice: 0,
  condition: 'excellent',
  stockCount: 1,
  availability: 'in_stock',
  hasOptions: false,
  options: [],
  description: '',
  // 상품 개요 초기값 추가
  overviewDescription: '',
  overviewImages: [],
  detailedDescription: {
    overview: '',
    targetUsers: [],
    suitableSpaces: [],
    designStory: ''
  },
  conditionReport: {
    overall: 'A급',
    details: [],
    minorFlaws: [],
    strengths: []
  },
  usageGuide: {
    setup: [],
    maintenance: [],
    tips: []
  },
  specifications: {
    dimensions: '',
    weight: '',
    maxWeight: '',
    material: '',
    color: '',
    origin: '',
    year: ''
  },
  images: [],
  tags: [],
  featured: false,
  rawDescriptionText: '',
  relatedProducts: [],
  source: {
    type: 'model-house',
    name: '',
    location: '',
    date: '',
    usage: ''
  },
  shipping: {
    free: true,
    period: '3-5일',
    installation: false,
    installationFee: 0
  }
};

export const conditions = [
  { value: 'new', label: '신품' },
  { value: 'like-new', label: 'A급 (최상)' },
  { value: 'excellent', label: 'B급 (상)' },
  { value: 'good', label: 'C급 (중)' },
  { value: 'fair', label: 'D급 (하)' }
];

export const sourceTypes = [
  { value: 'model-house', label: '모델하우스' },
  { value: 'exhibition', label: '전시회' },
  { value: 'display', label: '매장 디스플레이' },
  { value: 'photoshoot', label: '촬영용' },
  { value: 'other', label: '기타' }
];

export const tabs = [
  { id: 'basic', label: '기본 정보' },
  { id: 'description', label: '상품 설명' },
  { id: 'condition', label: '상태 정보' },
  { id: 'guide', label: '사용 가이드' },
  { id: 'specifications', label: '제품 사양' },
  { id: 'images', label: '이미지' },
  { id: 'related', label: '연계 상품' },
  { id: 'source', label: '소스 정보' }
];