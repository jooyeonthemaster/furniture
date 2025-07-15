'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, X, Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SectionParser from '@/components/admin/SectionParser';
import ImageUploader from '@/components/admin/ImageUploader';
import OverviewImageUploader from '@/components/admin/OverviewImageUploader';
import { uploadToCloudinary } from '@/lib/cloudinary';

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
  category: 'furniture',
  subcategory: '',
  model: '',
  sku: '',
  originalPrice: 0,
  salePrice: 0,
  condition: 'excellent',
  stockCount: 1,
  availability: 'in_stock',
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

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof ProductForm] as any),
        [field]: value
      }
    }));
  };

  const handleArrayAdd = (field: string, value: string) => {
    if (!value.trim()) return;
    
    setForm(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof ProductForm] as string[]), value.trim()]
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
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // 실제로는 Cloudinary에 업로드
    // 지금은 로컬 파일 URL 사용
    const newImages = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
      isPrimary: form.images.length === 0,
      alt: file.name.replace(/\.[^/.]+$/, ''),
      caption: ''
    }));
    
    setForm(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  // 폼 검증 함수
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
      // Firebase에 상품 데이터 저장
      const { addProduct } = await import('@/lib/products');
      
      // 폼 데이터를 Product 타입에 맞게 변환 (undefined 제거)
      const productData = {
        name: form.name,
        brand: form.brand,
        category: form.category as any,
        subcategory: form.subcategory || '',
        description: form.description,
        // 상품 개요 필드 추가
        overviewDescription: form.overviewDescription || '',
        overviewImages: form.overviewImages.map(img => img.url),
        originalPrice: form.originalPrice,
        salePrice: form.salePrice,
        discount: Math.round(((form.originalPrice - form.salePrice) / form.originalPrice) * 100),
        condition: form.condition as any,
        images: form.images.length > 0 ? form.images.map(img => typeof img === 'string' ? img : img.url) : ['/placeholder-product.jpg'],
        // undefined 필드들을 제거하거나 기본값으로 설정
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
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        likes: 0
      };
      
      console.log('상품 데이터 저장 중:', productData);
      
      const productId = await addProduct(productData);
      console.log('상품 저장 성공, ID:', productId);
      
      alert('상품이 성공적으로 등록되었습니다!');
      router.push('/admin/manage');
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert('상품 등록에 실패했습니다: ' + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <option value="new">New</option>
            <option value="furniture">Furniture</option>
            <option value="lighting">Lighting</option>
            <option value="kitchen">Kitchen</option>
            <option value="accessories">Accessories</option>
            <option value="textile">Textile</option>
            <option value="kids">Kids</option>
            <option value="book">Book</option>
            <option value="sale">Sale</option>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">모델명</label>
          <input
            type="text"
            value={form.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: Aeron Chair Size B"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">SKU</label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: HM-AER-B-2023"
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
          <label className="block text-sm font-medium mb-2">판매 상태</label>
          <select
            value={form.availability}
            onChange={(e) => handleInputChange('availability', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="in_stock">재고 있음</option>
            <option value="low_stock">재고 부족</option>
            <option value="out_of_stock">품절</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">간단 설명 *</label>
        <textarea
          value={form.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="상품의 핵심 특징을 간단히 설명해주세요..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">태그</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleArrayRemove('tags', index)}
                className="hover:bg-primary/20 rounded-full p-0.5"
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
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="태그 입력..."
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
          />
          <button
            type="button"
            onClick={handleTagAdd}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => handleInputChange('featured', e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="featured" className="text-sm font-medium">추천 상품으로 설정</label>
      </div>
    </div>
  );

  const renderDescriptionSection = () => (
    <div className="space-y-8">
      {/* 상품 개요 섹션 */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">📝 상품 개요</h3>
        
        <div className="space-y-6">
          {/* 개요 텍스트 입력 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              개요 설명
              <span className="text-muted-foreground ml-2">(고객이 상품 상세 페이지에서 보게 될 개요 내용)</span>
            </label>
            <textarea
              value={form.overviewDescription}
              onChange={(e) => handleInputChange('overviewDescription', e.target.value)}
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary"
              rows={6}
              placeholder="상품의 핵심 특징과 매력을 상세히 설명해주세요...

예시:
Herman Miller Aeron Chair는 1994년 출시 이후 전 세계 오피스 가구의 혁신을 이끈 대표작입니다. 
인체공학적 설계와 혁신적인 8Z 펠리클 메쉬 소재로 장시간 앉아 있어도 편안함을 제공합니다.

• 획기적인 PostureFit SL 요추 지지 시스템
• 12가지 조절 포인트로 개인 맞춤 설정
• 12년 무상 A/S 보장"
            />
          </div>

          {/* 개요 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              개요 이미지
              <span className="text-muted-foreground ml-2">(상품 개요와 함께 표시될 이미지들)</span>
            </label>
            
            <OverviewImageUploader
              images={form.overviewImages}
              onImagesChange={(images) => handleInputChange('overviewImages', images)}
              maxImages={10}
              maxFileSize={5}
            />
          </div>
        </div>
      </div>

      {/* 미리보기 섹션 */}
      {(form.overviewDescription || form.overviewImages.length > 0) && (
        <div className="bg-muted rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center space-x-2">
            <Eye className="w-5 h-5" />
            <span>상품 개요 미리보기</span>
          </h3>
          
          <div className="bg-background rounded-lg p-6 border">
            <h4 className="text-xl font-medium mb-4">상품 개요</h4>
            
            {form.overviewDescription && (
              <div className="mb-6">
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {form.overviewDescription}
                </div>
              </div>
            )}
            
            {form.overviewImages.length > 0 && (
              <div className="space-y-4">
                {form.overviewImages.map((image, index) => (
                  <div key={image.id} className="relative">
                    <div className="relative rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={image.url}
                        alt={image.alt || `개요 이미지 ${index + 1}`}
                        width={800}
                        height={0}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    {image.alt && (
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {image.alt}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 기존 간단 설명 (하위 호환성을 위해 유지) */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">💬 간단 설명</h3>
        <div>
          <label className="block text-sm font-medium mb-2">
            기본 설명
            <span className="text-muted-foreground ml-2">(검색 및 목록에서 사용되는 간단한 설명)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-primary"
            rows={3}
            placeholder="상품의 핵심 특징을 한두 줄로 간단히 설명해주세요..."
          />
        </div>
      </div>
    </div>
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

  const renderGuideSection = () => (
    <div className="space-y-6">
      {['setup', 'maintenance', 'tips'].map((guideType) => (
        <div key={guideType}>
          <label className="block text-sm font-medium mb-2">
            {guideType === 'setup' ? '설치 가이드' : 
             guideType === 'maintenance' ? '관리 방법' : '사용 팁'}
          </label>
          <div className="space-y-2">
            {(form.usageGuide[guideType as keyof typeof form.usageGuide] as string[]).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const currentArray = form.usageGuide[guideType as keyof typeof form.usageGuide] as string[];
                    const newArray = [...currentArray];
                    newArray[index] = e.target.value;
                    handleNestedInputChange('usageGuide', guideType, newArray);
                  }}
                  className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => {
                    const currentArray = form.usageGuide[guideType as keyof typeof form.usageGuide] as string[];
                    const newArray = currentArray.filter((_, i) => i !== index);
                    handleNestedInputChange('usageGuide', guideType, newArray);
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
                const currentArray = form.usageGuide[guideType as keyof typeof form.usageGuide] as string[];
                handleNestedInputChange('usageGuide', guideType, [...currentArray, '']);
              }}
              className="flex items-center space-x-2 text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              <span>항목 추가</span>
            </button>
          </div>
        </div>
      ))}
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

               key === 'origin' ? '원산지' :
               key === 'year' ? '제조년도' : key}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleNestedInputChange('specifications', key, e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder={
                key === 'dimensions' ? '예: 68.5 x 65 x 94-104cm' :
                key === 'weight' ? '예: 21kg' :
                key === 'maxWeight' ? '예: 136kg' :
                key === 'material' ? '예: 8Z 펠리클 메쉬, 알루미늄' :
                key === 'color' ? '예: 차콜' :

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
      <div>
        <label className="block text-sm font-medium mb-2">소스 유형</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">소스명</label>
          <input
            type="text"
            value={form.source.name}
            onChange={(e) => handleNestedInputChange('source', 'name', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: 힐스테이트 강남 모델하우스"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">위치</label>
          <input
            type="text"
            value={form.source.location}
            onChange={(e) => handleNestedInputChange('source', 'location', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: 서울 강남구 논현동"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">날짜</label>
          <input
            type="date"
            value={form.source.date}
            onChange={(e) => handleNestedInputChange('source', 'date', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">사용 상태</label>
          <input
            type="text"
            value={form.source.usage}
            onChange={(e) => handleNestedInputChange('source', 'usage', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="예: 전시용 (실제 사용 없음)"
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">배송 정보</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="freeShipping"
              checked={form.shipping.free}
              onChange={(e) => handleNestedInputChange('shipping', 'free', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="freeShipping" className="text-sm font-medium">무료 배송</label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">배송 기간</label>
              <input
                type="text"
                value={form.shipping.period}
                onChange={(e) => handleNestedInputChange('shipping', 'period', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="예: 2-3일"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">설치비 (원)</label>
              <input
                type="number"
                value={form.shipping.installationFee}
                onChange={(e) => handleNestedInputChange('shipping', 'installationFee', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="installation"
              checked={form.shipping.installation}
              onChange={(e) => handleNestedInputChange('shipping', 'installation', e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="installation" className="text-sm font-medium">설치 서비스 제공</label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/manage" className="p-2 hover:bg-muted rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl xs:text-xl font-light">새 상품 추가</h1>
            <p className="text-muted-foreground">상품 정보를 입력하여 새로운 상품을 등록하세요</p>
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

      {/* 필수 입력사항 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">📝 필수 입력 정보</h3>
        <p className="text-sm text-blue-700">
          상품명, 브랜드, 상품 설명, 정가, 할인가, 재고 수량은 반드시 입력해야 합니다.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                currentTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-background border rounded-lg p-6">
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentTab === 'basic' && renderBasicInfo()}
          {currentTab === 'description' && renderDescriptionSection()}
          {currentTab === 'condition' && renderConditionSection()}
          {currentTab === 'guide' && renderGuideSection()}
          {currentTab === 'specifications' && renderSpecificationsSection()}
          {currentTab === 'images' && renderImagesSection()}
          {currentTab === 'source' && renderSourceSection()}
        </motion.div>
      </div>
    </div>
  );
} 