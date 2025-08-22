'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import PageLayout from '@/components/layout/PageLayout';
import ProductFilter from '@/components/features/ProductFilter';
import { getAllProducts } from '@/lib/products';
import { Product } from '@/types';

// 브랜드 정보 매핑
const brandInfo: Record<string, {
  name: string;
  title: string;
  description: string;
  image: string;
  story: string;
  features: string[];
}> = {
  'herman-miller': {
    name: 'Herman Miller',
    title: '아이코닉 오피스 가구',
    description: '세계적인 디자이너들이 만든 혁신적인 오피스 가구',
    image: '/hero.jpg',
    story: 'Herman Miller는 1905년부터 혁신적인 디자인과 뛰어난 품질로 전 세계 사무공간을 변화시켜온 브랜드입니다. 찰스 임스, 조지 넬슨 등 전설적인 디자이너들과의 협업으로 탄생한 아이코닉한 가구들은 시대를 초월한 가치를 인정받고 있습니다.',
    features: ['인체공학적 디자인', '지속가능한 소재', '혁신적인 기술', '시대를 초월한 디자인']
  },
  'bb-italia': {
    name: 'B&B Italia',
    title: '이탈리안 럭셔리',
    description: '현대적이고 세련된 이탈리아 명품 가구',
    image: '/modelhouse.jpg',
    story: 'B&B Italia는 1966년 설립된 이탈리아의 대표적인 명품 가구 브랜드입니다. 안토니오 치테리오, 파트리시아 우르키올라 등 세계 최고의 디자이너들과 협업하여 현대적이고 세련된 가구를 선보이고 있습니다.',
    features: ['이탈리아 장인정신', '모던 디자인', '프리미엄 소재', '혁신적인 기술']
  },
  'cassina': {
    name: 'Cassina',
    title: '모던 클래식',
    description: '시대를 초월한 디자인의 이탈리아 명품',
    image: '/exhibition.jpg',
    story: 'Cassina는 1927년 설립된 이탈리아의 전통 있는 가구 브랜드입니다. 르 코르뷔지에, 샬롯 페리앙 등 20세기 거장들의 작품을 재현하며, 클래식과 모던이 조화된 독특한 미학을 추구합니다.',
    features: ['마스터피스 컬렉션', '장인의 손길', '클래식 모던', '예술적 가치']
  },
  'poliform': {
    name: 'Poliform',
    title: '컨템포러리 엘레간스',
    description: '현대적 우아함을 담은 프리미엄 가구',
    image: '/SEATING.jpg',
    story: 'Poliform은 1970년 이탈리아에서 시작된 럭셔리 가구 브랜드입니다. 미니멀하면서도 우아한 디자인으로 현대적인 라이프스타일을 제안하며, 세계 유명인들이 선택하는 프리미엄 브랜드로 자리잡았습니다.',
    features: ['미니멀 디자인', '맞춤 제작', '프리미엄 마감', '모듈러 시스템']
  },
  'minotti': {
    name: 'Minotti',
    title: '이탈리안 마에스트로',
    description: '장인정신이 깃든 최고급 수제 가구',
    image: '/LIGHTING.jpg',
    story: 'Minotti는 1948년 설립된 이탈리아의 최고급 가구 브랜드입니다. 3대에 걸친 가족 경영으로 전통적인 장인정신을 이어가며, 로돌포 도르도니 등 세계적인 디자이너들과의 협업으로 예술품 같은 가구를 만들어내고 있습니다.',
    features: ['수제 장인정신', '최고급 소재', '타임리스 디자인', '이탈리안 엘레간스']
  }
};

export default function BrandPage() {
  const params = useParams();
  const brandSlug = params.brand as string;
  const brand = brandInfo[brandSlug];
  
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getAllProducts();
        // 해당 브랜드 상품들 필터링
        const brandProducts = products.filter(product => 
          product.brand?.toLowerCase().includes(brand?.name.toLowerCase().split(' ')[0] || '') ||
          product.brand?.toLowerCase() === brand?.name.toLowerCase()
        );
        setAllProducts(brandProducts);
        setFilteredProducts(brandProducts);
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    if (brand) {
      loadProducts();
    }
  }, [brand]);

  // 브랜드 정보가 없는 경우 404 처리
  if (!brand) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-light mb-4">브랜드를 찾을 수 없습니다</h1>
            <p className="text-muted-foreground mb-8">요청하신 브랜드 페이지가 존재하지 않습니다.</p>
            <Link 
              href="/brands" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              브랜드 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

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
      <section className="py-20 xs:py-16 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 텍스트 콘텐츠 */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <span className="inline-block bg-red-600 text-white px-4 py-2 text-sm font-bold rounded-lg mb-4">
                  쓸만한 가 특가
                </span>
                <h1 className="text-5xl xs:text-3xl md:text-6xl font-light mb-4 font-serif">
                  {brand.name}
                </h1>
                <h2 className="text-2xl xs:text-xl font-light mb-4 opacity-80">
                  {brand.title}
                </h2>
                <p className="text-lg xs:text-base opacity-70 leading-relaxed">
                  {brand.description}
                </p>
              </motion.div>

              {/* 브랜드 특징 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                {brand.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* 이미지 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden"
            >
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 브랜드 스토리 */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl xs:text-2xl font-light mb-8">브랜드 스토리</h2>
            <p className="text-lg xs:text-base opacity-80 leading-relaxed">
              {brand.story}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 상품 필터 및 목록 */}
      <ProductFilter
        products={allProducts}
        onFilteredProductsChange={setFilteredProducts}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        category="all"
      />

      {/* 상품 그리드 */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl xs:text-2xl font-light mb-4">
              {brand.name} 컬렉션
            </h2>
            <p className="text-muted-foreground">
              쓸만한 가에서 엄선한 {brand.name}의 특별한 가구들을 만나보세요
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg opacity-60 mb-4">현재 {brand.name} 상품이 준비 중입니다.</p>
              <p className="text-sm opacity-40 mb-8">곧 다양한 상품들을 만나보실 수 있습니다.</p>
              <Link 
                href="/products" 
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                다른 상품 둘러보기
              </Link>
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
                  className="group cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="aspect-[4/5] relative overflow-hidden rounded-lg bg-gray-50 mb-3">
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
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {product.brand}
                      </p>
                      <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors min-h-[2.5rem]">
                        {product.name}
                      </h3>
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
