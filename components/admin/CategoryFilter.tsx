'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

const categories = [
  {
    id: 'all',
    label: '전체 카테고리',
    value: 'all'
  },
  {
    id: 'new',
    label: 'New',
    value: 'new'
  },
  {
    id: 'furniture',
    label: 'Furniture',
    value: 'furniture',
    subcategories: [
      { label: '전체', value: 'furniture' },
      { label: '시팅', value: 'seating' },
      { label: '테이블', value: 'tables' },
      { label: '선반', value: 'shelves' },
      { label: '수납가구', value: 'storage' },
      { label: '모듈가구', value: 'modular' },
      { label: '트롤리', value: 'trolley' },
      { label: '행어/코트랙', value: 'hangers' },
      { label: '거울', value: 'mirrors' },
      { label: '스크린', value: 'screens' },
      { label: '아웃도어', value: 'outdoor-furniture' }
    ]
  },
  {
    id: 'lighting',
    label: 'Lighting',
    value: 'lighting',
    subcategories: [
      { label: '전체', value: 'lighting' },
      { label: '펜던트 램프', value: 'pendant' },
      { label: '실링 램프', value: 'ceiling' },
      { label: '데스크 램프', value: 'desk' },
      { label: '테이블 램프', value: 'table' },
      { label: '플로어 램프', value: 'floor' },
      { label: '월 램프', value: 'wall' },
      { label: '포터블 램프', value: 'portable' },
      { label: '아웃도어 램프', value: 'outdoor-lighting' }
    ]
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    value: 'kitchen',
    subcategories: [
      { label: '전체', value: 'kitchen' },
      { label: '컵시/볼', value: 'bowls' },
      { label: '유리잔/피처', value: 'glassware' },
      { label: '머그/티컵/팟', value: 'mugs-teacups' },
      { label: '커피/티제품', value: 'coffee-tea' },
      { label: '바웨어', value: 'barware' },
      { label: '커틀러리', value: 'cutlery' },
      { label: '과일볼', value: 'fruit-bowls' },
      { label: '주방용품', value: 'kitchen-tools' },
      { label: '냄비/주방용 팩토리', value: 'cookware' },
      { label: '스토리지', value: 'kitchen-storage' },
      { label: '푸드', value: 'food' }
    ]
  },
  {
    id: 'accessories',
    label: 'Accessories',
    value: 'accessories',
    subcategories: [
      { label: '전체', value: 'accessories' },
      { label: '스토리지', value: 'storage-accessories' },
      { label: '거울', value: 'mirrors-accessories' },
      { label: '시계', value: 'clocks' },
      { label: '화병', value: 'vases' },
      { label: '플랜터', value: 'planters' },
      { label: '향/캔들', value: 'candles' },
      { label: '오브제', value: 'objects' },
      { label: '모빌', value: 'mobiles' },
      { label: '보드/자석', value: 'boards' },
      { label: '툴', value: 'tools' },
      { label: '오피스', value: 'office' },
      { label: '욕실', value: 'bathroom' },
      { label: '페이퍼', value: 'paper' },
      { label: '반려동물용품', value: 'pet' },
      { label: '아웃도어', value: 'outdoor-accessories' }
    ]
  },
  {
    id: 'textile',
    label: 'Textile',
    value: 'textile',
    subcategories: [
      { label: '전체', value: 'textile' },
      { label: '원단', value: 'fabric' },
      { label: '쿠션', value: 'cushions' },
      { label: '방석', value: 'cushions-floor' },
      { label: '블랭킷', value: 'blankets' },
      { label: '침실', value: 'bedroom' },
      { label: '욕실', value: 'bathroom-textile' },
      { label: '키친', value: 'kitchen-textile' },
      { label: '러그/매트', value: 'rugs' },
      { label: '파우치/가방', value: 'bags' },
      { label: '브로치/패치', value: 'patches' }
    ]
  },
  {
    id: 'kids',
    label: 'Kids',
    value: 'kids',
    subcategories: [
      { label: '전체', value: 'kids' },
      { label: '어린이 가구', value: 'kids-furniture' },
      { label: '조명', value: 'kids-lighting' },
      { label: '텍스타일', value: 'kids-textile' },
      { label: '어린이 시계', value: 'kids-clocks' },
      { label: '장난감', value: 'toys' },
      { label: '보드/자석', value: 'kids-boards' },
      { label: '데코', value: 'kids-decor' },
      { label: '어린이 식기', value: 'kids-tableware' },
      { label: '문구', value: 'stationery' },
      { label: '도서', value: 'kids-books' }
    ]
  },
  {
    id: 'book',
    label: 'Book',
    value: 'book',
    subcategories: [
      { label: '전체', value: 'book' },
      { label: '아트북', value: 'art-books' },
      { label: '매거진', value: 'magazines' }
    ]
  },
  {
    id: 'sale',
    label: 'Sale',
    value: 'sale',
    subcategories: [
      { label: '전체', value: 'sale' },
      { label: '디스카운트 세일', value: 'discount-sale' },
      { label: '리퍼브 세일', value: 'refurb-sale' },
      { label: '플로어 세일', value: 'floor-sale' },
      { label: '퍼스널 페이먼트', value: 'personal-payment' }
    ]
  }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange, className = '' }: CategoryFilterProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    setActiveDropdown(null);
  };

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory || 
    cat.subcategories?.some(sub => sub.value === selectedCategory));

  return (
    <div ref={containerRef} className={`bg-white border rounded-lg shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b bg-gray-50/50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <span>🏷️</span>
          <span>카테고리 필터</span>
        </h3>
        <p className="text-sm text-gray-600 mt-1">헤더와 동일한 카테고리 구조로 상품을 필터링할 수 있습니다</p>
      </div>
      
      {/* 헤더 스타일 카테고리 네비게이션 */}
      <div className="p-6">
        <nav className="flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="relative"
              onMouseEnter={() => category.subcategories && setActiveDropdown(category.id)}
              onMouseLeave={() => category.subcategories && setActiveDropdown(null)}
            >
              <button
                onClick={() => {
                  if (!category.subcategories) {
                    handleCategoryClick(category.value);
                  }
                }}
                className={`group flex items-center space-x-2 px-4 py-3 text-base font-medium font-serif transition-all duration-200 rounded-lg ${
                  selectedCategory === category.value || 
                  (selectedCategoryData?.id === category.id)
                    ? 'bg-black text-white shadow-md'
                    : category.id === 'sale'
                    ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                    : 'text-gray-700 hover:text-black hover:bg-gray-100'
                }`}
              >
                <span>{category.label}</span>
                {category.subcategories && (
                  <ChevronDown className={`w-4 h-4 transition-all duration-200 ${
                    activeDropdown === category.id ? 'rotate-180' : ''
                  } ${
                    selectedCategory === category.value || (selectedCategoryData?.id === category.id)
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                )}
              </button>

              {/* 헤더 스타일 메가 메뉴 */}
              {category.subcategories && activeDropdown === category.id && (
                <div className="absolute top-full left-0 mt-2 bg-white border shadow-lg rounded-lg z-50 min-w-80 max-w-96">
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">
                        {category.label} 하위 카테고리
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {category.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.value}
                          onClick={() => handleCategoryClick(subcategory.value)}
                          className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${
                            selectedCategory === subcategory.value 
                              ? 'bg-black text-white font-medium'
                              : 'text-gray-600 hover:text-black hover:bg-gray-100'
                          }`}
                        >
                          {subcategory.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* 선택된 카테고리 표시 */}
        {selectedCategory !== 'all' && (
          <div className="mt-6 pt-4 border-t bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">현재 선택:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-black text-white">
                  {selectedCategoryData?.subcategories?.find(sub => sub.value === selectedCategory)?.label ||
                   selectedCategoryData?.label ||
                   selectedCategory}
                </span>
              </div>
              <button
                onClick={() => handleCategoryClick('all')}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                전체 보기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 