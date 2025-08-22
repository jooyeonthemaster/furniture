'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import ProductFilter from '@/components/features/ProductFilter';
import { Product } from '@/types';

// Sale 페이지용 목업 상품 데이터
const saleProducts: Product[] = [
  {
    id: 'sale-1',
    name: 'Herman Miller Aeron Chair 허먼밀러 에어론 체어',
    brand: 'Herman Miller',
    category: 'furniture',
    description: '세계 최고의 인체공학적 오피스 체어. 모델하우스에서 사용된 A급 상품으로 새 제품과 동일한 성능을 자랑합니다.',  
    originalPrice: 1850000,
    salePrice: 925000,
    discount: 50,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&q=80'],
    stock: 3,
    featured: true,
    source: 'model-house',
    tags: ['인체공학', '오피스', '명품'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 245,
    likes: 18,
    colors: ['블랙', '그레이']
  },
  {
    id: 'sale-2',
    name: 'B&B Italia Camaleonda Sofa 카말레온다 소파',
    brand: 'B&B Italia',
    category: 'furniture',
    description: '이탈리아 명품 모듈러 소파. 전시회에서 사용된 프리미엄 패브릭 소파로 자유로운 조합이 가능합니다.',
    originalPrice: 4200000,
    salePrice: 2100000,
    discount: 50,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    stock: 1,
    featured: true,
    source: 'exhibition',
    tags: ['모듈러', '이탈리아', '명품'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 389,
    likes: 42,
    colors: ['베이지', '그레이']
  },
  {
    id: 'sale-3',
    name: 'Tom Dixon Beat Light 톰 딕슨 비트 라이트',
    brand: 'Tom Dixon',
    category: 'lighting',
    description: '영국 디자이너 톰 딕슨의 대표작. 수공예 황동 조명으로 공간에 따뜻한 분위기를 연출합니다.',
    originalPrice: 680000,
    salePrice: 408000,
    discount: 40,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80'],
    stock: 5,
    featured: true,
    source: 'model-house',
    tags: ['조명', '황동', '디자이너'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 156,
    likes: 23,
    colors: ['골드', '브론즈']
  },
  {
    id: 'sale-4',
    name: 'Cassina LC2 Armchair 카시나 LC2 안락의자',
    brand: 'Cassina',
    category: 'furniture',
    description: '르 코르뷔지에가 디자인한 모던 클래식의 걸작. 모델하우스에서 사용된 정품으로 시대를 초월한 디자인입니다.',
    originalPrice: 2400000,
    salePrice: 1440000,
    discount: 40,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    stock: 2,
    featured: true,
    source: 'model-house',
    tags: ['르코르뷔지에', '클래식', '명품'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 298,
    likes: 35,
    colors: ['블랙', '화이트']
  },
  {
    id: 'sale-5',
    name: 'Poliform Varenna Kitchen 폴리폼 바레나 키친',
    brand: 'Poliform',
    category: 'kitchen',
    description: '이탈리아 프리미엄 주방 시스템. 모델하우스에서 사용된 완벽한 상태의 맞춤 키친입니다.',
    originalPrice: 8500000,
    salePrice: 4250000,
    discount: 50,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    stock: 1,
    featured: true,
    source: 'model-house',
    tags: ['주방', '시스템', '맞춤제작'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 445,
    likes: 67,
    colors: ['화이트', '우드']
  },
  {
    id: 'sale-6',
    name: 'Flos Arco Floor Lamp 플로스 아르코 플로어 램프',
    brand: 'Flos',
    category: 'lighting',
    description: '이탈리아 명품 조명 브랜드 플로스의 아이코닉한 아르코 램프. 대리석 베이스와 스테인리스 스틸 아암의 조화가 아름답습니다.',
    originalPrice: 2800000,
    salePrice: 1680000,
    discount: 40,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'],
    stock: 2,
    featured: true,
    source: 'exhibition',
    tags: ['플로어램프', '대리석', '이탈리아'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 234,
    likes: 31,
    colors: ['화이트', '블랙']
  },
  {
    id: 'sale-7',
    name: 'Kartell Ghost Chair 카르텔 고스트 체어',
    brand: 'Kartell',
    category: 'furniture',
    description: '필리프 스타크가 디자인한 투명 의자의 혁신. 공간에 가벼움과 모던함을 더하는 디자인 아이콘입니다.',
    originalPrice: 420000,
    salePrice: 252000,
    discount: 40,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80'],
    stock: 8,
    featured: true,
    source: 'model-house',
    tags: ['투명', '필리프스타크', '의자'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 167,
    likes: 19,
    colors: ['투명', '스모크']
  },
  {
    id: 'sale-8',
    name: 'Alessi Kitchen Accessories 알레시 키친 액세서리',
    brand: 'Alessi',
    category: 'accessories',
    description: '이탈리아 디자인 하우스 알레시의 키친 액세서리 세트. 기능성과 아름다움을 겸비한 디자인입니다.',
    originalPrice: 180000,
    salePrice: 108000,
    discount: 40,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    stock: 12,
    featured: false,
    source: 'model-house',
    tags: ['키친', '액세서리', '이탈리아'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 89,
    likes: 12,
    colors: ['스테인리스', '블랙']
  }
];

export default function SalePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    // 목업 데이터 로드 시뮬레이션
    const loadProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
        setAllProducts(saleProducts);
        setFilteredProducts(saleProducts);
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
            <p>특가 상품을 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-gradient-to-b from-red-50 to-background">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4 text-red-600"
          >
            SALE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            쓸만한 가의 특가 세일! 최대 50% 할인된 프리미엄 가구를 만나보세요
          </motion.p>

          {/* 할인 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-12"
          >
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light text-red-600">50%</div>
              <div className="text-sm opacity-60">최대 할인</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light text-red-600">
                {saleProducts.length}
              </div>
              <div className="text-sm opacity-60">특가 상품</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light text-red-600">A급</div>
              <div className="text-sm opacity-60">품질 보증</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <ProductFilter
        products={allProducts}
        onFilteredProductsChange={setFilteredProducts}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        category="sale"
      />

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
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
                className="group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
              >
                <Link href={`/products/${product.id}`} className="block">
                  <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-gray-50 mb-3">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* 할인 뱃지 */}
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {product.discount}% OFF
                    </div>
                    
                    {/* 상태 뱃지 */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full text-white shadow-sm ${
                        product.condition === 'new' ? 'bg-emerald-500' :
                        product.condition === 'like-new' ? 'bg-blue-500' :
                        product.condition === 'excellent' ? 'bg-amber-500' :
                        'bg-orange-500'
                      }`}>
                        {product.condition === 'new' ? '신품' :
                         product.condition === 'like-new' ? 'A급' :
                         product.condition === 'excellent' ? 'B급' : 'C급'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    
                    {/* 색상 표시 */}
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
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-end justify-between pt-1">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400 line-through">
                          ₩{product.originalPrice.toLocaleString()}
                        </div>
                        <div className="font-semibold text-red-600">
                          ₩{product.salePrice.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700">
                          재고 {product.stock}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xs:py-12 px-4 bg-red-50">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl xs:text-2xl font-light mb-4 text-red-600">
              놓치면 후회하는 특가!
            </h2>
            <p className="text-lg xs:text-base opacity-70 mb-8">
              한정 수량, 한정 기간! 지금 바로 쓸만한 가의 특가 혜택을 누리세요
            </p>
            <Link
              href="/special"
              className="inline-flex items-center px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              더 많은 기획전 보기
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}