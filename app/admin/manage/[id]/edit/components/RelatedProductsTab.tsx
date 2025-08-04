'use client';

import { useState } from 'react';
import { Search, Link2, X } from 'lucide-react';
import Image from 'next/image';
import CategoryFilter from '@/components/admin/CategoryFilter';
import { getProductsByCategory, searchProducts } from '@/lib/products';
import { Product } from '@/types';
import { ProductForm } from '../types';

interface RelatedProductsTabProps {
  form: ProductForm;
  handleInputChange: (field: string, value: any) => void;
  productId: string;
}

export default function RelatedProductsTab({
  form,
  handleInputChange,
  productId
}: RelatedProductsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchRelatedProducts = async () => {
    if (!searchTerm.trim() && !selectedCategory) return;
    
    setIsSearching(true);
    try {
      let results: Product[] = [];
      
      if (selectedCategory && !searchTerm.trim()) {
        // 카테고리별 검색
        results = await getProductsByCategory(selectedCategory, productId);
      } else if (searchTerm.trim()) {
        // 텍스트 검색
        results = await searchProducts(searchTerm, selectedCategory || undefined);
        // 현재 편집 중인 상품 제외
        results = results.filter(product => product.id !== productId);
      }
      
      setSearchResults(results);
    } catch (error) {
      console.error('연계 상품 검색 실패:', error);
      alert('연계 상품 검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const addRelatedProduct = (productId: string) => {
    if (!form.relatedProducts.includes(productId)) {
      handleInputChange('relatedProducts', [...form.relatedProducts, productId]);
    }
  };

  const removeRelatedProduct = (productId: string) => {
    handleInputChange('relatedProducts', form.relatedProducts.filter(id => id !== productId));
  };

  return (
    <div className="space-y-6">
      {/* 검색 섹션 */}
      <div className="bg-card rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center space-x-2">
          <Link2 className="w-5 h-5" />
          <span>연계 상품 검색</span>
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 검색어 입력 */}
            <div>
              <label className="block text-sm font-medium mb-2">검색어</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchRelatedProducts()}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="상품명, 브랜드로 검색..."
              />
            </div>
            
            {/* 검색 버튼 */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={searchRelatedProducts}
                disabled={isSearching || (!searchTerm.trim() && !selectedCategory)}
                className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? '검색 중...' : '검색'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 검색 결과 */}
      {searchResults.length > 0 && (
        <div className="bg-card rounded-lg border p-6">
          <h4 className="text-md font-medium mb-4">검색 결과 ({searchResults.length}개)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="relative w-full h-24 bg-muted rounded mb-3">
                  <Image
                    src={product.images[0] || '/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <h5 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h5>
                <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {product.salePrice.toLocaleString()}원
                  </span>
                  <button
                    type="button"
                    onClick={() => addRelatedProduct(product.id)}
                    disabled={form.relatedProducts.includes(product.id)}
                    className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 disabled:opacity-50"
                  >
                    {form.relatedProducts.includes(product.id) ? '선택됨' : '선택'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 선택된 연계 상품 목록 */}
      {form.relatedProducts.length > 0 && (
        <div className="bg-card rounded-lg border p-6">
          <h4 className="text-md font-medium mb-4">선택된 연계 상품 ({form.relatedProducts.length}개)</h4>
          <div className="space-y-3">
            {form.relatedProducts.map((productId) => (
              <div key={productId} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-muted rounded"></div>
                  <span className="text-sm font-medium">상품 ID: {productId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeRelatedProduct(productId)}
                  className="text-red-500 hover:bg-red-100 p-2 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}