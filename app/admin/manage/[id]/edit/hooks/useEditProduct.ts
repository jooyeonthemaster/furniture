'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProductForm, initialForm } from '../types';

export function useEditProduct(productId: string) {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            hasOptions: productData.hasOptions || false,
            options: productData.options || [],
            description: productData.description || '',
            overviewDescription: productData.overviewDescription || '',
            overviewImages: productData.overviewImages?.map((url: string, index: number) => ({
              id: `overview-${index}`,
              url,
              alt: `${productData.name} 개요 이미지 ${index + 1}`,
              caption: ''
            })) || [],
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
            relatedProducts: productData.relatedProducts || [],
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

  // 입력 핸들러들
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

  // 폼 검증
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

  // 폼 제출
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
        // 기본 정보
        name: form.name,
        brand: form.brand,
        category: form.category as any,
        subcategory: form.subcategory || '',
        model: form.model || '',
        sku: form.sku || '',
        description: form.description,
        overviewDescription: form.overviewDescription,
        overviewImages: form.overviewImages.map(img => img.url),
        
        // 가격 정보
        originalPrice: form.originalPrice,
        salePrice: form.salePrice,
        discount: Math.round(((form.originalPrice - form.salePrice) / form.originalPrice) * 100),
        
        // 상태 및 재고
        condition: form.condition as any,
        stock: form.stockCount,
        availability: form.availability,
        
        // 이미지 (blob URL 필터링)
        images: form.images.length > 0 ? 
          form.images
            .map(img => typeof img === 'string' ? img : img.url)
            .filter(url => !url.startsWith('blob:')) // blob URL 제거
          : ['/placeholder-product.jpg'],
        
        // 상품 옵션
        hasOptions: form.hasOptions,
        options: form.hasOptions ? form.options : [],
        
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
        
        // 소재 및 색상
        materials: form.specifications.material ? [form.specifications.material] : [],
        colors: form.specifications.color ? [form.specifications.color] : [],
        
        // 상세 설명
        detailedDescription: form.detailedDescription,
        
        // 상태 리포트
        conditionReport: form.conditionReport,
        
        // 사용 가이드
        usageGuide: form.usageGuide,
        
        // 제품 사양 (전체)
        specifications: {
          dimensions: form.specifications.dimensions || '',
          weight: form.specifications.weight || '',
          maxWeight: form.specifications.maxWeight || '',
          material: form.specifications.material || '',
          color: form.specifications.color || '',
          origin: form.specifications.origin || '',
          year: form.specifications.year || ''
        },
        
        // 소스 정보
        source: form.source.type as any,
        sourceDetails: form.source.name || '',
        sourceLocation: form.source.location || '',
        sourceDate: form.source.date || '',
        sourceUsage: form.source.usage || '',
        
        // 배송 정보
        shipping: form.shipping,
        
        // 기타
        featured: form.featured,
        tags: form.tags,
        relatedProducts: form.relatedProducts,
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

  return {
    form,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleNestedInputChange,
    handleArrayAdd,
    handleArrayRemove,
    handleSubmit
  };
}