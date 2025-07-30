'use client';

import { Plus, X, Settings } from 'lucide-react';
import { ProductForm, conditions, categories, availabilityOptions } from './types';
import { ProductOption, ProductOptionValue } from '@/types';
import { useState } from 'react';

interface AdminBasicInfoProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
  newTag: string;
  setNewTag: (value: string) => void;
  handleTagAdd: () => void;
  handleArrayRemove: (field: string, index: number) => void;
}

export default function AdminBasicInfo({
  form,
  handleInputChange,
  newTag,
  setNewTag,
  handleTagAdd,
  handleArrayRemove
}: AdminBasicInfoProps) {
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionType, setNewOptionType] = useState<'color' | 'size' | 'material' | 'style' | 'custom'>('color');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);

  // 옵션 추가
  const handleAddOption = () => {
    if (!newOptionName.trim()) return;

    const newOption: ProductOption = {
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

  // 옵션 삭제
  const handleRemoveOption = (optionId: string) => {
    const updatedOptions = form.options.filter(option => option.id !== optionId);
    handleInputChange('options', updatedOptions);
  };

  // 옵션 값 추가
  const handleAddOptionValue = (optionId: string, value: string) => {
    if (!value.trim()) return;

    const updatedOptions = form.options.map(option => {
      if (option.id === optionId) {
        const newValue: ProductOptionValue = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          value: value.trim(),
          isAvailable: true
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
  };

  // 옵션 값 삭제
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

  // 옵션 필수 여부 토글
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
    <div className="space-y-8">
      {/* 기본 정보 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">상품명 *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="상품명을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">브랜드 *</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="브랜드명을 입력하세요"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">카테고리</label>
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
              placeholder="서브카테고리를 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">모델</label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="모델명을 입력하세요"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="SKU를 입력하세요"
            />
          </div>
        </div>
      </div>

      {/* 가격 정보 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">가격 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">정가 *</label>
            <input
              type="number"
              value={form.originalPrice}
              onChange={(e) => handleInputChange('originalPrice', parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">할인가 *</label>
            <input
              type="number"
              value={form.salePrice}
              onChange={(e) => handleInputChange('salePrice', parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>
        {form.originalPrice > 0 && form.salePrice > 0 && form.originalPrice !== form.salePrice && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              할인율: {Math.round(((form.originalPrice - form.salePrice) / form.originalPrice) * 100)}%
              (할인 금액: {(form.originalPrice - form.salePrice).toLocaleString()}원)
            </p>
          </div>
        )}
      </div>

      {/* 재고 및 상태 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">재고 및 상태</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">재고 수량 *</label>
            <input
              type="number"
              value={form.stockCount}
              onChange={(e) => handleInputChange('stockCount', parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">상품 상태</label>
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
          <div>
            <label className="block text-sm font-medium mb-2">판매 상태</label>
            <select
              value={form.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              {availabilityOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 상품 옵션 */}
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
                            <span>{value.value}</span>
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
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editingOptionId === option.id ? newOptionValue : ''}
                          onChange={(e) => setNewOptionValue(e.target.value)}
                          onFocus={() => setEditingOptionId(option.id)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddOptionValue(option.id, newOptionValue);
                              setEditingOptionId(null);
                            }
                          }}
                          className="flex-1 p-2 border rounded focus:ring-2 focus:ring-primary text-sm"
                          placeholder="옵션 값을 입력하세요 (예: 블루, L, 가죽)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            handleAddOptionValue(option.id, newOptionValue);
                            setEditingOptionId(null);
                          }}
                          className="px-3 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors text-sm"
                        >
                          추가
                        </button>
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

      {/* 태그 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">태그</h3>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
              className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
              placeholder="태그를 입력하세요"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>추가</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-2 px-3 py-1 bg-muted rounded-lg text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleArrayRemove('tags', index)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 추천 상품 설정 */}
      <div className="bg-background border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">추천 설정</h3>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="featured"
            checked={form.featured}
            onChange={(e) => handleInputChange('featured', e.target.checked)}
            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            추천 상품으로 설정
          </label>
        </div>
      </div>
    </div>
  );
}