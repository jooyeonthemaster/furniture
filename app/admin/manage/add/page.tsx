'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct } from '@/lib/products';
import {
  AdminFormNavigation,
  AdminBasicInfo,
  AdminDescription,
  AdminCondition,
  AdminSpecifications,
  AdminImages,
  AdminSource,
  ProductForm,
  initialForm
} from '@/components/admin-product';

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

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

    // ImageUploader 컴포넌트를 사용하도록 변경 필요
    // 이 함수는 더 이상 사용하지 않음 - AdminImages 컴포넌트에서 처리
    console.warn('handleImageUpload는 더 이상 사용되지 않습니다. AdminImages 컴포넌트를 사용하세요.');
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
    if (form.images.length === 0) errors.push('상품 이미지 (최소 1개)');
    
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
      // 폼 데이터를 Product 타입에 맞게 변환
      const productData = {
        name: form.name,
        brand: form.brand,
        category: form.category as any,
        subcategory: form.subcategory || '',
        model: form.model || '',
        sku: form.sku || '',
        description: form.description,
        // 상품 개요 필드 추가
        overviewDescription: form.overviewDescription || '',
        overviewImages: form.overviewImages.map(img => img.url),
        originalPrice: form.originalPrice,
        salePrice: form.salePrice,
        discount: Math.round(((form.originalPrice - form.salePrice) / form.originalPrice) * 100),
        condition: form.condition as any,
        availability: form.availability as any,
        images: form.images
          .map(img => img.url)
          .filter(url => !url.startsWith('blob:')), // blob URL 제거
        // 치수 정보 - 자유 입력 형식 지원
        dimensions: form.specifications.dimensions ? (() => {
          // 숫자x숫자x숫자 형식인 경우에만 파싱, 아니면 undefined로 설정
          const dimensionParts = form.specifications.dimensions.split('x');
          if (dimensionParts.length === 3) {
            const width = parseInt(dimensionParts[0]?.trim()) || 0;
            const height = parseInt(dimensionParts[1]?.trim()) || 0;
            const depth = parseInt(dimensionParts[2]?.trim()) || 0;
            
            // 모든 값이 유효한 숫자인 경우에만 dimensions 객체 생성
            if (width > 0 || height > 0 || depth > 0) {
              return {
                width,
                height,
                depth,
                unit: 'cm' as const
              };
            }
          }
          return undefined;
        })() : undefined,
        materials: form.specifications.material ? [form.specifications.material] : [],
        colors: form.specifications.color ? [form.specifications.color] : [],
        stock: form.stockCount,
        featured: form.featured,
        source: form.source.type as any,
        sourceDetails: form.source.name || '',
        sourceLocation: form.source.location || '',
        sourceDate: form.source.date || '',
        sourceUsage: form.source.usage || '',
        tags: form.tags,
        // 상품 옵션 필드 추가
        hasOptions: form.hasOptions,
        options: form.hasOptions ? form.options : undefined,
        // 연계 상품 추천 기능
        relatedProducts: [],
        // 상세 설명
        detailedDescription: form.detailedDescription.overview ? form.detailedDescription : undefined,
        // 상태 리포트
        conditionReport: form.conditionReport.overall ? form.conditionReport : undefined,
        // 사용 가이드
        usageGuide: (form.usageGuide.setup.length > 0 || form.usageGuide.maintenance.length > 0 || form.usageGuide.tips.length > 0) 
          ? form.usageGuide : undefined,
        // 제품 사양
        specifications: {
          dimensions: form.specifications.dimensions || '',
          weight: form.specifications.weight || '',
          maxWeight: form.specifications.maxWeight || '',
          material: form.specifications.material || '',
          color: form.specifications.color || '',
          origin: form.specifications.origin || '',
          year: form.specifications.year || ''
        },
        // 배송 정보
        shipping: form.shipping,
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

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'basic':
        return (
          <AdminBasicInfo
            form={form}
            handleInputChange={handleInputChange}
            newTag={newTag}
            setNewTag={setNewTag}
            handleTagAdd={handleTagAdd}
            handleArrayRemove={handleArrayRemove}
          />
        );
        
      case 'description':
        return (
          <AdminDescription
            form={form}
            handleInputChange={handleInputChange}
            handleNestedInputChange={handleNestedInputChange}
            handleArrayAdd={handleArrayAdd}
            handleArrayRemove={handleArrayRemove}
          />
        );
        
      case 'condition':
        return (
          <AdminCondition
            form={form}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
        
      case 'guide':
      case 'specifications':
        return (
          <AdminSpecifications
            form={form}
            handleNestedInputChange={handleNestedInputChange}
          />
        );
        
      case 'images':
        return (
          <AdminImages
            form={form}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
          />
        );
        
      case 'source':
        return (
          <AdminSource
            form={form}
            handleNestedInputChange={handleNestedInputChange}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminFormNavigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
      
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {renderCurrentTab()}
        </form>
      </div>
    </div>
  );
}