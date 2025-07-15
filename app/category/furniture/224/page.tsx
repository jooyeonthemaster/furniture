'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import ProductFilter from '@/components/features/ProductFilter';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

export default function FurniturePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getAllProducts();
        // 가구 관련 상품들 필터링 (새로운 카테고리 시스템에 맞춰 업데이트)
        const furnitureProducts = products.filter(product => 
          product.category === 'furniture' ||
          // 레거시 카테고리 지원 (타입 안전성을 위해 문자열 비교)
          (product.category as string) === 'seating' || 
          (product.category as string) === 'tables' ||
          (product.category as string) === 'storage' ||
          product.name.includes('의자') || 
          product.name.includes('소파') || 
          product.name.includes('테이블')
        );
        setAllProducts(furnitureProducts);
        setFilteredProducts(furnitureProducts);
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
            <p>상품을 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4 font-serif"
          >
            Furniture
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            당신의 공간을 완성하는 프리미엄 가구 컬렉션
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <ProductFilter
        products={allProducts}
        onFilteredProductsChange={setFilteredProducts}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        category="furniture"
      />

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg opacity-60">조건에 맞는 가구가 없습니다.</p>
              <p className="text-sm opacity-40 mt-2">필터를 조정해보세요.</p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8' 
                : 'space-y-6'
              }
            `}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    group cursor-pointer
                    ${viewMode === 'list' ? 'flex space-x-6 p-6 border rounded-lg hover:shadow-md transition-shadow' : ''}
                  `}
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className={`
                      ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-square mb-4'}
                      relative overflow-hidden rounded-lg
                    `}>
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* 할인 뱃지 */}
                      {product.originalPrice && product.originalPrice > product.salePrice && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          {Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                      
                      {/* 상태 뱃지 */}
                      <div className="absolute top-2 left-2">
                        <span className={`text-xs px-2 py-1 rounded text-white ${
                          product.condition === 'new' ? 'bg-green-500' :
                          product.condition === 'like-new' ? 'bg-blue-500' :
                          product.condition === 'excellent' ? 'bg-yellow-500' :
                          product.condition === 'good' ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                          {product.condition === 'new' ? '신품' :
                           product.condition === 'like-new' ? 'A급' :
                           product.condition === 'excellent' ? 'B급' :
                           product.condition === 'good' ? 'C급' : 'D급'}
                        </span>
                      </div>
                    </div>
                    
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className="font-medium mb-2 group-hover:text-foreground/80 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.brand}
                      </p>
                      
                      {/* 색상 표시 */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-1 mb-2">
                          <span className="text-xs text-muted-foreground">색상:</span>
                          <div className="flex space-x-1">
                            {product.colors.slice(0, 3).map((color, colorIndex) => (
                              <span 
                                key={colorIndex}
                                className="text-xs bg-muted px-1.5 py-0.5 rounded capitalize"
                              >
                                {color}
                              </span>
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{product.colors.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {product.originalPrice && product.originalPrice > product.salePrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              ₩{product.originalPrice.toLocaleString()}
                            </div>
                          )}
                          <div className="font-semibold text-lg">
                            ₩{product.salePrice.toLocaleString()}
                          </div>
                        </div>
                        
                        {/* 재고 상태 */}
                        <div className="text-right">
                          <div className={`text-xs px-2 py-1 rounded ${
                            product.availability === 'in_stock' && product.stock > 0
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.availability === 'in_stock' && product.stock > 0 
                              ? `재고 ${product.stock}개` 
                              : '품절'
                            }
                          </div>
                          
                          {/* 평점 표시 */}
                          {product.rating && (
                            <div className="text-xs text-muted-foreground mt-1">
                              ⭐ {product.rating.toFixed(1)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
} 