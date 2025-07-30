'use client';

import { Eye, Heart, Package, Truck } from 'lucide-react';
import { Product, SelectedOptions } from '@/types';

interface ProductInfoProps {
  product: Product;
  selectedOptions?: SelectedOptions;
  onOptionsChange?: (options: SelectedOptions) => void;
}

export default function ProductInfo({ 
  product, 
  selectedOptions = {}, 
  onOptionsChange 
}: ProductInfoProps) {
  const discountPercentage = Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100);
  
  // 선택된 옵션에 따른 가격 변동 계산
  const calculatePriceModifier = () => {
    if (!product.hasOptions || !product.options) return 0;
    
    let modifier = 0;
    product.options.forEach(option => {
      const selectedValueId = selectedOptions[option.id];
      if (selectedValueId) {
        const selectedValue = option.values.find(v => v.id === selectedValueId);
        if (selectedValue && selectedValue.priceModifier) {
          modifier += selectedValue.priceModifier;
        }
      }
    });
    
    return modifier;
  };

  const priceModifier = calculatePriceModifier();
  const finalSalePrice = product.salePrice + priceModifier;
  const finalOriginalPrice = product.originalPrice + priceModifier;

  // 옵션 선택 핸들러
  const handleOptionSelect = (optionId: string, valueId: string) => {
    const newOptions = {
      ...selectedOptions,
      [optionId]: valueId
    };
    onOptionsChange?.(newOptions);
  };

  // 필수 옵션이 모두 선택되었는지 확인
  const areRequiredOptionsSelected = () => {
    if (!product.hasOptions || !product.options) return true;
    
    return product.options
      .filter(option => option.required)
      .every(option => selectedOptions[option.id]);
  };

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
        <h1 className="text-3xl xs:text-2xl font-light mb-4">{product.name}</h1>
        
        {/* 통계 정보 */}
        <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>조회 {product.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="w-4 h-4" />
            <span>좋아요 {product.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Package className="w-4 h-4" />
            <span>재고 {product.stock}개</span>
          </div>
        </div>
      </div>

      {/* 가격 정보 */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-red-600">
            {finalSalePrice.toLocaleString()}원
          </span>
          {priceModifier !== 0 && (
            <span className="text-sm text-muted-foreground">
              ({priceModifier > 0 ? '+' : ''}{priceModifier.toLocaleString()}원)
            </span>
          )}
          <span className="text-lg text-muted-foreground line-through">
            {finalOriginalPrice.toLocaleString()}원
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {(finalOriginalPrice - finalSalePrice).toLocaleString()}원 할인
        </p>
      </div>

      {/* 상품 옵션 */}
      {product.hasOptions && product.options && product.options.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">상품 옵션</h3>
          {product.options
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((option) => (
            <div key={option.id} className="space-y-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">{option.name}</label>
                {option.required && (
                  <span className="text-xs text-red-500">*</span>
                )}
              </div>
              
              {/* 색상 옵션 처리 */}
              {option.type === 'color' ? (
                <div className="flex flex-wrap gap-2">
                  {option.values
                    .filter(value => value.isAvailable && (value.stockQuantity === undefined || value.stockQuantity > 0))
                    .map((value) => (
                    // 색상 코드가 있으면 색상 박스로, 없으면 버튼으로 표시
                    value.colorCode ? (
                      <button
                        key={value.id}
                        onClick={() => handleOptionSelect(option.id, value.id)}
                        className={`w-10 h-10 rounded-lg border-2 relative group ${
                          selectedOptions[option.id] === value.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{
                          backgroundColor: value.colorCode
                        }}
                        title={value.displayName || value.value}
                      >
                        {selectedOptions[option.id] === value.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                          </div>
                        )}
                        {/* 툴팁 */}
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {value.displayName || value.value}
                          {value.stockQuantity !== undefined && ` (재고: ${value.stockQuantity}개)`}
                        </span>
                      </button>
                    ) : (
                      <button
                        key={value.id}
                        onClick={() => handleOptionSelect(option.id, value.id)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          selectedOptions[option.id] === value.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span>{value.displayName || value.value}</span>
                          {value.stockQuantity !== undefined && (
                            <span className="text-xs text-muted-foreground">
                              재고: {value.stockQuantity}개
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  ))}
                </div>
              ) : (
                /* 일반 옵션은 버튼으로 표시 */
                <div className="flex flex-wrap gap-2">
                  {option.values
                    .filter(value => value.isAvailable && (value.stockQuantity === undefined || value.stockQuantity > 0))
                    .map((value) => (
                    <button
                      key={value.id}
                      onClick={() => handleOptionSelect(option.id, value.id)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                        selectedOptions[option.id] === value.id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span>{value.displayName || value.value}</span>
                        <div className="flex items-center space-x-1 text-xs">
                          {value.priceModifier && value.priceModifier !== 0 && (
                            <span>
                              ({value.priceModifier > 0 ? '+' : ''}{value.priceModifier.toLocaleString()}원)
                            </span>
                          )}
                          {value.stockQuantity !== undefined && (
                            <span className="text-muted-foreground">
                              재고: {value.stockQuantity}개
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* 필수 옵션 선택 알림 */}
          {!areRequiredOptionsSelected() && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
              * 표시된 필수 옵션을 모두 선택해주세요.
            </div>
          )}
        </div>
      )}

      {/* 상품 설명 */}
      {product.description && (
        <div>
          <h3 className="text-lg font-medium mb-3">상품 설명</h3>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* 카테고리 및 태그 */}
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium">카테고리: </span>
          <span className="text-sm text-muted-foreground">{product.category}</span>
        </div>
      </div>

      {/* 배송 정보 */}
      <div className="bg-muted p-4 rounded-lg space-y-2">
        <div className="flex items-center space-x-2">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-medium">배송 정보</span>
        </div>
        <p className="text-sm text-muted-foreground">무료배송 • 2-3일 소요</p>
        <p className="text-sm text-muted-foreground">설치 서비스 별도 문의</p>
      </div>
    </div>
  );
}