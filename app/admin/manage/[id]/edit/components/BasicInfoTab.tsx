'use client';

import { useState } from 'react';
import { Plus, X, Settings } from 'lucide-react';
import { categories, ProductForm, conditions } from '@/components/admin-product/types';

interface BasicInfoTabProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
  handleNestedInputChange: (parent: string, field: string, value: any) => void;
  handleArrayAdd: (field: string, value: string) => void;
  handleArrayRemove: (field: string, index: number) => void;
}

export default function BasicInfoTab({
  form,
  handleInputChange,
  handleNestedInputChange,
  handleArrayAdd,
  handleArrayRemove
}: BasicInfoTabProps) {
  // 로컬 상태들
  const [newTag, setNewTag] = useState('');
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionType, setNewOptionType] = useState<'color' | 'size' | 'material' | 'style' | 'custom'>('color');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionStock, setNewOptionStock] = useState<number | ''>('');
  const [newColorCode, setNewColorCode] = useState<string>('#000000');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

  const handleTagAdd = () => {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      handleArrayAdd('tags', newTag.trim());
      setNewTag('');
    }
  };

  // 옵션 관리 함수들
  const handleAddOption = () => {
    if (!newOptionName.trim()) return;

    const newOption: import('@/types').ProductOption = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: newOptionName.trim(),
      type: newOptionType,
      values: [],
      required: false,
      displayOrder: form.options.length
    };

    handleInputChange('options', [...form.options, newOption]);
    setNewOptionName('');
  };

  const handleRemoveOption = (optionId: string) => {
    const updatedOptions = form.options.filter(option => option.id !== optionId);
    handleInputChange('options', updatedOptions);
  };

  const handleAddOptionValue = (optionId: string, value: string, stock: number, colorCode?: string) => {
    if (!value.trim()) return;

    const updatedOptions = form.options.map(option => {
      if (option.id === optionId) {
        const newValue: import('@/types').ProductOptionValue = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          value: value.trim(),
          stockQuantity: stock,
          isAvailable: true,
          ...(colorCode && { colorCode })
        };
        return {
          ...option,
          values: [...option.values, newValue]
        };
      }
      return option;
    });

    handleInputChange('options', updatedOptions);
    setNewOptionValue('');
    setNewOptionStock('');
    setNewColorCode('#000000');
  };

  const handleRemoveOptionValue = (optionId: string, valueId: string) => {
    const updatedOptions = form.options.map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          values: option.values.filter(value => value.id !== valueId)
        };
      }
      return option;
    });

    handleInputChange('options', updatedOptions);
  };

  const handleToggleOptionRequired = (optionId: string) => {
    const updatedOptions = form.options.map(option => {
      if (option.id === optionId) {
        return { ...option, required: !option.required };
      }
      return option;
    });

    handleInputChange('options', updatedOptions);
  };

  return (
    <div className="space-y-6">
      {/* 기본 정보 입력 */}
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
            {categories.map(category => (
              <option key={category.value} value={category.value}>{category.label}</option>
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

      {/* 상품 옵션 - 별도 컴포넌트로 분리 가능 */}
      <div className="bg-background border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">상품 옵션</h3>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="hasOptions"
              checked={form.hasOptions}
              onChange={(e) => {
                handleInputChange('hasOptions', e.target.checked);
                if (!e.target.checked) {
                  handleInputChange('options', []);
                }
              }}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="hasOptions" className="text-sm font-medium">
              이 상품에 옵션 설정하기
            </label>
          </div>
        </div>

        {form.hasOptions && (
          <div className="space-y-6">
            {/* 옵션 추가 폼 */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-3">새 옵션 추가</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">옵션명</label>
                  <input
                    type="text"
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary text-sm"
                    placeholder="예: 색상, 사이즈, 재질"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">옵션 타입</label>
                  <select
                    value={newOptionType}
                    onChange={(e) => setNewOptionType(e.target.value as any)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="color">색상</option>
                    <option value="size">사이즈</option>
                    <option value="material">재질</option>
                    <option value="style">스타일</option>
                    <option value="custom">기타</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>옵션 추가</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 기존 옵션들 */}
            {form.options.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">설정된 옵션들</h4>
                {form.options.map((option, index) => (
                  <div key={option.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h5 className="font-medium">{option.name}</h5>
                        <span className="text-xs px-2 py-1 bg-muted rounded">
                          {option.type === 'color' && '색상'}
                          {option.type === 'size' && '사이즈'}
                          {option.type === 'material' && '재질'}
                          {option.type === 'style' && '스타일'}
                          {option.type === 'custom' && '기타'}
                        </span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`required-${option.id}`}
                            checked={option.required}
                            onChange={() => handleToggleOptionRequired(option.id)}
                            className="w-3 h-3 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor={`required-${option.id}`} className="text-xs text-muted-foreground">
                            필수 선택
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(option.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 옵션 값들 */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => (
                          <div
                            key={value.id}
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary rounded-lg text-sm"
                          >
                            {option.type === 'color' && value.colorCode && (
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: value.colorCode }}
                              />
                            )}
                            <span>{value.value}</span>
                            {value.stockQuantity !== undefined && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                재고: {value.stockQuantity}개
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveOptionValue(option.id, value.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* 옵션 값 추가 */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <input
                            type="text"
                            value={editingOptionId === option.id ? newOptionValue : ''}
                            onChange={(e) => setNewOptionValue(e.target.value)}
                            onFocus={() => setEditingOptionId(option.id)}
                            className="p-2 border rounded focus:ring-2 focus:ring-primary text-sm"
                            placeholder="옵션 값 (예: 블루, L, 가죽)"
                          />
                          <input
                            type="number"
                            value={editingOptionId === option.id ? (newOptionStock || '') : ''}
                            onChange={(e) => setNewOptionStock(Number(e.target.value))}
                            onFocus={() => setEditingOptionId(option.id)}
                            className="p-2 border rounded focus:ring-2 focus:ring-primary text-sm"
                            placeholder="재고 수량"
                            min="0"
                          />
                          {option.type === 'color' && (
                            <input
                              type="color"
                              value={editingOptionId === option.id ? (newColorCode || '#000000') : '#000000'}
                              onChange={(e) => setNewColorCode(e.target.value)}
                              onFocus={() => setEditingOptionId(option.id)}
                              className="p-1 border rounded focus:ring-2 focus:ring-primary w-full h-10"
                              title="색상 선택"
                            />
                          )}
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleAddOptionValue(option.id, newOptionValue, Number(newOptionStock) || 0, option.type === 'color' ? newColorCode : undefined);
                                setEditingOptionId(null);
                              }}
                              className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm"
                            >
                              추가
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {option.type === 'color' ? '색상 옵션의 경우 색상 코드도 선택해주세요' : '옵션 값 입력 후 추가 버튼을 클릭하세요'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {form.options.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">위에서 옵션을 추가하여 상품의 선택 옵션을 설정하세요</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 태그 섹션 */}
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
}