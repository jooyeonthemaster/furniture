'use client';

import { Save, Eye } from 'lucide-react';
import { ProductForm, sourceTypes } from './types';

interface AdminSourceProps {
  form: ProductForm;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onPreview?: () => void;
}

export default function AdminSource({ 
  form, 
  handleNestedInputChange, 
  isSubmitting, 
  onSubmit,
  onPreview 
}: AdminSourceProps) {
  return (
    <div className="space-y-8">
      {/* 소스 정보 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">소스 정보</h3>
        <p className="text-sm text-muted-foreground mb-6">
          상품의 출처와 이전 사용 내역을 입력하세요.
        </p>
        
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
            <label className="block text-sm font-medium mb-2">사용 내역</label>
            <textarea
              value={form.source.usage}
              onChange={(e) => handleNestedInputChange('source', 'usage', e.target.value)}
              className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-primary resize-y"
              placeholder="예: 모델하우스 전시용으로 6개월 사용, 일반 관람객 출입 구역에 배치"
            />
          </div>
        </div>
      </div>

      {/* 최종 검토 */}
      <div className="bg-muted/30 border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">최종 검토</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">상품명:</span>
              <span className="ml-2 text-muted-foreground">{form.name || '미입력'}</span>
            </div>
            <div>
              <span className="font-medium">브랜드:</span>
              <span className="ml-2 text-muted-foreground">{form.brand || '미입력'}</span>
            </div>
            <div>
              <span className="font-medium">카테고리:</span>
              <span className="ml-2 text-muted-foreground">{form.category}</span>
            </div>
            <div>
              <span className="font-medium">상태:</span>
              <span className="ml-2 text-muted-foreground">
                {form.condition === 'new' ? '신품' :
                 form.condition === 'like-new' ? 'A급 (최상)' :
                 form.condition === 'excellent' ? 'B급 (상)' :
                 form.condition === 'good' ? 'C급 (중)' :
                 form.condition === 'fair' ? 'D급 (하)' : form.condition}
              </span>
            </div>
            <div>
              <span className="font-medium">정가:</span>
              <span className="ml-2 text-muted-foreground">{form.originalPrice.toLocaleString()}원</span>
            </div>
            <div>
              <span className="font-medium">할인가:</span>
              <span className="ml-2 text-muted-foreground">{form.salePrice.toLocaleString()}원</span>
            </div>
            <div>
              <span className="font-medium">재고:</span>
              <span className="ml-2 text-muted-foreground">{form.stockCount}개</span>
            </div>
            <div>
              <span className="font-medium">이미지:</span>
              <span className="ml-2 text-muted-foreground">{form.images.length}개</span>
            </div>
          </div>

          {form.originalPrice > 0 && form.salePrice > 0 && form.originalPrice !== form.salePrice && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                할인율: {Math.round(((form.originalPrice - form.salePrice) / form.originalPrice) * 100)}% 
                (할인 금액: {(form.originalPrice - form.salePrice).toLocaleString()}원)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="bg-background border rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">상품 등록</h3>
            <p className="text-sm text-muted-foreground">
              모든 정보를 확인한 후 상품을 등록하세요.
            </p>
          </div>
          
          <div className="flex space-x-3">
            {onPreview && (
              <button
                type="button"
                onClick={onPreview}
                className="flex items-center space-x-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Eye className="w-5 h-5" />
                <span>미리보기</span>
              </button>
            )}
            
            <button
              type="submit"
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>상품 등록</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">주의사항</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 상품명, 브랜드, 설명, 가격, 재고는 필수 입력 항목입니다.</li>
          <li>• 이미지는 최소 1개 이상 업로드해야 합니다.</li>
          <li>• 등록된 상품은 관리 페이지에서 수정하거나 삭제할 수 있습니다.</li>
          <li>• 상품 등록 후 즉시 고객에게 노출됩니다.</li>
        </ul>
      </div>
    </div>
  );
}