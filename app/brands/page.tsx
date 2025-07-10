'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Award, TrendingUp, Users, Package } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';

const brands = [
  {
    id: 1,
    name: 'Herman Miller',
    country: '미국',
    founded: 1905,
    description: '에르고노믹 디자인의 선구자, 혁신적인 오피스 가구 전문',
    logo: '/hero.jpg',
    banner: '/SEATING.jpg',
    productCount: 245,
    rating: 4.9,
    reviews: 1250,
    category: ['의자', '책상', '수납가구'],
    featured: true,
    priceRange: '50만원 - 200만원',
    specialty: 'ergonomic'
  },
  {
    id: 2,
    name: 'B&B Italia',
    country: '이탈리아',
    founded: 1966,
    description: '이탈리아 럭셔리 가구의 대표, 모던 디자인의 아이콘',
    logo: '/exhibition.jpg',
    banner: '/hero.jpg',
    productCount: 189,
    rating: 4.8,
    reviews: 890,
    category: ['소파', '의자', '테이블'],
    featured: true,
    priceRange: '100만원 - 500만원',
    specialty: 'luxury'
  },
  {
    id: 3,
    name: 'Cassina',
    country: '이탈리아',
    founded: 1927,
    description: '모던 클래식의 정수, 시대를 초월한 디자인',
    logo: '/modelhouse.jpg',
    banner: '/LIGHTING.jpg',
    productCount: 156,
    rating: 4.9,
    reviews: 734,
    category: ['소파', '의자', '테이블'],
    featured: true,
    priceRange: '150만원 - 800만원',
    specialty: 'classic'
  },
  {
    id: 4,
    name: 'HAY',
    country: '덴마크',
    founded: 2002,
    description: '북유럽 모던 디자인의 새로운 바람',
    logo: '/STORAGE .jpg',
    banner: '/modelhouse.jpg',
    productCount: 98,
    rating: 4.6,
    reviews: 445,
    category: ['의자', '테이블', '조명'],
    featured: false,
    priceRange: '30만원 - 150만원',
    specialty: 'nordic'
  },
  {
    id: 5,
    name: 'Poliform',
    country: '이탈리아',
    founded: 1970,
    description: '컨템포러리 엘레간스의 완성',
    logo: '/LIGHTING.jpg',
    banner: '/STORAGE .jpg',
    productCount: 123,
    rating: 4.7,
    reviews: 567,
    category: ['수납가구', '침실', '주방'],
    featured: false,
    priceRange: '200만원 - 1000만원',
    specialty: 'contemporary'
  },
  {
    id: 6,
    name: 'Tom Dixon',
    country: '영국',
    founded: 2002,
    description: '혁신적인 소재와 독창적인 디자인',
    logo: '/exhibition.jpg',
    banner: '/LIGHTING.jpg',
    productCount: 67,
    rating: 4.5,
    reviews: 234,
    category: ['조명', '액세서리'],
    featured: false,
    priceRange: '20만원 - 100만원',
    specialty: 'innovative'
  }
];

const categories = ['전체', '의자', '소파', '테이블', '수납가구', '조명', '액세서리'];
const countries = ['전체', '이탈리아', '미국', '덴마크', '영국', '독일'];
const specialties = {
  ergonomic: { label: '에르고노믹', color: 'bg-blue-500' },
  luxury: { label: '럭셔리', color: 'bg-purple-500' },
  classic: { label: '클래식', color: 'bg-amber-500' },
  nordic: { label: '북유럽', color: 'bg-green-500' },
  contemporary: { label: '컨템포러리', color: 'bg-red-500' },
  innovative: { label: '혁신적', color: 'bg-orange-500' }
};

export default function BrandsPage() {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedCountry, setSelectedCountry] = useState('전체');
  const [sortBy, setSortBy] = useState('인기순');

  const filteredBrands = brands.filter(brand => {
    const categoryMatch = selectedCategory === '전체' || brand.category.includes(selectedCategory);
    const countryMatch = selectedCountry === '전체' || brand.country === selectedCountry;
    return categoryMatch && countryMatch;
  });

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
              <Award className="w-8 h-8 text-background" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl xs:text-3xl md:text-5xl font-light mb-4"
          >
            프리미엄 브랜드
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg xs:text-base opacity-70 max-w-2xl mx-auto"
          >
            세계적인 디자이너 가구 브랜드들의 특별한 컬렉션
          </motion.p>

          {/* 통계 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-12"
          >
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">50+</div>
              <div className="text-sm opacity-60">글로벌 브랜드</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">120년</div>
              <div className="text-sm opacity-60">최장 역사</div>
            </div>
            <div className="text-center">
              <div className="text-2xl xs:text-xl font-light">2,500+</div>
              <div className="text-sm opacity-60">프리미엄 상품</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">피처드 브랜드</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {brands.filter(brand => brand.featured).map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/brands/${brand.id}`} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                    <Image
                      src={brand.banner}
                      alt={brand.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-light mb-1">{brand.name}</h3>
                      <p className="text-sm opacity-90">{brand.country} · {brand.founded}년</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className={`${specialties[brand.specialty as keyof typeof specialties].color} text-white px-2 py-1 rounded text-xs font-medium`}>
                        {specialties[brand.specialty as keyof typeof specialties].label}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {brand.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{brand.rating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({brand.reviews.toLocaleString()})
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {brand.productCount}개 상품
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-t border-b">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* 카테고리 필터 */}
            <div className="flex items-center space-x-4 overflow-x-auto">
              <span className="text-sm font-medium whitespace-nowrap">카테고리:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    whitespace-nowrap px-3 py-1 text-sm transition-all duration-200
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

            <div className="flex items-center space-x-4">
              {/* 국가 필터 */}
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 border border-border bg-background text-foreground rounded focus:outline-none focus:border-foreground"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              {/* 정렬 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border bg-background text-foreground rounded focus:outline-none focus:border-foreground"
              >
                <option value="인기순">인기순</option>
                <option value="이름순">이름순</option>
                <option value="설립순">설립순</option>
                <option value="상품수순">상품수순</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* All Brands Grid */}
      <section className="py-16 xs:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl xs:text-2xl font-light mb-8 text-center">모든 브랜드</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/brands/${brand.id}`} className="block">
                  <div className="border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground">
                    {/* 브랜드 로고/이미지 */}
                    <div className="relative w-full h-32 mb-4 rounded overflow-hidden">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* 브랜드 정보 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-light">{brand.name}</h3>
                        <div className={`${specialties[brand.specialty as keyof typeof specialties].color} text-white px-2 py-1 rounded text-xs font-medium`}>
                          {specialties[brand.specialty as keyof typeof specialties].label}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{brand.country}</span>
                        <span>·</span>
                        <span>{brand.founded}년 설립</span>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {brand.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {brand.category.map((cat) => (
                          <span key={cat} className="text-xs bg-muted px-2 py-1 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{brand.rating}</span>
                            <span className="text-muted-foreground">
                              ({brand.reviews.toLocaleString()})
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Package className="w-4 h-4" />
                            <span>{brand.productCount}개</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          가격대: {brand.priceRange}
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
      <section className="py-16 xs:py-12 px-4 bg-secondary">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl xs:text-2xl font-light mb-4">
              원하는 브랜드를 찾지 못하셨나요?
            </h2>
            <p className="text-lg xs:text-base opacity-70 mb-8">
              문의하시면 원하는 브랜드 제품을 찾아드립니다
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/ai-chat"
                className="inline-block bg-foreground text-background px-8 py-3 text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all duration-200"
              >
                AI 상담하기
              </Link>
              <Link 
                href="/products"
                className="inline-block border border-foreground text-foreground px-8 py-3 text-sm font-medium tracking-wide hover:bg-foreground hover:text-background transition-all duration-200"
              >
                전체 상품 보기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
} 