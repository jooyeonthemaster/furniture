'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, Eye, TrendingUp, Award, Crown } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const bestProducts = [
  {
    id: 1,
    name: 'Herman Miller Aeron 의자',
    brand: 'Herman Miller',
    originalPrice: 1890000,
    salePrice: 567000,
    discount: 70,
    rating: 4.9,
    reviews: 256,
    sales: 1250,
    image: '/SEATING.jpg',
    condition: 'A급',
    rank: 1,
    badge: 'best-seller'
  },
  {
    id: 2,
    name: 'B&B Italia Charles 소파',
    brand: 'B&B Italia',
    originalPrice: 4500000,
    salePrice: 1350000,
    discount: 70,
    rating: 4.8,
    reviews: 189,
    sales: 890,
    image: '/hero.jpg',
    condition: 'A급',
    rank: 2,
    badge: 'most-loved'
  },
  {
    id: 3,
    name: 'Cassina LC4 샤롱',
    brand: 'Cassina',
    originalPrice: 3200000,
    salePrice: 800000,
    discount: 75,
    rating: 4.9,
    reviews: 324,
    sales: 780,
    image: '/LIGHTING.jpg',
    condition: 'A급',
    rank: 3,
    badge: 'editor-choice'
  },
  {
    id: 4,
    name: 'String System 선반',
    brand: 'String',
    originalPrice: 650000,
    salePrice: 390000,
    discount: 40,
    rating: 4.6,
    reviews: 445,
    sales: 650,
    image: '/modelhouse.jpg',
    condition: 'A급',
    rank: 4,
    badge: 'rising-star'
  },
  {
    id: 5,
    name: 'Tom Dixon Beat Light',
    brand: 'Tom Dixon',
    originalPrice: 450000,
    salePrice: 315000,
    discount: 30,
    rating: 4.7,
    reviews: 289,
    sales: 520,
    image: '/exhibition.jpg',
    condition: 'A급',
    rank: 5,
    badge: 'design-award'
  },
  {
    id: 6,
    name: 'HAY Mags 소파',
    brand: 'HAY',
    originalPrice: 2100000,
    salePrice: 1260000,
    discount: 40,
    rating: 4.5,
    reviews: 198,
    sales: 450,
    image: '/LIGHTING.jpg',
    condition: 'B급',
    rank: 6,
    badge: 'value-pick'
  }
];

const categories = ['전체', '의자', '소파', '테이블', '수납가구', '조명', '액세서리'];
const badges = {
  'best-seller': { label: '베스트셀러', color: 'bg-red-500', icon: TrendingUp },
  'most-loved': { label: '고객선호', color: 'bg-pink-500', icon: Heart },
  'editor-choice': { label: '에디터 픽', color: 'bg-purple-500', icon: Award },
  'rising-star': { label: '급상승', color: 'bg-orange-500', icon: Star },
  'design-award': { label: '디자인상', color: 'bg-blue-500', icon: Crown },
  'value-pick': { label: '가성비', color: 'bg-green-500', icon: Eye }
};

export default function BestPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('인기순');

  const filteredProducts = bestProducts.filter(product => 
    selectedCategory === '전체' || product.name.includes(selectedCategory)
  );

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 xs:py-12 px-4 bg-gradient-to-b from-secondary to-background">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-6"
          >
            <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-background" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            베스트 상품
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            고객들이 가장 사랑하는 프리미엄 가구들을 만나보세요
          </motion.p>

          {/* 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-12"
          >
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">5,000+</div>
              <div className="text-sm opacity-60">누적 판매</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">4.8★</div>
              <div className="text-sm opacity-60">평균 평점</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">95%</div>
              <div className="text-sm opacity-60">재구매율</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* 카테고리 필터 */}
            <div className="flex items-center space-x-4 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    whitespace-nowrap px-4 py-2 text-sm font-medium transition-all duration-200
                    ${selectedCategory === category
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 정렬 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-border bg-background text-foreground rounded-lg focus:outline-none focus:border-foreground"
            >
              <option value="인기순">인기순</option>
              <option value="평점순">평점순</option>
              <option value="판매순">판매순</option>
              <option value="할인율순">할인율순</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              const badgeConfig = badges[product.badge as keyof typeof badges];
              const BadgeIcon = badgeConfig.icon;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative overflow-hidden bg-muted rounded-lg">
                      {/* 랭킹 배지 */}
                      <div className="absolute top-4 left-4 z-10">
                        <div className="w-8 h-8 bg-foreground text-background rounded-full flex items-center justify-center text-sm font-bold">
                          {product.rank}
                        </div>
                      </div>

                      {/* 상품 배지 */}
                      <div className="absolute top-4 right-4 z-10">
                        <div className={`${badgeConfig.color} text-white px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1`}>
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badgeConfig.label}</span>
                        </div>
                      </div>

                      {/* 이미지 */}
                      <div className="aspect-square relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* 호버 오버레이 */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white text-black px-4 py-2 rounded-lg font-medium">
                          자세히 보기
                        </div>
                      </div>
                    </div>

                    {/* 상품 정보 */}
                    <div className="pt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{product.brand}</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded">{product.condition}</span>
                      </div>
                      
                      <h3 className="font-medium text-lg leading-tight group-hover:opacity-70 transition-opacity">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          리뷰 {product.reviews.toLocaleString()}개
                        </span>
                        <span className="text-sm text-muted-foreground">
                          판매 {product.sales.toLocaleString()}개
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold">
                            {product.salePrice.toLocaleString()}원
                          </span>
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            {product.discount}%
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground line-through">
                          {product.originalPrice.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl xs:text-2xl font-light mb-4">
              더 많은 상품이 궁금하다면?
            </h2>
            <p className="text-lg xs:text-base opacity-70 mb-8">
              전체 컬렉션에서 당신만의 특별한 가구를 찾아보세요
            </p>
            <Link 
              href="/products"
              className="inline-block bg-foreground text-background px-8 py-3 text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all duration-200"
            >
              전체 상품 보기
            </Link>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
} 