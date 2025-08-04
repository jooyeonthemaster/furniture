'use client';

import { Eye } from 'lucide-react';
import Image from 'next/image';
import OverviewImageUploader from '@/components/admin/OverviewImageUploader';
import { ProductForm } from '../types';

interface DescriptionTabProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
}

export default function DescriptionTab({
  form,
  handleInputChange
}: DescriptionTabProps) {
  return (
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
}