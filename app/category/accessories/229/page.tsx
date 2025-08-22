'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { getPrimaryImageUrl } from '@/utils';
import Link from 'next/link';
import { Grid3X3, List, Sparkles } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

// 액세서리 카테고리 목업 데이터
const accessoriesMockData: Product[] = [
  {
    id: 'acc-1',
    name: 'Alessi Juicy Salif Citrus Squeezer 알레시 주시 살리프',
    brand: 'Alessi',
    category: 'accessories',
    description: '필리프 스타크가 디자인한 아이코닉한 레몬 짜개. 기능을 넘어선 조각품 같은 키친 액세서리입니다.',
    originalPrice: 180000,
    salePrice: 126000,
    discount: 30,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    stock: 8,
    featured: true,
    source: 'model-house',
    tags: ['키친', '필리프스타크', '아이코닉'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 234,
    likes: 28,
    colors: ['스테인리스']
  },
  {
    id: 'acc-2',
    name: 'Vitra Wooden Dolls 비트라 우든 돌',
    brand: 'Vitra',
    category: 'accessories',
    description: '알렉산더 지라드가 디자인한 나무 인형 컬렉션. 공간에 따뜻함과 개성을 더하는 디자인 오브제입니다.',
    originalPrice: 120000,
    salePrice: 84000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 12,
    featured: true,
    source: 'model-house',
    tags: ['오브제', '나무', '컬렉션'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 189,
    likes: 22,
    colors: ['내추럴', '컬러풀']
  },
  {
    id: 'acc-3',
    name: 'Kartell Bookworm Shelf 카르텔 북웜 선반',
    brand: 'Kartell',
    category: 'accessories',
    description: '론 아라드가 디자인한 구불구불한 책장. 벽에 자유롭게 설치하여 독특한 인테리어 포인트를 만들 수 있습니다.',
    originalPrice: 850000,
    salePrice: 595000,
    discount: 30,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 3,
    featured: true,
    source: 'exhibition',
    tags: ['선반', '벽걸이', '유니크'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 345,
    likes: 31,
    colors: ['화이트', '블랙', '레드']
  },
  {
    id: 'acc-4',
    name: 'Hay Kaleido Tray 헤이 칼레이도 트레이',
    brand: 'HAY',
    category: 'accessories',
    description: '덴마크 HAY의 기하학적 패턴 트레이. 다양한 크기와 컬러로 스타일링의 재미를 더하는 액세서리입니다.',
    originalPrice: 45000,
    salePrice: 31500,
    discount: 30,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 15,
    featured: false,
    source: 'model-house',
    tags: ['트레이', '기하학', '컬러풀'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 98,
    likes: 12,
    colors: ['핑크', '블루', '옐로우']
  },
  {
    id: 'acc-5',
    name: 'Muuto Dots Coat Hooks 무토 닷츠 코트 훅',
    brand: 'Muuto',
    category: 'accessories',
    description: '덴마크 무토의 미니멀한 벽걸이 훅. 다양한 크기와 컬러로 벽면을 아름답게 장식하면서 실용성도 갖춘 제품입니다.',
    originalPrice: 25000,
    salePrice: 17500,
    discount: 30,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 20,
    featured: false,
    source: 'model-house',
    tags: ['벽걸이', '훅', '미니멀'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 156,
    likes: 18,
    colors: ['화이트', '블랙', '우드']
  },
  {
    id: 'acc-6',
    name: 'Iittala Aalto Vase 이딸라 알토 화병',
    brand: 'Iittala',
    category: 'accessories',
    description: '알바 알토가 디자인한 핀란드의 대표적인 유리 화병. 유기적인 곡선이 아름다운 시대를 초월한 디자인입니다.',
    originalPrice: 180000,
    salePrice: 126000,
    discount: 30,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 6,
    featured: false,
    source: 'exhibition',
    tags: ['화병', '유리', '핀란드'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 167,
    likes: 21,
    colors: ['클리어', '블루', '그린']
  },
  {
    id: 'acc-7',
    name: 'Georg Jensen Cobra Candleholder 게오르그 옌센 코브라',
    brand: 'Georg Jensen',
    category: 'accessories',
    description: '덴마크 실버스미스 게오르그 옌센의 코브라 컬렉션. 뱀의 우아한 곡선을 모티브로 한 촛대입니다.',
    originalPrice: 320000,
    salePrice: 224000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80'],
    stock: 4,
    featured: false,
    source: 'model-house',
    tags: ['촛대', '실버', '덴마크'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 123,
    likes: 15,
    colors: ['실버', '골드']
  }
];

export default function AccessoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('인기순');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        // 액세서리 관련 상품들 필터링
        const accessoryProducts = allProducts.filter(product => 
          product.category === 'accessories' || 
          product.name.includes('액세서리') || 
          product.name.includes('화병') || 
          product.name.includes('거울') ||
          product.name.includes('시계') ||
          product.name.includes('오브제') ||
          product.name.includes('캔들')
        );
        // 실제 데이터가 없으면 목업 데이터 사용
        const finalProducts = accessoryProducts.length > 0 ? accessoryProducts : accessoriesMockData;
        setProducts(finalProducts);
        setFilteredProducts(finalProducts);
      } catch (error) {
        console.error('상품 로드 실패, 목업 데이터 사용:', error);
        setProducts(accessoriesMockData);
        setFilteredProducts(accessoriesMockData);
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
            <Sparkles className="w-16 h-16 text-purple-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4 font-serif"
          >
            액세서리
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            공간에 개성을 더하는 디자인 액세서리 컬렉션
          </motion.p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">액세서리 {filteredProducts.length}개</span>
            </div>

            <div className="flex items-center space-x-4">
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
              <p className="text-lg opacity-60">등록된 액세서리가 없습니다.</p>
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