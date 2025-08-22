'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, Clock, CheckCircle, Star, Package } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import ProductFilter from '@/components/features/ProductFilter';
import { Product } from '@/types';

// RDM(Ready-to-Move) 상품 목업 데이터
const rdmProducts: Product[] = [
  {
    id: 'rdm-1',
    name: 'Complete Living Room Set 거실 풀세트',
    brand: 'SEDEC',
    category: 'furniture',
    description: '소파, 커피테이블, 사이드테이블이 포함된 거실 풀세트. 즉시 입주 가능한 완벽한 조합입니다.',
    originalPrice: 3200000,
    salePrice: 2240000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    stock: 2,
    featured: true,
    source: 'model-house',
    tags: ['풀세트', '거실', '즉시입주'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 456,
    likes: 34,
    colors: ['그레이', '베이지'],
    shipping: {
      free: true,
      period: '당일 배송',
      installation: true,
      installationFee: 0
    }
  },
  {
    id: 'rdm-2',
    name: 'Bedroom Essential Set 침실 필수 세트',
    brand: 'SEDEC',
    category: 'furniture',
    description: '침대, 매트리스, 협탁 2개가 포함된 침실 세트. 바로 사용 가능한 완벽한 구성입니다.',
    originalPrice: 1800000,
    salePrice: 1260000,
    discount: 30,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800&q=80'],
    stock: 3,
    featured: true,
    source: 'model-house',
    tags: ['침실세트', '매트리스포함', '즉시사용'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 378,
    likes: 28,
    colors: ['오크', '화이트'],
    shipping: {
      free: true,
      period: '당일 배송',
      installation: true,
      installationFee: 0
    }
  },
  {
    id: 'rdm-3',
    name: 'Office Starter Kit 홈오피스 스타터 키트',
    brand: 'Herman Miller',
    category: 'furniture',
    description: '책상, 의자, 수납장이 포함된 홈오피스 세트. 재택근무에 필요한 모든 것이 준비되어 있습니다.',
    originalPrice: 2400000,
    salePrice: 1680000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&q=80'],
    stock: 1,
    featured: true,
    source: 'model-house',
    tags: ['홈오피스', '재택근무', '완벽세트'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 523,
    likes: 41,
    colors: ['블랙', '화이트'],
    shipping: {
      free: true,
      period: '당일 배송',
      installation: true,
      installationFee: 0
    }
  },
  {
    id: 'rdm-4',
    name: 'Dining Room Complete 식당 풀세트',
    brand: 'Poliform',
    category: 'furniture',
    description: '식탁, 의자 4개, 사이드보드가 포함된 식당 풀세트. 가족 식사를 위한 완벽한 공간을 만들어드립니다.',
    originalPrice: 4500000,
    salePrice: 3150000,
    discount: 30,
    condition: 'excellent',
    images: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'],
    stock: 1,
    featured: false,
    source: 'model-house',
    tags: ['식당세트', '의자포함', '사이드보드'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 289,
    likes: 22,
    colors: ['월넛', '블랙'],
    shipping: {
      free: true,
      period: '당일 배송',
      installation: true,
      installationFee: 0
    }
  },
  {
    id: 'rdm-5',
    name: 'Studio Apartment Kit 원룸 풀패키지',
    brand: 'MUJI',
    category: 'furniture',
    description: '원룸이나 소형 아파트를 위한 올인원 가구 세트. 공간 활용도를 극대화한 스마트한 구성입니다.',
    originalPrice: 1200000,
    salePrice: 840000,
    discount: 30,
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'],
    stock: 5,
    featured: false,
    source: 'model-house',
    tags: ['원룸', '공간활용', '올인원'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 678,
    likes: 52,
    colors: ['내추럴', '화이트'],
    shipping: {
      free: true,
      period: '당일 배송',
      installation: true,
      installationFee: 0
    }
  },
  {
    id: 'rdm-6',
    name: 'Luxury Lighting Package 프리미엄 조명 패키지',
    brand: 'Tom Dixon',
    category: 'lighting',
    description: '거실, 침실, 식당용 조명이 모두 포함된 프리미엄 조명 패키지. 전체 공간의 조명을 한 번에 해결하세요.',
    originalPrice: 1800000,
    salePrice: 1260000,
    discount: 30,
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&q=80'],
    stock: 2,
    featured: false,
    source: 'model-house',
    tags: ['조명패키지', '전체공간', '프리미엄'],
    createdAt: new Date(),
    updatedAt: new Date(),
    views: 234,
    likes: 18,
    colors: ['골드', '브론즈'],
    shipping: {
      free: true,
      period: '당일 배송',
      installation: true,
      installationFee: 0
    }
  }
];

export default function RdmPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAllProducts(rdmProducts);
        setFilteredProducts(rdmProducts);
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
            <p>RDM 상품을 불러오는 중...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-gradient-to-b from-green-50 to-background">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <Truck className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            Ready to Move
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            즉시 입주 가능한 완벽한 가구 세트 • 당일 배송 • 무료 설치
          </motion.p>

          {/* RDM 혜택 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium mb-2">즉시 사용</h3>
              <p className="text-sm opacity-60">바로 사용 가능한 완벽한 세트</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium mb-2">당일 배송</h3>
              <p className="text-sm opacity-60">오늘 주문하면 오늘 받기</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium mb-2">무료 설치</h3>
              <p className="text-sm opacity-60">전문가 설치 서비스 무료</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium mb-2">A급 품질</h3>
              <p className="text-sm opacity-60">엄선된 최고 품질만</p>
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
        category="rdm"
      />

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8' 
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
                    
                    {/* RDM 전용 뱃지 */}
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      당일 배송
                    </div>
                    
                    {/* 할인 뱃지 */}
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {product.discount}% OFF
                    </div>
                    
                    {/* 무료 설치 뱃지 */}
                    <div className="absolute top-12 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      무료 설치
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
                    
                    {/* 배송 정보 */}
                    <div className="bg-green-50 p-2 rounded text-xs text-green-700">
                      <div className="flex items-center space-x-1">
                        <Truck className="w-3 h-3" />
                        <span>{product.shipping?.period} • 무료 설치</span>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between pt-1">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-400 line-through">
                          ₩{product.originalPrice.toLocaleString()}
                        </div>
                        <div className="font-semibold text-green-600">
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

      {/* How it Works */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-12 text-center">RDM 서비스 프로세스</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: '세트 선택',
                description: '필요한 공간에 맞는 완벽한 가구 세트를 선택하세요',
                icon: Package
              },
              {
                step: '02',
                title: '주문 확정',
                description: '간편한 온라인 주문으로 바로 결제 완료',
                icon: CheckCircle
              },
              {
                step: '03',
                title: '당일 배송',
                description: '전문 배송팀이 당일 안전하게 배송해드립니다',
                icon: Truck
              },
              {
                step: '04',
                title: '무료 설치',
                description: '전문 설치팀이 완벽하게 설치하고 정리까지',
                icon: Star
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-background" />
                  </div>
                  <div className="text-2xl font-light text-primary mb-2">{step.step}</div>
                  <h3 className="font-medium mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl xs:text-2xl font-light mb-4">
              오늘 주문하면 오늘 완성!
            </h2>
            <p className="text-lg xs:text-base opacity-70 mb-8">
              쓸만한 가의 RDM 서비스로 번거로움 없이 완벽한 공간을 만들어보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#products"
                className="inline-flex items-center px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                RDM 상품 보기
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center px-8 py-3 border border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition-colors font-medium"
              >
                전문가 상담
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}