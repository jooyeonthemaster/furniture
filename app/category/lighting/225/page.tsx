'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getPrimaryImageUrl } from '@/utils';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import ProductFilter from '@/components/features/ProductFilter';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

// 조명 카테고리 목업 데이터
const lightingMockData: Product[] = [
  {
    id: 'lighting-1',
    name: 'Tom Dixon Beat Light Tall 톰 딕슨 비트 라이트 톨',
    brand: 'Tom Dixon',
    category: 'lighting',
    description: '수공예 황동으로 제작된 톰 딕슨의 대표작. 따뜻하고 부드러운 빛으로 공간에 고급스러운 분위기를 연출합니다.',
    originalPrice: 850000,
    salePrice: 510000,
    discount: 40,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80'],
    stock: 3,
    featured: true,
    source: 'model-house',
    tags: ['펜던트', '황동', '디자이너'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 234,
    likes: 18,
    colors: ['골드', '브론즈']
  },
  {
    id: 'lighting-2',
    name: 'Flos Arco Floor Lamp 플로스 아르코 플로어 램프',
    brand: 'Flos',
    category: 'lighting',
    description: '이탈리아 명품 조명의 아이콘. 대리석 베이스와 스테인리스 스틸 아암의 완벽한 조화로 공간에 우아함을 더합니다.',
    originalPrice: 3200000,
    salePrice: 1920000,
    discount: 40,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'],
    stock: 2,
    featured: true,
    source: 'exhibition',
    tags: ['플로어램프', '대리석', '이탈리아'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 456,
    likes: 32,
    colors: ['화이트', '블랙']
  },
  {
    id: 'lighting-3',
    name: 'Louis Poulsen PH5 루이스 폴센 PH5',
    brand: 'Louis Poulsen',
    category: 'lighting',
    description: '덴마크 디자인의 걸작. 눈부심 없는 완벽한 조명 설계로 식탁 위 조명의 표준이 된 제품입니다.',
    originalPrice: 680000,
    salePrice: 476000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80'],
    stock: 5,
    featured: true,
    source: 'model-house',
    tags: ['펜던트', '덴마크', '클래식'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 189,
    likes: 24,
    colors: ['화이트', '레드', '그린']
  },
  {
    id: 'lighting-4',
    name: 'Artemide Tolomeo Table Lamp 아르테미데 톨로메오',
    brand: 'Artemide',
    category: 'lighting',
    description: '이탈리아 아르테미데의 베스트셀러. 각도 조절이 자유로운 태스크 램프로 작업 공간에 최적화되어 있습니다.',
    originalPrice: 420000,
    salePrice: 294000,
    discount: 30,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80'],
    stock: 4,
    featured: false,
    source: 'model-house',
    tags: ['테이블램프', '조절가능', '이탈리아'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 123,
    likes: 15,
    colors: ['실버', '블랙']
  },
  {
    id: 'lighting-5',
    name: 'Foscarini Twiggy Floor Lamp 포스카리니 트위기',
    brand: 'Foscarini',
    category: 'lighting',
    description: '마크 사들러가 디자인한 혁신적인 플로어 램프. 가벼운 소재로 만든 대형 조명으로 공간에 극적인 효과를 연출합니다.',
    originalPrice: 1200000,
    salePrice: 840000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'],
    stock: 2,
    featured: false,
    source: 'exhibition',
    tags: ['플로어램프', '대형', '혁신적'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 167,
    likes: 21,
    colors: ['화이트', '블랙', '레드']
  },
  {
    id: 'lighting-6',
    name: 'Muuto Fluid Pendant 무토 플루이드 펜던트',
    brand: 'Muuto',
    category: 'lighting',
    description: '덴마크 브랜드 무토의 유기적인 형태의 펜던트 조명. 부드러운 곡선으로 공간에 따뜻함을 더합니다.',
    originalPrice: 380000,
    salePrice: 266000,
    discount: 30,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80'],
    stock: 6,
    featured: false,
    source: 'model-house',
    tags: ['펜던트', '유기적', '덴마크'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 98,
    likes: 12,
    colors: ['베이지', '그레이']
  },
  {
    id: 'lighting-7',
    name: 'Vitra Akari Light Sculpture 비트라 아카리',
    brand: 'Vitra',
    category: 'lighting',
    description: '이사무 노구치가 디자인한 일본 전통 등의 현대적 해석. 종이와 대나무로 만든 조각 같은 조명입니다.',
    originalPrice: 320000,
    salePrice: 224000,
    discount: 30,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80'],
    stock: 8,
    featured: false,
    source: 'model-house',
    tags: ['테이블램프', '일본', '종이'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 145,
    likes: 19,
    colors: ['화이트', '내추럴']
  },
  {
    id: 'lighting-8',
    name: 'Hay Matin Table Lamp 헤이 마틴 테이블 램프',
    brand: 'HAY',
    category: 'lighting',
    description: '덴마크 HAY의 미니멀한 테이블 램프. 간결한 형태와 부드러운 빛으로 침실이나 거실에 완벽합니다.',
    originalPrice: 180000,
    salePrice: 126000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80'],
    stock: 10,
    featured: false,
    source: 'model-house',
    tags: ['테이블램프', '미니멀', '덴마크'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 87,
    likes: 11,
    colors: ['베이지', '블랙']
  }
];

export default function LightingPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // 실제 데이터와 목업 데이터 조합
        const products = await getAllProducts();
        const lightingProducts = products.filter(product => 
          product.category === 'lighting' ||
          product.name.includes('조명') || 
          product.name.includes('램프') || 
          product.name.includes('라이트') ||
          product.name.includes('스탠드')
        );
        
        // 실제 데이터가 없으면 목업 데이터 사용
        const finalProducts = lightingProducts.length > 0 ? lightingProducts : lightingMockData;
        setAllProducts(finalProducts);
        setFilteredProducts(finalProducts);
      } catch (error) {
        console.error('상품 로드 실패, 목업 데이터 사용:', error);
        setAllProducts(lightingMockData);
        setFilteredProducts(lightingMockData);
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
            조명
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            쓸만한 가의 세련된 조명으로 공간에 특별한 분위기를 연출하세요
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <ProductFilter
        products={allProducts}
        onFilteredProductsChange={setFilteredProducts}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        category="lighting"
      />

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg opacity-60">조건에 맞는 조명이 없습니다.</p>
              <p className="text-sm opacity-40 mt-2">필터를 조정해보세요.</p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8' 
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
                    ${viewMode === 'list' ? 'flex space-x-6 p-6 border rounded-lg hover:shadow-md transition-shadow' : 'hover:scale-[1.02] transition-transform duration-300'}
                  `}
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className={`
                      ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-[4/5] mb-3'}
                      relative overflow-hidden rounded-lg bg-gray-50
                    `}>
                      <Image
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* 할인 뱃지 */}
                      {product.originalPrice && product.originalPrice > product.salePrice && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                          {Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                      
                      {/* 상태 뱃지 */}
                      <div className="absolute top-3 left-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full text-white shadow-sm ${
                          product.condition === 'new' ? 'bg-emerald-500' :
                          product.condition === 'like-new' ? 'bg-blue-500' :
                          product.condition === 'excellent' ? 'bg-amber-500' :
                          product.condition === 'good' ? 'bg-orange-500' : 'bg-gray-500'
                        }`}>
                          {product.condition === 'new' ? '신품' :
                           product.condition === 'like-new' ? 'A급' :
                           product.condition === 'excellent' ? 'B급' :
                           product.condition === 'good' ? 'C급' : 'D급'}
                        </span>
                      </div>

                      {/* 재고 부족 오버레이 */}
                      {(product.availability !== 'in_stock' || product.stock <= 0) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-medium text-sm bg-black/70 px-3 py-1 rounded">품절</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`${viewMode === 'list' ? 'flex-1' : 'space-y-2'}`}>
                      {/* 브랜드 */}
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {product.brand}
                      </p>
                      
                      {/* 상품명 - 텍스트 크기 축소 및 줄 높이 조정 */}
                      <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      
                      {/* 색상 표시 - 더 컴팩트하게 */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-400">색상:</span>
                          <div className="flex space-x-1">
                            {product.colors.slice(0, 2).map((color, colorIndex) => (
                              <span 
                                key={colorIndex}
                                className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize"
                              >
                                {color}
                              </span>
                            ))}
                            {product.colors.length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{product.colors.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* 가격 및 재고 정보 */}
                      <div className="flex items-end justify-between pt-1">
                        <div className="space-y-1">
                          {product.originalPrice && product.originalPrice > product.salePrice && (
                            <div className="text-xs text-gray-400 line-through">
                              ₩{product.originalPrice.toLocaleString()}
                            </div>
                          )}
                          <div className="font-semibold text-gray-900">
                            ₩{product.salePrice.toLocaleString()}
                          </div>
                        </div>
                        
                        {/* 재고 및 평점 */}
                        <div className="text-right space-y-1">
                          <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            product.availability === 'in_stock' && product.stock > 0
                              ? 'bg-emerald-50 text-emerald-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {product.availability === 'in_stock' && product.stock > 0 
                              ? `재고 ${product.stock}` 
                              : '품절'
                            }
                          </div>
                          
                          {/* 평점 표시 */}
                          {product.rating && (
                            <div className="text-xs text-gray-400 flex items-center justify-end space-x-1">
                              <span>⭐</span>
                              <span>{product.rating.toFixed(1)}</span>
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