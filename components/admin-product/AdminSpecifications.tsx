'use client';

import { Plus, X } from 'lucide-react';
import { ProductForm } from './types';

interface AdminSpecificationsProps {
  form: ProductForm;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
}

export default function AdminSpecifications({ form, handleNestedInputChange }: AdminSpecificationsProps) {
  const addUsageGuideItem = (guideType: string) => {
    const currentArray = form.usageGuide[guideType as keyof typeof form.usageGuide] as string[];
    handleNestedInputChange('usageGuide', guideType, [...currentArray, '']);
  };

  const updateUsageGuideItem = (guideType: string, index: number, value: string) => {
    const currentArray = form.usageGuide[guideType as keyof typeof form.usageGuide] as string[];
    const newArray = currentArray.map((item, i) => i === index ? value : item);
    handleNestedInputChange('usageGuide', guideType, newArray);
  };

  const removeUsageGuideItem = (guideType: string, index: number) => {
    const currentArray = form.usageGuide[guideType as keyof typeof form.usageGuide] as string[];
    const newArray = currentArray.filter((_, i) => i !== index);
    handleNestedInputChange('usageGuide', guideType, newArray);
  };

  return (
    <div className="space-y-8">
      {/* 사용 가이드 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">사용 가이드</h3>
        
        {[
          { key: 'setup', label: '설치 가이드', placeholder: '설치 단계를 입력하세요' },
          { key: 'maintenance', label: '관리 가이드', placeholder: '관리 방법을 입력하세요' },
          { key: 'tips', label: '사용 팁', placeholder: '사용 팁을 입력하세요' }
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">{label}</label>
              <button
                type="button"
                onClick={() => addUsageGuideItem(key)}
                className="flex items-center space-x-1 text-sm text-primary hover:underline"
              >
                <Plus className="w-4 h-4" />
                <span>항목 추가</span>
              </button>
            </div>
            
            <div className="space-y-2">
              {(form.usageGuide[key as keyof typeof form.usageGuide] as string[]).map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateUsageGuideItem(key, index, e.target.value)}
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary"
                    placeholder={placeholder}
                  />
                  <button
                    type="button"
                    onClick={() => removeUsageGuideItem(key, index)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {(form.usageGuide[key as keyof typeof form.usageGuide] as string[]).length === 0 && (
                <div className="text-center p-4 text-muted-foreground bg-muted rounded-lg">
                  <p className="text-sm">{label} 항목이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 제품 사양 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">제품 사양</h3>
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
                  key === 'dimensions' ? '예: W 162 x D 208 x H 125 (매트리스 사이즈: W 160 x D 200 x H 28) 또는 100x80x50' :
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

      {/* 배송 정보 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">배송 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="freeShipping"
                checked={form.shipping.free}
                onChange={(e) => handleNestedInputChange('shipping', 'free', e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="freeShipping" className="text-sm font-medium">
                무료배송
              </label>
            </div>
            
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
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="installation"
                checked={form.shipping.installation}
                onChange={(e) => handleNestedInputChange('shipping', 'installation', e.target.checked)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="installation" className="text-sm font-medium">
                설치 서비스 제공
              </label>
            </div>
            
            {form.shipping.installation && (
              <div>
                <label className="block text-sm font-medium mb-2">설치비 (원)</label>
                <input
                  type="number"
                  value={form.shipping.installationFee}
                  onChange={(e) => handleNestedInputChange('shipping', 'installationFee', parseInt(e.target.value) || 0)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="0"
                  min="0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}