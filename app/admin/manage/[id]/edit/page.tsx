'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Eye, Upload, X, Plus, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SectionParser from '@/components/admin/SectionParser';
import ImageUploader from '@/components/admin/ImageUploader';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ProductForm {
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
  
  // 설명
  description: string;
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
    warranty: string;
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

const initialForm: ProductForm = {
  name: '',
  brand: '',
  category: 'seating',
  subcategory: '',
  model: '',
  sku: '',
  originalPrice: 0,
  salePrice: 0,
  condition: 'excellent',
  stockCount: 1,
  availability: 'in_stock',
  description: '',
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
    warranty: '',
    origin: '',
    year: ''
  },
  images: [],
  tags: [],
  featured: false,
  rawDescriptionText: '',
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

const categories = [
  { value: 'seating', label: '의자/소파' },
  { value: 'tables', label: '테이블' },
  { value: 'storage', label: '수납가구' },
  { value: 'lighting', label: '조명' },
  { value: 'decor', label: '장식품' },
  { value: 'rugs', label: '러그' },
  { value: 'outdoor', label: '야외가구' }
];

const conditions = [
  { value: 'new', label: '신품' },
  { value: 'like-new', label: 'A급 (최상)' },
  { value: 'excellent', label: 'B급 (상)' },
  { value: 'good', label: 'C급 (중)' },
  { value: 'fair', label: 'D급 (하)' }
];

const sourceTypes = [
  { value: 'model-house', label: '모델하우스' },
  { value: 'exhibition', label: '전시회' },
  { value: 'display', label: '매장 디스플레이' },
  { value: 'photoshoot', label: '촬영용' },
  { value: 'other', label: '기타' }
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newTag, setNewTag] = useState('');

  const tabs = [
    { id: 'basic', label: '기본 정보' },
    { id: 'description', label: '상품 설명' },
    { id: 'condition', label: '상태 정보' },
    { id: 'guide', label: '사용 가이드' },
    { id: 'specifications', label: '제품 사양' },
    { id: 'images', label: '이미지' },
    { id: 'source', label: '소스 정보' }
  ];

  // 상품 정보 로드
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const productDoc = await getDoc(doc(db, 'products', productId));
        
        if (productDoc.exists()) {
          const productData = productDoc.data();
          
          // Firebase 데이터를 폼 형식으로 변환
          const convertedForm: ProductForm = {
            name: productData.name || '',
            brand: productData.brand || '',
            category: productData.category || 'seating',
            subcategory: productData.subcategory || '',
            model: productData.model || '',
            sku: productData.sku || '',
            originalPrice: productData.originalPrice || 0,
            salePrice: productData.salePrice || 0,
            condition: productData.condition || 'excellent',
            stockCount: productData.stock || 1,
            availability: productData.availability || 'in_stock',
            description: productData.description || '',
            detailedDescription: {
              overview: productData.detailedDescription?.overview || '',
              targetUsers: productData.detailedDescription?.targetUsers || [],
              suitableSpaces: productData.detailedDescription?.suitableSpaces || [],
              designStory: productData.detailedDescription?.designStory || ''
            },
            conditionReport: {
              overall: productData.conditionReport?.overall || 'A급',
              details: productData.conditionReport?.details || [],
              minorFlaws: productData.conditionReport?.minorFlaws || [],
              strengths: productData.conditionReport?.strengths || []
            },
            usageGuide: {
              setup: productData.usageGuide?.setup || [],
              maintenance: productData.usageGuide?.maintenance || [],
              tips: productData.usageGuide?.tips || []
            },
            specifications: {
              dimensions: productData.dimensions ? 
                `${productData.dimensions.width}x${productData.dimensions.height}x${productData.dimensions.depth}` : '',
              weight: productData.specifications?.weight || '',
              maxWeight: productData.specifications?.maxWeight || '',
              material: productData.materials?.[0] || '',
              color: productData.colors?.[0] || '',
              warranty: productData.specifications?.warranty || '',
              origin: productData.specifications?.origin || '',
              year: productData.specifications?.year || ''
            },
            images: productData.images?.map((url: string, index: number) => ({
              id: `existing-${index}`,
              url,
              isPrimary: index === 0,
              alt: `${productData.name} 이미지 ${index + 1}`,
              caption: ''
            })) || [],
            tags: productData.tags || [],
            featured: productData.featured || false,
            rawDescriptionText: productData.description || '',
            source: {
              type: productData.source || 'model-house',
              name: productData.sourceDetails || '',
              location: productData.sourceLocation || '',
              date: productData.sourceDate || '',
              usage: productData.sourceUsage || ''
            },
            shipping: {
              free: productData.shipping?.free !== false,
              period: productData.shipping?.period || '3-5일',
              installation: productData.shipping?.installation || false,
              installationFee: productData.shipping?.installationFee || 0
            }
          };
          
          setForm(convertedForm);
        } else {
          alert('상품을 찾을 수 없습니다.');
          router.push('/admin/manage');
        }
      } catch (error) {
        console.error('상품 로드 실패:', error);
        alert('상품 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId, router]);

  const handleInputChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ProductForm] as object,
        [field]: value
      }
    }));
  };

  const handleArrayAdd = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof ProductForm] as string[]), value]
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setForm(prev => ({
      ...prev,
      [field]: (prev[field as keyof ProductForm] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      handleArrayAdd('tags', newTag.trim());
      setNewTag('');
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    // 필수 필드 검증
    if (!form.name.trim()) errors.push('상품명');
    if (!form.brand.trim()) errors.push('브랜드');
    if (!form.description.trim()) errors.push('상품 설명');
    if (form.originalPrice <= 0) errors.push('정가 (0원보다 커야 함)');
    if (form.salePrice <= 0) errors.push('할인가 (0원보다 커야 함)');
    if (form.stockCount < 0) errors.push('재고 수량 (0개 이상이어야 함)');
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 검증
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert(`다음 정보를 입력해주세요:\n\n• ${validationErrors.join('\n• ')}`);
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Firebase에 상품 데이터 업데이트
      const productData = {
        name: form.name,
        brand: form.brand,
        category: form.category as any,
        subcategory: form.subcategory || '',
        description: form.description,
        originalPrice: form.originalPrice,
        salePrice: form.salePrice,
        discount: Math.round(((form.originalPrice - form.salePrice) / form.originalPrice) * 100),
        condition: form.condition as any,
        images: form.images.length > 0 ? form.images.map(img => typeof img === 'string' ? img : img.url) : ['/placeholder-product.jpg'],
        dimensions: form.specifications.dimensions ? {
          width: parseInt(form.specifications.dimensions.split('x')[0]) || 0,
          height: parseInt(form.specifications.dimensions.split('x')[1]) || 0,
          depth: parseInt(form.specifications.dimensions.split('x')[2]) || 0,
          unit: 'cm' as const
        } : {
          width: 0,
          height: 0,
          depth: 0,
          unit: 'cm' as const
        },
        materials: form.specifications.material ? [form.specifications.material] : [],
        colors: form.specifications.color ? [form.specifications.color] : [],
        stock: form.stockCount,
        featured: form.featured,
        source: form.source.type as any,
        sourceDetails: form.source.name || '',
        tags: form.tags,
        updatedAt: new Date(),
        // 기존 데이터 유지
        views: 0,
        likes: 0
      };
      
      console.log('상품 데이터 업데이트 중:', productData);
      
      await updateDoc(doc(db, 'products', productId), productData);
      console.log('상품 업데이트 성공, ID:', productId);
      
      alert('상품이 성공적으로 수정되었습니다!');
      router.push('/admin/manage');
    } catch (error) {
      console.error('상품 수정 실패:', error);
      alert('상품 수정에 실패했습니다: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">상품명 *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: Herman Miller Aeron 의자"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">브랜드 *</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => handleInputChange('brand', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: Herman Miller"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">카테고리 *</label>
          <select
            value={form.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">서브카테고리</label>
          <input
            type="text"
            value={form.subcategory}
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: 오피스 의자"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">정가 *</label>
          <input
            type="number"
            value={form.originalPrice}
            onChange={(e) => handleInputChange('originalPrice', Number(e.target.value))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="1890000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">할인가 *</label>
          <input
            type="number"
            value={form.salePrice}
            onChange={(e) => handleInputChange('salePrice', Number(e.target.value))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="567000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">상태 *</label>
          <select
            value={form.condition}
            onChange={(e) => handleInputChange('condition', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            {conditions.map(condition => (
              <option key={condition.value} value={condition.value}>{condition.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">재고 수량 *</label>
          <input
            type="number"
            value={form.stockCount}
            onChange={(e) => handleInputChange('stockCount', Number(e.target.value))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">판매 여부</label>
          <select
            value={form.availability}
            onChange={(e) => handleInputChange('availability', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="in_stock">판매중</option>
            <option value="out_of_stock">품절</option>
            <option value="discontinued">단종</option>
          </select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => handleInputChange('featured', e.target.checked)}
          className="w-4 h-4 text-primary rounded focus:ring-primary"
        />
        <label htmlFor="featured" className="text-sm font-medium">
          추천 상품으로 설정
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">태그</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleArrayRemove('tags', index)}
                className="text-primary hover:text-primary/70"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
            className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
            placeholder="태그를 입력하세요"
          />
          <button
            type="button"
            onClick={handleTagAdd}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );

  const renderDescriptionSection = () => (
    <SectionParser
      rawText={form.rawDescriptionText}
      onTextChange={(text) => {
        handleInputChange('rawDescriptionText', text);
        // 검증을 위해 description 필드도 동시에 업데이트
        handleInputChange('description', text);
      }}
      onParsed={(sections) => {
        // 파싱된 섹션을 폼에 적용
        sections.forEach(section => {
          if (section.type === 'overview') {
            handleNestedInputChange('detailedDescription', 'overview', section.content);
          } else if (section.type === 'targetUsers') {
            handleNestedInputChange('detailedDescription', 'targetUsers', section.content);
          } else if (section.type === 'suitableSpaces') {
            handleNestedInputChange('detailedDescription', 'suitableSpaces', section.content);
          } else if (section.type === 'designStory') {
            handleNestedInputChange('detailedDescription', 'designStory', section.content);
          }
        });
      }}
    />
  );

  const renderImagesSection = () => (
    <ImageUploader
      images={form.images}
      onImagesChange={(images) => handleInputChange('images', images)}
      maxImages={10}
      maxFileSize={5}
    />
  );

  const renderConditionSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">전체 상태</label>
        <select
          value={form.conditionReport.overall}
          onChange={(e) => handleNestedInputChange('conditionReport', 'overall', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="A급">A급 (최상)</option>
          <option value="B급">B급 (상)</option>
          <option value="C급">C급 (중)</option>
          <option value="D급">D급 (하)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">장점</label>
        <div className="space-y-2">
          {form.conditionReport.strengths.map((strength, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={strength}
                onChange={(e) => {
                  const newStrengths = [...form.conditionReport.strengths];
                  newStrengths[index] = e.target.value;
                  handleNestedInputChange('conditionReport', 'strengths', newStrengths);
                }}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  const newStrengths = form.conditionReport.strengths.filter((_, i) => i !== index);
                  handleNestedInputChange('conditionReport', 'strengths', newStrengths);
                }}
                className="p-2 text-red-500 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              handleNestedInputChange('conditionReport', 'strengths', [...form.conditionReport.strengths, '']);
            }}
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            <span>장점 추가</span>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">단점/결함</label>
        <div className="space-y-2">
          {form.conditionReport.minorFlaws.map((flaw, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={flaw}
                onChange={(e) => {
                  const newFlaws = [...form.conditionReport.minorFlaws];
                  newFlaws[index] = e.target.value;
                  handleNestedInputChange('conditionReport', 'minorFlaws', newFlaws);
                }}
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => {
                  const newFlaws = form.conditionReport.minorFlaws.filter((_, i) => i !== index);
                  handleNestedInputChange('conditionReport', 'minorFlaws', newFlaws);
                }}
                className="p-2 text-red-500 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              handleNestedInputChange('conditionReport', 'minorFlaws', [...form.conditionReport.minorFlaws, '']);
            }}
            className="flex items-center space-x-2 text-primary hover:underline"
          >
            <Plus className="w-4 h-4" />
            <span>단점 추가</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSpecificationsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(form.specifications).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-2">
              {key === 'dimensions' ? '치수' :
               key === 'weight' ? '무게' :
               key === 'maxWeight' ? '최대 하중' :
               key === 'material' ? '소재' :
               key === 'color' ? '색상' :
               key === 'warranty' ? '보증 기간' :
               key === 'origin' ? '원산지' :
               key === 'year' ? '제조년도' : key}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleNestedInputChange('specifications', key, e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder={
                key === 'dimensions' ? '예: 100x80x50 (가로x높이x깊이)' :
                key === 'weight' ? '예: 25kg' :
                key === 'maxWeight' ? '예: 120kg' :
                key === 'material' ? '예: 메시, 알루미늄' :
                key === 'color' ? '예: 블랙' :
                key === 'warranty' ? '예: 12년' :
                key === 'origin' ? '예: 미국' :
                key === 'year' ? '예: 2023' : ''
              }
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSourceSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">소스 타입</label>
          <select
            value={form.source.type}
            onChange={(e) => handleNestedInputChange('source', 'type', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            {sourceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">소스명</label>
          <input
            type="text"
            value={form.source.name}
            onChange={(e) => handleNestedInputChange('source', 'name', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: 롯데캐슬 모델하우스"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">위치</label>
          <input
            type="text"
            value={form.source.location}
            onChange={(e) => handleNestedInputChange('source', 'location', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: 서울 강남구"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">날짜</label>
          <input
            type="date"
            value={form.source.date}
            onChange={(e) => handleNestedInputChange('source', 'date', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">사용 내역</label>
        <textarea
          value={form.source.usage}
          onChange={(e) => handleNestedInputChange('source', 'usage', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="예: 3년간 모델하우스 전시용으로 사용, 실제 거주 없음"
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">배송 정보</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="free-shipping"
              checked={form.shipping.free}
              onChange={(e) => handleNestedInputChange('shipping', 'free', e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="free-shipping" className="text-sm font-medium">
              무료 배송
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">배송 기간</label>
              <input
                type="text"
                value={form.shipping.period}
                onChange={(e) => handleNestedInputChange('shipping', 'period', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="예: 3-5일"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">설치비</label>
              <input
                type="number"
                value={form.shipping.installationFee}
                onChange={(e) => handleNestedInputChange('shipping', 'installationFee', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="installation"
              checked={form.shipping.installation}
              onChange={(e) => handleNestedInputChange('shipping', 'installation', e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="installation" className="text-sm font-medium">
              설치 서비스 제공
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/manage"
              className="p-2 hover:bg-muted rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">상품 수정</h1>
              <p className="text-muted-foreground">
                상품 정보를 수정하세요
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-muted"
            >
              <Eye className="w-4 h-4" />
              <span>미리보기</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? '저장 중...' : '저장'}</span>
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                currentTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 폼 내용 */}
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-lg border p-6"
        >
          {currentTab === 'basic' && renderBasicInfo()}
          {currentTab === 'description' && renderDescriptionSection()}
          {currentTab === 'condition' && renderConditionSection()}
          {currentTab === 'specifications' && renderSpecificationsSection()}
          {currentTab === 'images' && renderImagesSection()}
          {currentTab === 'source' && renderSourceSection()}
        </motion.div>
      </div>
    </div>
  );
} 