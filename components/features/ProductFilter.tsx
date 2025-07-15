'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Grid3X3, 
  List,
  ArrowUpDown,
  Sliders
} from 'lucide-react';
import { Product } from '@/types';

interface FilterState {
  sortBy: string;
  priceRange: [number, number];
  conditions: string[];
  colors: string[];
  brands: string[];
  categories: string[];
  inStock: boolean;
}

interface ProductFilterProps {
  products: Product[];
  onFilteredProductsChange: (products: Product[]) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
  category?: string;
}

const initialFilterState: FilterState = {
  sortBy: '인기순',
  priceRange: [0, 5000000],
  conditions: [],
  colors: [],
  brands: [],
  categories: [],
  inStock: false
};

const sortOptions = [
  { value: '인기순', label: '인기순' },
  { value: '최신순', label: '최신순' },
  { value: '가격낮은순', label: '가격 낮은순' },
  { value: '가격높은순', label: '가격 높은순' },
  { value: '할인율순', label: '할인율 높은순' },
  { value: '평점순', label: '평점 높은순' }
];

const conditionOptions = [
  { value: 'new', label: '신품' },
  { value: 'like-new', label: 'A급 (최상)' },
  { value: 'excellent', label: 'B급 (상)' },
  { value: 'good', label: 'C급 (중)' },
  { value: 'fair', label: 'D급 (하)' }
];

export default function ProductFilter({
  products,
  onFilteredProductsChange,
  onViewModeChange,
  viewMode,
  category
}: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    condition: true,
    color: false,
    brand: false
  });

  // 상품에서 고유한 값들 추출
  const uniqueColors = [...new Set(products.flatMap(p => p.colors || []))].filter(Boolean);
  const uniqueBrands = [...new Set(products.map(p => p.brand))].filter(Boolean);
  const maxPrice = Math.max(...products.map(p => p.salePrice));

  // 필터 상태 초기화
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [0, maxPrice || 5000000]
    }));
  }, [maxPrice]);

  // 필터링 및 정렬 로직
  useEffect(() => {
    let filtered = [...products];

    // 가격 범위 필터
    filtered = filtered.filter(product => 
      product.salePrice >= filters.priceRange[0] && 
      product.salePrice <= filters.priceRange[1]
    );

    // 상태 필터
    if (filters.conditions.length > 0) {
      filtered = filtered.filter(product => 
        filters.conditions.includes(product.condition)
      );
    }

    // 색상 필터
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors?.some(color => filters.colors.includes(color))
      );
    }

    // 브랜드 필터
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    // 재고 있음 필터
    if (filters.inStock) {
      filtered = filtered.filter(product => 
        product.stock > 0 && product.availability === 'in_stock'
      );
    }

    // 정렬
    switch (filters.sortBy) {
      case '최신순':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case '가격낮은순':
        filtered.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case '가격높은순':
        filtered.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case '할인율순':
        filtered.sort((a, b) => {
          const discountA = a.originalPrice ? (1 - a.salePrice / a.originalPrice) * 100 : 0;
          const discountB = b.originalPrice ? (1 - b.salePrice / b.originalPrice) * 100 : 0;
          return discountB - discountA;
        });
        break;
      case '평점순':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // 인기순
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    onFilteredProductsChange(filtered);
  }, [products, filters, onFilteredProductsChange]);

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterToggle = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  };

  const resetFilters = () => {
    setFilters({
      ...initialFilterState,
      priceRange: [0, maxPrice || 5000000]
    });
  };

  const activeFilterCount = 
    (filters.conditions.length > 0 ? 1 : 0) +
    (filters.colors.length > 0 ? 1 : 0) +
    (filters.brands.length > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="border-b bg-background sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        {/* 상단 컨트롤 바 */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">
              총 {products.length}개 상품
            </span>
            {activeFilterCount > 0 && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                {activeFilterCount}개 필터 적용됨
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* 필터 토글 버튼 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              <Sliders size={16} />
              <span className="text-sm">필터</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* 정렬 */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* 보기 모드 전환 */}
            <div className="flex border rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-foreground text-background' 
                    : 'hover:bg-muted'
                }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-foreground text-background' 
                    : 'hover:bg-muted'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 필터 패널 */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-6 pb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* 가격 범위 */}
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleSection('price')}
                      className="flex items-center justify-between w-full text-sm font-medium"
                    >
                      <span>가격 범위</span>
                      {expandedSections.price ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                      }
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.price && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden space-y-3"
                        >
                          <div className="space-y-2">
                            <input
                              type="range"
                              min={0}
                              max={maxPrice}
                              step={10000}
                              value={filters.priceRange[1]}
                              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                              className="w-full accent-primary"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>₩0</span>
                              <span>₩{maxPrice.toLocaleString()}</span>
                            </div>
                            <div className="text-sm font-medium">
                              ₩{filters.priceRange[0].toLocaleString()} - ₩{filters.priceRange[1].toLocaleString()}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 상품 상태 */}
                  <div className="space-y-3">
                    <button
                      onClick={() => toggleSection('condition')}
                      className="flex items-center justify-between w-full text-sm font-medium"
                    >
                      <span>상품 상태</span>
                      {expandedSections.condition ? 
                        <ChevronUp size={16} /> : 
                        <ChevronDown size={16} />
                      }
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.condition && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden space-y-2"
                        >
                          {conditionOptions.map(option => (
                            <label key={option.value} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={filters.conditions.includes(option.value)}
                                onChange={() => handleArrayFilterToggle('conditions', option.value)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 색상 */}
                  {uniqueColors.length > 0 && (
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleSection('color')}
                        className="flex items-center justify-between w-full text-sm font-medium"
                      >
                        <span>색상</span>
                        {expandedSections.color ? 
                          <ChevronUp size={16} /> : 
                          <ChevronDown size={16} />
                        }
                      </button>
                      
                      <AnimatePresence>
                        {expandedSections.color && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden space-y-2 max-h-32 overflow-y-auto"
                          >
                            {uniqueColors.map(color => (
                              <label key={color} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={filters.colors.includes(color)}
                                  onChange={() => handleArrayFilterToggle('colors', color)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm capitalize">{color}</span>
                              </label>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* 브랜드 */}
                  {uniqueBrands.length > 0 && (
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleSection('brand')}
                        className="flex items-center justify-between w-full text-sm font-medium"
                      >
                        <span>브랜드</span>
                        {expandedSections.brand ? 
                          <ChevronUp size={16} /> : 
                          <ChevronDown size={16} />
                        }
                      </button>
                      
                      <AnimatePresence>
                        {expandedSections.brand && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden space-y-2 max-h-32 overflow-y-auto"
                          >
                            {uniqueBrands.map(brand => (
                              <label key={brand} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={filters.brands.includes(brand)}
                                  onChange={() => handleArrayFilterToggle('brands', brand)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm">{brand}</span>
                              </label>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>

                {/* 추가 옵션 */}
                <div className="mt-6 pt-4 border-t">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm">재고 있음만 보기</span>
                    </label>

                    {activeFilterCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
                      >
                        모든 필터 초기화
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 