'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getPrimaryImageUrl } from '@/utils';
import Link from 'next/link';
import { Grid3X3, List, ChefHat } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

// 주방 & 식당 카테고리 목업 데이터
const kitchenMockData: Product[] = [
  {
    id: 'kitchen-1',
    name: 'Poliform Varenna Kitchen System 폴리폼 바레나 키친',
    brand: 'Poliform',
    category: 'kitchen',
    description: '이탈리아 프리미엄 주방 시스템. 모든 수납공간이 완벽하게 설계된 맞춤형 키친입니다.',
    originalPrice: 12000000,
    salePrice: 7200000,
    discount: 40,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    stock: 1,
    featured: true,
    source: 'model-house',
    tags: ['시스템키친', '맞춤제작', '이탈리아'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 567,
    likes: 43,
    colors: ['화이트', '우드']
  },
  {
    id: 'kitchen-2',
    name: 'Bulthaup B3 Kitchen Island 불타웁 B3 키친 아일랜드',
    brand: 'Bulthaup',
    category: 'kitchen',
    description: '독일 프리미엄 브랜드 불타웁의 키친 아일랜드. 기능성과 미학이 완벽하게 조화된 작품입니다.',
    originalPrice: 8500000,
    salePrice: 5950000,
    discount: 30,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    stock: 1,
    featured: true,
    source: 'model-house',
    tags: ['키친아일랜드', '독일', '프리미엄'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 423,
    likes: 38,
    colors: ['스테인리스', '우드']
  },
  {
    id: 'kitchen-3',
    name: 'Cassina Dining Table 카시나 다이닝 테이블',
    brand: 'Cassina',
    category: 'kitchen',
    description: '이탈리아 카시나의 우아한 다이닝 테이블. 견고한 원목과 세련된 디자인이 돋보이는 식탁입니다.',
    originalPrice: 2800000,
    salePrice: 1960000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 2,
    featured: true,
    source: 'exhibition',
    tags: ['다이닝테이블', '원목', '이탈리아'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 289,
    likes: 25,
    colors: ['월넛', '오크']
  },
  {
    id: 'kitchen-4',
    name: 'Vitra Dining Chairs Set 비트라 다이닝 체어 세트',
    brand: 'Vitra',
    category: 'kitchen',
    description: '스위스 비트라의 다이닝 체어 4개 세트. 편안함과 내구성을 모두 갖춘 완벽한 식탁 의자입니다.',
    originalPrice: 1600000,
    salePrice: 1120000,
    discount: 30,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 1,
    featured: false,
    source: 'model-house',
    tags: ['다이닝체어', '세트', '스위스'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 234,
    likes: 19,
    colors: ['블랙', '화이트', '우드']
  },
  {
    id: 'kitchen-5',
    name: 'Alessi Kitchen Accessories Set 알레시 키친 세트',
    brand: 'Alessi',
    category: 'kitchen',
    description: '이탈리아 알레시의 키친 액세서리 풀세트. 기능적이면서도 아름다운 디자인의 주방용품들입니다.',
    originalPrice: 450000,
    salePrice: 315000,
    discount: 30,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    stock: 5,
    featured: false,
    source: 'model-house',
    tags: ['키친웨어', '세트', '이탈리아'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 156,
    likes: 14,
    colors: ['스테인리스', '블랙']
  },
  {
    id: 'kitchen-6',
    name: 'Kartell Bar Stools 카르텔 바 스툴',
    brand: 'Kartell',
    category: 'kitchen',
    description: '필리프 스타크가 디자인한 투명 바 스툴. 키친 아일랜드나 바 테이블에 완벽한 조합입니다.',
    originalPrice: 680000,
    salePrice: 476000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 4,
    featured: false,
    source: 'model-house',
    tags: ['바스툴', '투명', '필리프스타크'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 123,
    likes: 16,
    colors: ['투명', '스모크']
  }
];

export default function KitchenPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('인기순');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        // 주방 관련 상품들 필터링
        const kitchenProducts = allProducts.filter(product => 
          product.category === 'kitchen' ||
          product.name.includes('주방') || 
          product.name.includes('컵') || 
          product.name.includes('그릇') || 
          product.name.includes('접시') ||
          product.name.includes('식기') ||
          product.name.includes('볼') ||
          product.name.includes('머그') ||
          product.name.includes('식탁') ||
          product.name.includes('다이닝') ||
          product.name.includes('키친')
        );
        
        // 실제 데이터가 없으면 목업 데이터 사용
        const finalProducts = kitchenProducts.length > 0 ? kitchenProducts : kitchenMockData;
        setProducts(finalProducts);
        setFilteredProducts(finalProducts);
      } catch (error) {
        console.error('상품 로드 실패, 목업 데이터 사용:', error);
        setProducts(kitchenMockData);
        setFilteredProducts(kitchenMockData);
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center mb-6"
          >
            <ChefHat className="w-16 h-16 text-orange-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4 font-serif"
          >
            주방 & 식당
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            일상의 요리를 특별하게 만드는 프리미엄 주방용품
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">주방용품 {filteredProducts.length}개</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-foreground text-background' : ''}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-foreground text-background' : ''}`}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:border-foreground"
              >
                <option value="인기순">인기순</option>
                <option value="가격낮은순">가격 낮은순</option>
                <option value="가격높은순">가격 높은순</option>
                <option value="최신순">최신순</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg opacity-60">등록된 주방용품이 없습니다.</p>
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
                  <Link href={`/products/${product.id}`}>
                    <div className={`
                      ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'aspect-[4/5] mb-3'}
                      relative overflow-hidden rounded-lg bg-gray-50
                    `}>
                      <Image
                        src={getPrimaryImageUrl(product as any)}
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